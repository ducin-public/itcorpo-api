import express from 'express';
import jsonServer from 'json-server';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression'
import * as OpenApiValidator from 'express-openapi-validator';

import { cliConfig } from './lib/config';
import { logger } from './lib/logger';

import { countMiddleware } from './middlewares/count';
import { delayingMiddleware } from './middlewares/delaying';
import { swaggerRouter } from './middlewares/swagger';
import { tenantMiddleware } from './middlewares/tenant';
import { pagingMiddleware } from './middlewares/paging';
import { logsMiddleware } from './middlewares/logs';
import { authMiddleware } from './middlewares/auth';
import { failingMiddleware } from './middlewares/failing';
import { employeeNameMiddleware } from './middlewares/employee_name';
import { errorMiddleware } from './middlewares/error';

import { licenseRouter } from './resources/license';
import { authRouter } from './resources/auth';
import { departmentsRouter } from './resources/departments';
import { officesRouter } from './resources/office';
import { FILES } from './lib/files';
import { HTTPCacheMiddleware } from './middlewares/http-cache';
import { configRouter } from './resources/config';
import { healthCheckRouter } from './resources/health-check';
import { rewriteRouter } from './middlewares/rewrite';

interface JSONServerDatabase {
  getState: () => any;
  setState: (state: any) => void;
}

const app = jsonServer.create();
const jsonParser = bodyParser.json();

const router = jsonServer.router(FILES.JSONSERVER_DB_FILE);
(router as any).render = countMiddleware; // TODO: json-server is still in beta, need to wait for the solution
const db: JSONServerDatabase = router.db;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(jsonParser, logsMiddleware);
app.use(cookieParser());
app.use(morgan('dev', {
  skip: req => process.env.NODE_ENV === 'test' || req.path === '/favicon.ico'
}));
app.use(compression());
app.use(HTTPCacheMiddleware());
app.use(
  OpenApiValidator.middleware({
    apiSpec: FILES.SWAGGER_FILE,
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
  }),
);
app.use(jsonServer.rewriter(require(FILES.ROUTES_FILE)));
// app.use(rewriteRouter(require(FILES.ROUTES_FILE))); // FIXME

app.use(authMiddleware(cliConfig.jwtAuth));
app.use(delayingMiddleware(() => 500 + Math.random() * cliConfig.delay));
app.use(tenantMiddleware(cliConfig.tenantRequired));
app.use(pagingMiddleware(50, { excludePatterns: ['/log'] }));
app.use(failingMiddleware(cliConfig.fail, cliConfig.failUrls));
app.use(employeeNameMiddleware(db));

app.use('/license', licenseRouter);
app.use('/auth', authRouter);
app.use('/departments', departmentsRouter);
app.use('/offices', officesRouter);
app.use('/images', express.static('images'))
app.use('/health', healthCheckRouter);
app.use('/api', swaggerRouter);
app.use(configRouter());
app.use(router);
app.use(errorMiddleware());

const URL = `http://localhost:${cliConfig.port}`
app.listen(cliConfig.port, () => {
  logger.info(`JSON Server is running on ${URL}`);
});
