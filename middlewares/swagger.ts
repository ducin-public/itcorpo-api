import { readFileSync } from 'fs';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { parse } from 'yaml';

import { FILES } from '../lib/files';

export const swaggerRouter = Router();
const swaggerFile = readFileSync(FILES.SWAGGER_FILE, 'utf8');
const swaggerDocument = parse(swaggerFile);

swaggerRouter.use('/', swaggerUi.serve);
swaggerRouter.get('/', swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'IT Corpo API',
}));
