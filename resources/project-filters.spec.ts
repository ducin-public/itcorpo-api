import { describe, it, expect } from 'vitest'

import { filterProjects } from './project-filters'
import { mockProject } from '../mocks/projects.mock';
import { Projects } from '../contract-types/ProjectsRoute';
import { DBProject } from '../lib/db/db-zod-schemas/project.schema';
import { DBProjectTeam } from '../lib/db/db-zod-schemas/project-team.schema';

describe('processProjectsSearchCriteria', () => {
  const mockDataset: {
    projects: DBProject[];
    projectTeams: DBProjectTeam[];
  } = {
    projects: [
      mockProject({
        id: 'a1b',
        name: 'Cloud Migration Project',
        status: 'ACTIVE',
        team: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
        budget: 75000
      }),
      mockProject({
        id: 'c2d',
        name: 'Mobile App Development',
        status: 'PLANNING',
        team: [{ id: 3, name: 'Bob' }],
        budget: 25000
      }),
      mockProject({
        id: 'e3f',
        name: 'Cloud Security Implementation',
        status: 'ACTIVE',
        team: [{ id: 1, name: 'John' }, { id: 4, name: 'Alice' }],
        budget: 100000
      }),
      mockProject({
        id: 'g4h',
        name: 'Website Redesign',
        status: 'COMPLETED',
        team: [{ id: 5, name: 'Eve' }],
        budget: 50000
      }),
      mockProject({
        id: 'i5j',
        name: 'Legacy System Migration',
        status: 'ON_HOLD',
        team: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
        budget: 60000
      })
    ],
    projectTeams: [
      { projectId: 'a1b', projectName: 'Cloud Migration Project', employeeId: 1, employeeName: 'John', engagementLevel: 'FULL_TIME', since: '2022-01-01' },
      { projectId: 'a1b', projectName: 'Cloud Migration Project', employeeId: 2, employeeName: 'Jane', engagementLevel: 'FULL_TIME', since: '2022-01-01' },
      { projectId: 'a1b', projectName: 'Cloud Migration Project', employeeId: 3, employeeName: 'Bob', engagementLevel: 'PARTIAL_PLUS', since: '2022-02-01' },
      { projectId: 'e3f', projectName: 'Cloud Security Implementation', employeeId: 1, employeeName: 'John', engagementLevel: 'HALF_TIME', since: '2022-03-01' },
      { projectId: 'e3f', projectName: 'Cloud Security Implementation', employeeId: 4, employeeName: 'Alice', engagementLevel: 'FULL_TIME', since: '2022-01-15' },
      { projectId: 'g4h', projectName: 'Website Redesign', employeeId: 5, employeeName: 'Eve', engagementLevel: 'FULL_TIME', since: '2022-06-01' },
      { projectId: 'i5j', projectName: 'Legacy System Migration', employeeId: 1, employeeName: 'John', engagementLevel: 'ON_DEMAND', since: '2022-04-01' },
      { projectId: 'i5j', projectName: 'Legacy System Migration', employeeId: 2, employeeName: 'Jane', engagementLevel: 'FULL_TIME', since: '2022-04-01' }
    ]
  };

  it('should return empty result for criteria with no match', async () => {
    // given
    const criteria: Projects.GetProjects.RequestQuery = {
      projectName: 'non-existent'
    };
    // when
    const results = filterProjects(criteria, mockDataset);
    // then
    expect(results).toHaveLength(0);
    expect(results.map(p => p.id)).toEqual([]);
  })
    
  it('should filter projects by name (case-insensitive partial match)', () => {
    // given
    const criteria: Projects.GetProjects.RequestQuery = { 
      projectName: 'cloud' 
    };
    // when
    const results = filterProjects(criteria, mockDataset);
    // then
    expect(results).toHaveLength(2);
    expect(results.map(p => p.id)).toEqual(['a1b', 'e3f']);
  });

  it('should filter projects by status', () => {
    // given
    const criteria: Projects.GetProjects.RequestQuery = { 
      status: 'ACTIVE' 
    };
    // when
    const results = filterProjects(criteria, mockDataset);
    // then
    expect(results).toHaveLength(2);
    expect(results.map(p => p.id)).toEqual(['a1b', 'e3f']);
  });

  it('should filter projects by team members with ANY mode', () => {
    // given
    const criteria: Projects.GetProjects.RequestQuery = { 
      teamMembers: '1,2'
    };
    // when
    const results = filterProjects(criteria, mockDataset);
    // then
    expect(results).toHaveLength(3);
    expect(results.map(p => p.id)).toEqual(['a1b', 'e3f', 'i5j']);
  });

  it('should filter projects by team members with ALL mode', () => {
    // given
    const criteria: Projects.GetProjects.RequestQuery = { 
      teamMembers: '1,2',
      teamMembersFiltering: 'ALL'
    };
    // when
    const results = filterProjects(criteria, mockDataset);
    // then
    expect(results).toHaveLength(2);
    expect(results.map(p => p.id)).toEqual(['a1b', 'i5j']);
  });

  it('should filter projects by minimum budget', () => {
    // given
    const criteria: Projects.GetProjects.RequestQuery = { 
      budgetFrom: '75000' 
    };
    // when
    const results = filterProjects(criteria, mockDataset);
    // then
    expect(results).toHaveLength(2);
    expect(results.map(p => p.id)).toEqual(['a1b', 'e3f']);
  });

  it('should filter projects by maximum budget', () => {
    // given
    const criteria: Projects.GetProjects.RequestQuery = { 
      budgetTo: '50000' 
    };
    // when
    const results = filterProjects(criteria, mockDataset);
    // then
    expect(results).toHaveLength(2);
    expect(results.map(p => p.id)).toEqual(['c2d', 'g4h']);
  });

  it('should filter projects by budget range', () => {
    // given
    const criteria: Projects.GetProjects.RequestQuery = {
      budgetFrom: '40000',
      budgetTo: '80000'
    };
    // when
    const results = filterProjects(criteria, mockDataset);
    // then
    expect(results).toHaveLength(3);
    expect(results.map(p => p.id)).toEqual(['a1b', 'g4h', 'i5j']);
  });

  it('should combine all search criteria', () => {
    // given
    const criteria: Projects.GetProjects.RequestQuery = {
      projectName: 'cloud',
      status: 'ACTIVE',
      teamMembers: '1,2',
      budgetFrom: '50000',
      budgetTo: '80000'
    };
    // when
    const results = filterProjects(criteria, mockDataset);
    // then
    expect(results).toHaveLength(1);
    expect(results.map(p => p.id)).toEqual(['a1b']);
  });
});
