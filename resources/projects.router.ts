import { Router, Request, Response } from 'express';

import { Project, ErrorResponse, ProjectEmployeeInvolvement } from '../contract-types/data-contracts';
import { Projects } from '../contract-types/ProjectsRoute';
import { dbConnection } from '../lib/db/db-connection';
import { filterProjects } from './project-filters';
import { attachTeamToProject, attachTeamToAllProjects } from './project-data-operations';
import { logRouterError } from './core/error';
import { randomUUID } from 'crypto';
import { DBProject } from '../lib/db/db-zod-schemas/project.schema';

const router = Router();

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
        const projectsPromise = dbConnection.projects.findMany();
        const projectTeamsPromise = dbConnection.projectTeams.findMany();

        const filteredProjects = filterProjects(req.query, {
            projects: await projectsPromise,
            projectTeams: await projectTeamsPromise,
        });

        res.json(filteredProjects.length);
    } catch (error) {
        logRouterError({
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
        const projectsPromise = dbConnection.projects.findMany();
        const projectTeamsPromise = dbConnection.projectTeams.findMany();

        const filteredProjects = filterProjects(req.query, {
            projects: await projectsPromise,
            projectTeams: await projectTeamsPromise,
        });

        const projectsWithTeams = attachTeamToAllProjects(filteredProjects, await projectTeamsPromise);
        res.json(projectsWithTeams);
    } catch (error) {
        logRouterError({
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
        const project = await dbConnection.projects.findOne({ $match: { id: { $eq: req.params.projectId } } });
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        const projectTeams = await dbConnection.projectTeams.findMany({ $match: { projectId: { $eq: project.id } } });
        const projectWithTeam = attachTeamToProject(project, projectTeams);
        res.json(projectWithTeam);
    } catch (error) {
        logRouterError({
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

        const projectTeams = await dbConnection.projectTeams.findMany({ $match: { projectId: { $eq: created.id } } });
        const projectWithTeam = attachTeamToProject(created, projectTeams);
        
        res.status(201).json(projectWithTeam);
    } catch (error) {
        logRouterError({
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
        logRouterError({
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
        logRouterError({
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
        
        const projectInvolvements: ProjectEmployeeInvolvement[] = projectTeams.map(assignment => {
            const employee = employees.find(e => e.id === assignment.employeeId)!;
            return {
                employeeId: employee.id,
                projectId: project.id,
                employeeName: `${employee.firstName} ${employee.lastName}`,
                projectName: project.name,
                projectStatus: project.status,
                engagementLevel: assignment.engagementLevel,
                since: assignment.since
            };
        });

        res.json(projectInvolvements);
    } catch (error) {
        logRouterError({
            error, req, res,
            publicError: 'Failed to fetch project team',
        });
    }
});

export const projectsRouter = router;
