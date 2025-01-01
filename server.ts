import express from 'express';
import jsonServer from 'json-server';
import cors from 'cors';
import bodyParser from 'body-parser';

import { argv } from './lib/cli';
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

interface JSONServerDatabase {
  getState: () => any;
  setState: (state: any) => void;
}

const app = jsonServer.create();
const jsonServerMiddlewares = jsonServer.defaults();
const jsonParser = bodyParser.json();

const router = jsonServer.router('db.json');
(router as any).render = countMiddleware; // TODO: json-server is still in beta, need to wait for the solution
const db: JSONServerDatabase = router.db;

app.use(cors());
app.use(jsonParser, logsMiddleware);
app.use(jsonServer.rewriter(require('./routes.json')));
app.use(jsonServerMiddlewares);

app.use(authMiddleware(argv.jwtAuth));
app.use(delayingMiddleware(() => 500 + Math.random() * argv.delay));
app.use(tenantMiddleware(argv.tenantRequired));
app.use(pagingMiddleware(50, { excludePatterns: ['/log'] }));
app.use(failingMiddleware(argv.fail, argv.failUrls));
app.use(employeeNameMiddleware(db));

app.use('/api', swaggerRouter);
app.use('/license', licenseRouter);
app.use('/auth', authRouter);
app.use('/images', express.static('images'))
app.use(router);
app.use(errorMiddleware());

app.listen(argv.port, () => {
  logger.info(`JSON Server is running on http://localhost:${argv.port}`);
});
