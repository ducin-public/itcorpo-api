import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import { ProjectsSearchCriteria } from '../contract-types/data-contracts'
import { processProjectsSearchCriteria } from './project-search'
import { DbSchema, FileDb, initDb } from '../lib/db'
import { mockProject } from '../mocks/projects.mock';

describe('processProjectsSearchCriteria', () => {
  let db: FileDb<DbSchema>
  const mockDb: Pick<DbSchema, 'projects'> = {
    projects: [
      mockProject({
        name: 'Cloud Migration Project',
        status: 'ACTIVE',
        team: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
        budget: 75000
      }),
      mockProject({
        name: 'Mobile App Development',
        status: 'PLANNING',
        team: [{ id: 3, name: 'Bob' }],
        budget: 25000
      }),
      mockProject({
        name: 'Cloud Security Implementation',
        status: 'ACTIVE',
        team: [{ id: 1, name: 'John' }, { id: 4, name: 'Alice' }],
        budget: 100000
      }),
      mockProject({
        name: 'Website Redesign',
        status: 'COMPLETED',
        team: [{ id: 5, name: 'Eve' }],
        budget: 50000
      }),
      mockProject({
        name: 'Legacy System Migration',
        status: 'ON_HOLD',
        team: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
        budget: 60000
      })
    ]
  };

  beforeAll(async () => {
    db = await initDb();
  })

  afterAll(async () => {
    await db.close();
  })

  it('should return empty result for criteria with no match', async () => {
    const results = processProjectsSearchCriteria(mockDb, { projectName: 'non-existent' });
    expect(results).toHaveLength(0);
    expect(results).toMatchSnapshot();
  })
    
  it('should filter projects by name (case-insensitive partial match)', () => {
    const results = processProjectsSearchCriteria(mockDb, { projectName: 'cloud' });
    expect(results).toHaveLength(2);
    expect(results).toMatchSnapshot();
  });

  it('should filter projects by status', () => {
    const results = processProjectsSearchCriteria(mockDb, { status: 'ACTIVE' });
    expect(results).toHaveLength(2);
    expect(results).toMatchSnapshot();
  });

  it('should filter projects by team members with ANY mode', () => {
    const results = processProjectsSearchCriteria(mockDb, { 
      teamMembers: '1,2'
    });
    expect(results).toHaveLength(3);
    expect(results).toMatchSnapshot();
  });

  it('should filter projects by team members with ALL mode', () => {
    const results = processProjectsSearchCriteria(mockDb, { 
      teamMembers: '1,2',
      teamMembersMode: 'ALL'
    });
    expect(results).toHaveLength(2);
    expect(results).toMatchSnapshot();
  });

  it('should filter projects by minimum budget', () => {
    const results = processProjectsSearchCriteria(mockDb, { budgetFrom: '75000' });
    expect(results).toHaveLength(2);
    expect(results).toMatchSnapshot();
  });

  it('should filter projects by maximum budget', () => {
    const results = processProjectsSearchCriteria(mockDb, { budgetTo: '50000' });
    expect(results).toHaveLength(2);
    expect(results).toMatchSnapshot();
  });

  it('should filter projects by budget range', () => {
    const results = processProjectsSearchCriteria(mockDb, {
      budgetFrom: '40000',
      budgetTo: '80000'
    });
    expect(results).toHaveLength(3);
    expect(results).toMatchSnapshot();
  });

  it('should combine all search criteria', () => {
    const results = processProjectsSearchCriteria(mockDb, {
      projectName: 'cloud',
      status: 'ACTIVE',
      teamMembers: '1,2',
      budgetFrom: '50000',
      budgetTo: '80000'
    });
    expect(results).toHaveLength(1);
    expect(results).toMatchSnapshot();
  });
});
