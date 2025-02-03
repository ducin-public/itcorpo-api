import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';

import { Project, ErrorResponse, ProjectEmployeeInvolvement } from '../contract-types/data-contracts';
import { Projects } from '../contract-types/ProjectsRoute';
import { dbConnection } from '../lib/db/db-connection';
import { filterProjects, sortProjects } from './project-filters';
import { handleRouterError } from './core/error';
import { DBProject } from '../lib/db/db-zod-schemas/project.schema';
import { getPaginationValues } from './core/pagination';
import { getDuration } from './core/time';

const router = Router();
const MAX_PAGE_SIZE = 20;

// GET /projects/count
router.get('/count', async (
    req: Request<
        Projects.GetProjectsCount.RequestParams,
        Projects.GetProjectsCount.ResponseBody,
        Projects.GetProjectsCount.RequestBody,
        Projects.GetProjectsCount.RequestQuery
    >,
    res: Response<Projects.GetProjectsCount.ResponseBody | ErrorResponse>
) => {
    try {
        const projectsWithTeams = await dbConnection.projects.aggregate([{
            $lookup: {
                from: "projectTeams" as const,
                localField: "id",
                foreignField: "projectId",
                as: "team" as const
            }
        }]);

        const result = filterProjects(req.query, projectsWithTeams);
        res.json(result.length);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to count projects',
        });
    }
});

// GET /projects
router.get('/', async (
    req: Request<
        Projects.GetProjects.RequestParams,
        Projects.GetProjects.ResponseBody,
        Projects.GetProjects.RequestBody,
        Projects.GetProjects.RequestQuery
    >,
    res: Response<Projects.GetProjects.ResponseBody | ErrorResponse>
) => {
    try {
        const projectsWithTeams = await dbConnection.projects.aggregate([{
            $lookup: {
                from: "projectTeams" as const,
                localField: "id",
                foreignField: "projectId",
                as: "team" as const
            }
        }]);
        let result = filterProjects(req.query, projectsWithTeams);
        const allResultsCount = result.length;

        result = sortProjects(req.query, result);

        const { page, pageSize } = getPaginationValues({ ...req.query, MAX_PAGE_SIZE });
        result = result.slice((page - 1) * pageSize, page * pageSize);
        const allResultsPages = Math.ceil(allResultsCount / pageSize);

        // headers have to be set BEFORE sending the response
        res.setHeaders(new Headers({
            'X-Total-Count': allResultsCount.toString(),
            'X-Total-Pages': allResultsPages.toString()
        })).json(result)

    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to fetch projects',
        });
    }
});

// GET /projects/:projectId
router.get('/:projectId', async (
    req: Request<
        Projects.GetProjectById.RequestParams,
        Projects.GetProjectById.ResponseBody,
        Projects.GetProjectById.RequestBody,
        Projects.GetProjectById.RequestQuery
    >,
    res: Response<Projects.GetProjectById.ResponseBody | ErrorResponse>
) => {
    try {
        const [project] = await dbConnection.projects.aggregate([{
            $match: { id: { $eq: req.params.projectId } }
        }, {
            $lookup: {
                from: "projectTeams" as const,
                localField: "id",
                foreignField: "projectId",
                as: "team" as const
            }
        }]);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to fetch project',
        });
    }
});

// POST /projects
router.post('/', async (
    req: Request<
        Projects.CreateProject.RequestParams,
        Projects.CreateProject.ResponseBody,
        Projects.CreateProject.RequestBody,
        Projects.CreateProject.RequestQuery
    >,
    res: Response<Projects.CreateProject.ResponseBody | ErrorResponse>
) => {
    try {
        const newProject: DBProject = {
            id: randomUUID(),
            ...req.body,
        };
        
        const created = await dbConnection.projects.insertOne(newProject);
        await dbConnection.projects.flush();

        res.status(201).json(created);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to create project',
        });
    }
});

// PUT /projects/:projectId
router.put('/:projectId', async (
    req: Request<
        Projects.UpdateProject.RequestParams,
        Projects.UpdateProject.ResponseBody,
        Projects.UpdateProject.RequestBody,
        Projects.UpdateProject.RequestQuery
    >,
    res: Response<Projects.UpdateProject.ResponseBody | ErrorResponse>
) => {
    try {
        const projectToUpdate = await dbConnection.projects.findOne({ $match: { id: { $eq: req.params.projectId } } });
        
        if (!projectToUpdate) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const updatedProject: Project = {
            ...projectToUpdate,
            ...req.body,
            id: req.params.projectId
        };

        await dbConnection.projects.updateOne({ $match: { id: { $eq: req.params.projectId } } }, updatedProject);
        await dbConnection.projects.flush();
        
        res.json(updatedProject);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to update project',
        });
    }
});

// DELETE /projects/:projectId
router.delete('/:projectId', async (
    req: Request<
        Projects.DeleteProject.RequestParams,
        Projects.DeleteProject.ResponseBody,
        Projects.DeleteProject.RequestBody,
        Projects.DeleteProject.RequestQuery
    >,
    res: Response<Projects.DeleteProject.ResponseBody | ErrorResponse>
) => {
    try {
        const projectToDelete = await dbConnection.projects.findOne({ $match: { id: { $eq: req.params.projectId } } });
        
        if (!projectToDelete) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await dbConnection.projects.deleteOne({ $match: { id: { $eq: req.params.projectId } } });
        await dbConnection.projects.flush();
        res.status(204).send();
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to delete project',
        });
    }
});

// GET /projects/:projectId/team
router.get('/:projectId/team', async (
    req: Request<
        Projects.GetProjectTeam.RequestParams,
        Projects.GetProjectTeam.ResponseBody,
        Projects.GetProjectTeam.RequestBody,
        Projects.GetProjectTeam.RequestQuery
    >,
    res: Response<Projects.GetProjectTeam.ResponseBody | ErrorResponse>
) => {
    try {
        const project = await dbConnection.projects.findOne({ $match: { id: { $eq: req.params.projectId } } });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const projectTeams = await dbConnection.projectTeams.findMany({ $match: { projectId: { $eq: req.params.projectId } } });
        const employees = await dbConnection.employees.findMany();
        
        const projectInvolvements: ProjectEmployeeInvolvement[] = projectTeams.map(involvement => {
            const employee = employees.find(e => e.id === involvement.employeeId)!;
            return {
                employeeId: employee.id,
                projectId: project.id,
                employeeName: `${employee.firstName} ${employee.lastName}`,
                employeePosition: employee.position,
                ...(employee.imgURL && { employeeURL: employee.imgURL }),
                projectName: project.name,
                projectStatus: project.status,
                engagementLevel: involvement.engagementLevel,
                startDate: involvement.startDate,
                endDate: involvement.endDate,
                duration: getDuration({
                    startDate: new Date(involvement.startDate),
                    endDate: involvement.endDate ? new Date(involvement.endDate) : new Date()
                })
            };
        });

        const result: Projects.GetProjectTeam.ResponseBody = {
            project,
            team: projectInvolvements
        }

        res.json(result);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to fetch project team',
        });
    }
});

export const projectsRouter = router;
