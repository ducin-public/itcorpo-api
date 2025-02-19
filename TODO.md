# todos

- openapi validation: http://localhost:3000/employees/91720
- .hbs files
- rewrite router
- https://www.npmjs.com/package/helmet
- license content-type: https://swagger.io/docs/specification/v3_0/describing-parameters/#header-parameters

- search feed for employees autocompleter:
export interface EmployeesSearchCriteria {
  mode?: "STANDARD" | "SEARCH_FEED";
}

- winston?
- remake entire README.md
- check fixmes
- specifying contract for /auth and /license requires attention

----------------------------------------------------------------------------

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

-------



the migrate/generate-benefits.ts file should export a generateBenefits(dbContent: DatabaseContent) function which returns collections of:

benefit subscriptions
benefit charges
benefit services in a form of a dictionary (key: T[], key2: U[] etc.)
the generator will require the employees data from dbContent as input.

for each employee, there would be potentially some benefits generated. Initially lets start that benefits for employees will be generated with probability =1%.

benefit services can be hardcoded. Provide all necessary data with detailed descriptions. this has to be generated independently on employee. Each has a price-per country - create such data, but don't expose it - its gonna be used when generating benefit charges.

benefit subscriptions determine that an employee is using a service and pays for it regularly. Some employees will have active subscriptions, some will have cancelled ones, some will have multiple ones at the same time, some others will have renewals. include all possibilities. crate a dictionary of probabilities. The subscribedAtDate and cancelledAtDate properties are important.

Once the subscriptions have been generated, proceed to BenefitCharge objects. For each subscription, look up its subscribedAtDate and cancelledAtDate properties - they determine exactly how many objects should be created (along with billingPeriodStart and billingPeriodEnd). remember that each service has a price per country.

prices are in eur.

ask if you need to make something more precise.
