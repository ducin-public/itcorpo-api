import { Router, Request, Response } from 'express';

import { Project, ErrorResponse, ProjectEmployeeInvolvement } from '../contract-types/data-contracts';
import { Projects } from '../contract-types/ProjectsRoute';
import { dbConnection } from '../lib/db/db-connection';
import { filterProjects } from './project-filters';
import { attachTeamToProject, attachTeamToAllProjects } from './project-data-operations';

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
        res.status(500).json({ message: `Failed to count projects: ${error}` });
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
        res.status(500).json({ message: `Failed to fetch projects: ${error}` });
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
        const project = await dbConnection.projects.findOne(p => p.id === req.params.projectId);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        const projectTeams = await dbConnection.projectTeams.findMany((pt) => pt.projectId === project.id);
        const projectWithTeam = attachTeamToProject(project, projectTeams);
        res.json(projectWithTeam);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch project: ${error}` });
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
        const newProject: Project = {
            ...req.body,
            id: Math.random().toString(36).substr(2, 9) // Generate random ID
        };
        
        await dbConnection.projects.insertOne(newProject);
        await dbConnection.projects.flush();
        
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: `Failed to create project: ${error}` });
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
        const projectToUpdate = await dbConnection.projects.findOne(p => p.id === req.params.projectId);
        
        if (!projectToUpdate) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const updatedProject: Project = {
            ...projectToUpdate,
            ...req.body,
            id: req.params.projectId
        };

        await dbConnection.projects.replaceOne(p => p.id === req.params.projectId, updatedProject);
        await dbConnection.projects.flush();
        
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: `Failed to update project: ${error}` });
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
        const projectToDelete = await dbConnection.projects.findOne(p => p.id === req.params.projectId);
        
        if (!projectToDelete) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await dbConnection.projects.deleteOne(p => p.id === req.params.projectId);
        await dbConnection.projects.flush();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: `Failed to delete project: ${error}` });
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
        const project = await dbConnection.projects.findOne(p => p.id === req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const projectTeams = await dbConnection.projectTeams.findMany(pt => pt.projectId === req.params.projectId);
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
        res.status(500).json({ message: `Failed to fetch project team: ${error}` });
    }
});

export const projectsRouter = router;
