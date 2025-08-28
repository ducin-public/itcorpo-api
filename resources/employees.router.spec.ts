import { describe, expect, it } from 'vitest';
import request from 'supertest';

import { contractEndpoints, contractSchemas } from '../contract-types/zod-schemas';
import { createServer } from '../server/server';

const app = createServer({
  chaos: false,
  routesRewrite: false,
  delay: false,
  jwtAuth: false,
  middlewares: {
    CONTRACT_VALIDATION: false,
    LOGGER: false,
    TENANT: false,
  }
});

describe('GET /employees', () => {
  const schema = contractEndpoints
    .find(endpoint => endpoint.path === '/employees' && endpoint.method === 'get')?.response.schema;
  if (!schema) {
    throw new Error('Employee schema not found');
  }

  const getEmployeesURL = ({ page, pageSize }: Partial<Record<'page' | 'pageSize', number>> = {}) => {
    const urlParams = new URLSearchParams();
    if (page != undefined) {
      urlParams.set('page', page.toString());
    }
    if (pageSize != undefined) {
      urlParams.set('pageSize', pageSize.toString());
    }
    return `/employees?${urlParams.toString()}`;
  }

  it(`should return employees (${getEmployeesURL()})`, async () => {
    const response = await request(app)
      .get('/employees')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((response) => {
        schema.parse(response.body);
      })
      .send();
  });

  describe('with pagination', () => {

    it(`should return first page with default page size (${getEmployeesURL()})`, async () => {
      const response = await request(app)
        .get(getEmployeesURL())
        .expect(200);
      
      schema.parse(response.body);
      expect(response.body.length).toBeLessThanOrEqual(50);
    });

    it(`should return specified page with custom page size (${getEmployeesURL({ page: 2, pageSize: 10 })})`, async () => {
      const response = await request(app)
        .get(getEmployeesURL({ page: 2, pageSize: 10 }))
        .expect(200);
      
      schema.parse(response.body);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it(`should return empty array for page beyond available data (${getEmployeesURL({ page: 100 })})`, async () => {
      const response = await request(app)
        .get(getEmployeesURL({ page: 100 }))
        .expect(200);
      
      schema.parse(response.body);
      expect(response.body).toHaveLength(0);
    });

    it(`should send 400 when maximum page size exceeded (${getEmployeesURL({ pageSize: 100 })})`, async () => {
      const response = await request(app)
        .get(getEmployeesURL({ pageSize: 100 }))
        .expect(400);
    });

    it(`should send 400 for invalid page (${getEmployeesURL({ page: -1 })})`, async () => {
      const response = await request(app)
        .get(getEmployeesURL({ page: -1 }))
        .expect(400);
    });

    it(`should send 400 for invalid page size (${getEmployeesURL({ pageSize: NaN })})`, async () => {
      const response = await request(app)
        .get(getEmployeesURL({ pageSize: NaN }))
        .expect(400);
    });

    it(`should send 400 for negative values (${getEmployeesURL({ page: -1, pageSize: -1 })})`, async () => {
      const response = await request(app)
        .get(getEmployeesURL({ page: -1, pageSize: -1 }))
        .expect(400);
    });
  });
});
