import * as OpenApiValidator from 'express-openapi-validator';

import { logger } from '../lib/logger';
import { FILES } from '../lib/files';

// import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
// export const openapiValidator = (openapiSpec: OpenAPIV3.DocumentV3) => {

export const openapiValidator = () => {
    logger.config('OpenAPI contract validation enabled');
    return OpenApiValidator.middleware({
        apiSpec: FILES.CONTRACT_FILE,
        validateRequests: true,
        validateResponses: false,
        ignorePaths: (path: string) => {
            return [
            path === '/favicon.ico',
            path === '/',
            path.startsWith('/api'),
            path.startsWith('/__'),
            path.startsWith('/images'),
            ].some(p => p)
        },
    });
}
