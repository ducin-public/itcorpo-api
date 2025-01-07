import { Router, Request, Response } from 'express';

import { Project, ErrorResponse, ProjectsSearchCriteria } from '../contract-types/data-contracts';
import { Projects } from '../contract-types/ProjectsRoute';
import { db } from '../lib/db';

const router = Router();

function processProjectsSearchCriteria(projects: Project[], criteria: ProjectsSearchCriteria): Project[] {
    let result = [...projects];

    // Filter by project name if provided
    if (criteria.projectName) {
        const searchName = criteria.projectName.toLowerCase();
        result = result.filter(project => 
            project.name.toLowerCase().includes(searchName)
        );
    }

    // Filter by status if provided
    if (criteria.status) {
        result = result.filter(project => 
            project.status === criteria.status
        );
    }

    // Filter by team members if provided
    const teamMembers = criteria.teamMembers?.split(',').map(Number);
    if (teamMembers?.length) {
        result = result.filter(project => 
            project.team.some(member => teamMembers.includes(member.id))
        );
    }

    // Filter by budget range if provided
    if (criteria.budgetFrom) {
        const minBudget = Number(criteria.budgetFrom);
        result = result.filter(project => project.budget >= minBudget);
    }
    if (criteria.budgetTo) {
        const maxBudget = Number(criteria.budgetTo);
        result = result.filter(project => project.budget <= maxBudget);
    }

    return result;
}

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
        await db.read();
        const filteredProjects = processProjectsSearchCriteria(db.data.projects, req.query);
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
        await db.read();
        const filteredProjects = processProjectsSearchCriteria(db.data.projects, req.query);
        res.json(filteredProjects);
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
        await db.read();
        const projectId = req.params.projectId;
        const project = db.data.projects.find(p => p.id === projectId);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.json(project);
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
        await db.read();
        const projectData = { ...req.body };
        
        const newProject: Project = {
            ...projectData,
            id: Math.random().toString(36).substr(2, 9) // Generate random ID
        };
        
        db.data.projects.push(newProject);
        await db.write();
        
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
        await db.read();
        const projectId = req.params.projectId;
        const projectData = { ...req.body };
        const projectToUpdate = db.data.projects.find(p => p.id === projectId);
        
        if (!projectToUpdate) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const updatedProject: Project = {
            ...projectToUpdate,
            ...projectData,
            id: req.params.projectId
        };

        db.data.projects = db.data.projects.map(p => 
            p.id === req.params.projectId ? updatedProject : p
        );
        await db.write();
        
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
        await db.read();
        const projectId = req.params.projectId;
        const initialLength = db.data.projects.length;
        
        db.data.projects = db.data.projects.filter(p => p.id !== projectId);
        
        if (db.data.projects.length === initialLength) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        await db.write();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: `Failed to delete project: ${error}` });
    }
});

export const projectsRouter = router;