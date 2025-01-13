import { describe, it } from 'vitest';
import request from 'supertest';

import { contractSchemas } from '../contract-types/zod-schemas';
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

describe('GET /geo', () => {
  it('should conform to contract', async () => {
    const response = await request(app)
      .get('/geo')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((response) => {
        contractSchemas.Geo.parse(response.body);
      })
      .send();
  });
});