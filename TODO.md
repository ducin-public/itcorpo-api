# todos

                duration: getDuration({
                    startDate: new Date(assignment.since),
                    endDate: new Date() // FIXME: use actual end date
                })


- [ ] osobno error id i osobno correlation id
- openapi validation: http://localhost:3000/employees/91720
- .hbs files
- rewrite router
- https://www.npmjs.com/package/helmet
- license content-type: https://swagger.io/docs/specification/v3_0/describing-parameters/#header-parameters

- search feed for employees autocompleter:
export interface EmployeesSearchCriteria {
  mode?: "STANDARD" | "SEARCH_FEED";
}
        mode:
          type: string
          enum: ["STANDARD", "SEARCH_FEED"]
if (req.query.mode === 'SEARCH_FEED'){
    filteredEmployees = filteredEmployees.map( e => id,name)
}

------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------

type ContractEndpoint = {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  path: string;
  alias?: string;
  description?: string;
  requestFormat: 'json';
  parameters?: Array<{
    name: string;
    type: 'Path' | 'Query' | 'Body' | 'Header';
    schema: z.ZodType<any>;
  }>;
  response: {
    type: 'ZOD_SCHEMA';
    schema: z.ZodType<any>;
  };
  errors: Array<{
    status: number;
    description: string;
    schema: z.ZodType<any>;
  }>;
};

export const contractEndpoints: ContractEndpoint[] = [...];

------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------

please use vitest to implement a dynamic test suite in resources/dynamic.spec.ts file. It will use the contractEndpoints to iterate over all endpoints.

It's important to note that this is the data structure of each endpoint:
```ts
type ContractEndpoint = {
  method: "get" | "post" | "put" | "patch" | "delete";
  path: string;
  alias?: string;
  description?: string;
  requestFormat: "json";
  parameters?: Array<{
    name: string;
    type: "Path" | "Query" | "Body" | "Header";
    schema: z.ZodType<any>;
  }>;
  response: {
    type: "ZOD_SCHEMA";
    schema: z.ZodType<any>;
  };
  errors: Array<{
    status: number;
    description: string;
    schema: z.ZodType<any>;
  }>;
};
```

Make sure to use HTTP correctly:
- the path
the http method
- the requestFormat
- parameters (and their type: "Path" | "Query" | "Body" | "Header")
- the expected response
- and finally: the potential errors.

this is a reference test that dhould be dynamically implemented:
```ts
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
  it('should respond with 200 status code', async () => {
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
```
