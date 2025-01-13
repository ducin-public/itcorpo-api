import { describe, it } from 'vitest';
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

describe('GET /departments', () => {
  const schema = contractEndpoints
    .find(endpoint => endpoint.path === '/departments' && endpoint.method === 'get')?.response.schema;
  if (!schema) {
    throw new Error('Department schema not found');
  }

  it('should conform to contract', async () => {
    const response = await request(app)
      .get('/departments')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((response) => {
        schema.parse(response.body);
      })
      .send();
  });
});