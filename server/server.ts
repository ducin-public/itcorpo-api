import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression'

import jsonServer from 'json-server';
// import { FILES } from '../lib/files';
// import { cliConfig } from '../lib/config';

import { delayingMiddleware } from '../middlewares/delaying';
import { tenantMiddleware } from '../middlewares/tenant';
import { pagingMiddleware } from '../middlewares/paging';
import { logsMiddleware } from '../middlewares/logs';
import { authMiddleware } from '../middlewares/auth';
import { failingMiddleware } from '../middlewares/failing';
import { errorMiddleware } from '../middlewares/error';
import { HTTPCacheMiddleware } from '../middlewares/http-cache';
import { healthCheckRouter } from '../middlewares/health-check.router';
import { swaggerRouter } from '../middlewares/swagger.router';
import { configRouter } from '../middlewares/config.router';

import { licenseRouter } from '../middlewares/license.router';
import { authRouter } from '../middlewares/auth.router';
import { rewriteRouter } from '../middlewares/rewrite';

import { departmentsRouter } from '../resources/departments.router';
import { benefitsRouter } from '../resources/benefits.router';
import { officesRouter } from '../resources/offices.router';
import { employeesRouter } from '../resources/employees.router';
import { projectsRouter } from '../resources/projects.router';
import { geoRouter } from '../resources/geo.router';
import { expensesRouter } from '../resources/expenses.router';
import { maintenanceMiddleware } from '../middlewares/maintenance';
import { openapiValidator } from '../middlewares/openapi-validator';

export type ServerConfig = {
  fail: number;
  failUrls: string | null;
  jwtAuth: boolean;
  tenantRequired: boolean;
  delayRange: [number, number];
  middlewares: Record<'CONTRACT_VALIDATION' | 'LOGGER' | 'DELAY', boolean>
  routesRewrite: Record<string, string>;
}

export const createServer = (serverConfig: ServerConfig) => {
  const app = express();
  const jsonParser = bodyParser.json();

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
  
  if (serverConfig.middlewares.CONTRACT_VALIDATION) {
    app.use(openapiValidator());
  };

  app.use(jsonServer.rewriter(serverConfig.routesRewrite));
  // app.use(rewriteRouter(require(FILES.ROUTES_FILE))); // FIXME

  app.use(authMiddleware(serverConfig.jwtAuth));
  app.use(delayingMiddleware(serverConfig.delayRange));
  app.use(tenantMiddleware(serverConfig.tenantRequired));
  app.use(pagingMiddleware(50, { excludePatterns: ['/log'] }));
  app.use(failingMiddleware(serverConfig.fail, serverConfig.failUrls));
  app.use(maintenanceMiddleware());

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
  app.use(errorMiddleware());

  return app;
}
