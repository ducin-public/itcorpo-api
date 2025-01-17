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

// Helper to replace path parameters with actual values
const replacePath = (path: string): string => {
    return path.replace(/:(\w+)/g, 'test-$1');
};

const filteredEndpoints = contractEndpoints.filter(endpoint => {
    return [
        endpoint.path === "/offices",
        endpoint.method === "get",
    ].every(Boolean);
});

for (const endpoint of filteredEndpoints) {
    const { method, path, parameters = [], response, errors, requestFormat } = endpoint;
    const testPath = replacePath(path);

    describe(`${method.toUpperCase()} ${path}`, () => {
        it('should respond with correct schema on success', async () => {
            const req = request(app)[method](testPath)
                .set('Accept', 'application/json');

            // Add parameters based on their type
            // parameters.forEach(param => {
            //     switch (param.type) {
            //         case 'Header':
            //             req.set(param.name, param.schema.parse('test-header'));
            //             break;
            //         case 'Query':
            //             const queryValue = param.schema.parse('test-query');
            //             if (queryValue !== undefined) {
            //                 req.query({ [param.name]: queryValue });
            //             }
            //             break;
            //         case 'Body':
            //             // Generate a mock value that satisfies the schema
            //             const mockBody = param.schema.parse({});
            //             req.send(mockBody);
            //             break;
            //         // Path parameters are handled by replacePath
            //     }
            // });

            await req
                .expect('Content-Type', /json/)
                .expect(200)
                .expect((res) => {
                    if (response.schema) {
                        response.schema.parse(res.body);
                    }
                });
        });

        // Generate error test cases
        errors.forEach(error => {
            it.skip(`should handle ${error.status} error - ${error.description}`, async () => {
                const req = request(app)[method](testPath)
                    .set('Accept', 'application/json');

                // Add parameters (simplified for error cases)
                parameters.forEach(param => {
                    if (param.type === 'Header') {
                        req.set(param.name, 'test-header');
                    }
                });

                await req
                    .expect('Content-Type', /json/)
                    .expect(error.status)
                    .expect((res) => {
                        if (error.schema) {
                            error.schema.parse(res.body);
                        }
                    });
            });
        });
    });
}
