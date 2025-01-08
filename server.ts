import express from 'express';
import jsonServer from 'json-server';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression'
import * as OpenApiValidator from 'express-openapi-validator';

import { FILES } from './lib/files';
import { cliConfig } from './lib/config';
import { logger } from './lib/logger';

// import { countMiddleware } from './middlewares/count';
import { delayingMiddleware } from './middlewares/delaying';
import { tenantMiddleware } from './middlewares/tenant';
import { pagingMiddleware } from './middlewares/paging';
import { logsMiddleware } from './middlewares/logs';
import { authMiddleware } from './middlewares/auth';
import { failingMiddleware } from './middlewares/failing';
import { errorMiddleware } from './middlewares/error';
import { HTTPCacheMiddleware } from './middlewares/http-cache';
import { healthCheckRouter } from './middlewares/health-check.router';
import { swaggerRouter } from './middlewares/swagger.router';
import { configRouter } from './middlewares/config.router';

import { licenseRouter } from './middlewares/license.router';
import { authRouter } from './middlewares/auth.router';
import { rewriteRouter } from './middlewares/rewrite';

import { departmentsRouter } from './resources/departments.router';
import { benefitsRouter } from './resources/benefits.router';
import { officesRouter } from './resources/offices.router';
import { employeesRouter } from './resources/employees.router';
import { projectsRouter } from './resources/projects.router';
import { geoRouter } from './resources/geo.router';
import { expensesRouter } from './resources/expenses.router';

const app = jsonServer.create();
const jsonParser = bodyParser.json();

// const router = jsonServer.router(FILES.JSONSERVER_DB_FILE);
// (router as any).render = countMiddleware; // TODO: json-server is still in beta, need to wait for the solution
// const db: JSONServerDatabase = router.db;

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
if (cliConfig.contractValidation) {
  logger.config('OpenAPI contract validation enabled');
  app.use(
    OpenApiValidator.middleware({
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
    }),
  );
};
app.use(jsonServer.rewriter(require(FILES.ROUTES_FILE)));
// app.use(rewriteRouter(require(FILES.ROUTES_FILE))); // FIXME

app.use(authMiddleware(cliConfig.jwtAuth));
app.use(delayingMiddleware(cliConfig.delayRange));
app.use(tenantMiddleware(cliConfig.tenantRequired));
app.use(pagingMiddleware(50, { excludePatterns: ['/log'] }));
app.use(failingMiddleware(cliConfig.fail, cliConfig.failUrls));
// app.use(employeeNameMiddleware(db));

app.use('/benefits', benefitsRouter);
app.use('/departments', departmentsRouter);
app.use('/employees', employeesRouter);
app.use('/expenses', expensesRouter);
app.use('/geo', geoRouter);
app.use('/offices', officesRouter);
app.use('/projects', projectsRouter);

app.use('/license', licenseRouter);
app.use('/auth', authRouter);
app.use('/images', express.static('images'))
app.use('/health', healthCheckRouter());
app.use('/api', swaggerRouter);
app.use(configRouter());
// app.use(router);
app.use(errorMiddleware());

const URL = `http://localhost:${cliConfig.port}`
app.listen(cliConfig.port, () => {
  logger.info(`JSON Server is running on ${URL}`);
});

// test: http://localhost:3000/employees/91720
