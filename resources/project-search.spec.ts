import { describe, it, expect } from 'vitest'

import { processProjectsSearchCriteria } from './project-search'
import { DbSchema } from '../lib/db'
import { mockProject } from '../mocks/projects.mock';
import { ProjectsSearchCriteria } from '../contract-types/data-contracts';

describe('processProjectsSearchCriteria', () => {
  const mockDb: Pick<DbSchema, 'projects'> = {
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
    ]
  };

  it('should return empty result for criteria with no match', async () => {
    // given
    const criteria: ProjectsSearchCriteria = {
      projectName: 'non-existent'
    };
    // when
    const results = processProjectsSearchCriteria(mockDb, criteria);
    // then
    expect(results).toHaveLength(0);
    expect(results.map(p => p.id)).toEqual([]);
  })
    
  it('should filter projects by name (case-insensitive partial match)', () => {
    // given
    const criteria: ProjectsSearchCriteria = { 
      projectName: 'cloud' 
    };
    // when
    const results = processProjectsSearchCriteria(mockDb, criteria);
    // then
    expect(results).toHaveLength(2);
    expect(results.map(p => p.id)).toEqual(['a1b', 'e3f']);
  });

  it('should filter projects by status', () => {
    // given
    const criteria: ProjectsSearchCriteria = { 
      status: 'ACTIVE' 
    };
    // when
    const results = processProjectsSearchCriteria(mockDb, criteria);
    // then
    expect(results).toHaveLength(2);
    expect(results.map(p => p.id)).toEqual(['a1b', 'e3f']);
  });

  it('should filter projects by team members with ANY mode', () => {
    // given
    const criteria: ProjectsSearchCriteria = { 
      teamMembers: '1,2'
    };
    // when
    const results = processProjectsSearchCriteria(mockDb, criteria);
    // then
    expect(results).toHaveLength(3);
    expect(results.map(p => p.id)).toEqual(['a1b', 'e3f', 'i5j']);
  });

  it('should filter projects by team members with ALL mode', () => {
    // given
    const criteria: ProjectsSearchCriteria = { 
      teamMembers: '1,2',
      teamMembersFiltering: 'ALL'
    };
    // when
    const results = processProjectsSearchCriteria(mockDb, criteria);
    // then
    expect(results).toHaveLength(2);
    expect(results.map(p => p.id)).toEqual(['a1b', 'i5j']);
  });

  it('should filter projects by minimum budget', () => {
    // given
    const criteria: ProjectsSearchCriteria = { 
      budgetFrom: '75000' 
    };
    // when
    const results = processProjectsSearchCriteria(mockDb, criteria);
    // then
    expect(results).toHaveLength(2);
    expect(results.map(p => p.id)).toEqual(['a1b', 'e3f']);
  });

  it('should filter projects by maximum budget', () => {
    // given
    const criteria: ProjectsSearchCriteria = { 
      budgetTo: '50000' 
    };
    // when
    const results = processProjectsSearchCriteria(mockDb, criteria);
    // then
    expect(results).toHaveLength(2);
    expect(results.map(p => p.id)).toEqual(['c2d', 'g4h']);
  });

  it('should filter projects by budget range', () => {
    // given
    const criteria: ProjectsSearchCriteria = {
      budgetFrom: '40000',
      budgetTo: '80000'
    };
    // when
    const results = processProjectsSearchCriteria(mockDb, criteria);
    // then
    expect(results).toHaveLength(3);
    expect(results.map(p => p.id)).toEqual(['a1b', 'g4h', 'i5j']);
  });

  it('should combine all search criteria', () => {
    // given
    const criteria: ProjectsSearchCriteria = {
      projectName: 'cloud',
      status: 'ACTIVE',
      teamMembers: '1,2',
      budgetFrom: '50000',
      budgetTo: '80000'
    };
    // when
    const results = processProjectsSearchCriteria(mockDb, criteria);
    // then
    expect(results).toHaveLength(1);
    expect(results.map(p => p.id)).toEqual(['a1b']);
  });
});
