import express from 'express'

import { FILES } from '../lib/files';
import { appConfig, cliConfig } from '../lib/config';

export const configRouter = (additional: object = {}) => {
  const router = express.Router();
  const routes = require(FILES.ROUTES_FILE);
  router.get('/__config', (_req, res) => {
    res.json({
      appConfig,
      cliConfig,
      routes,
      FILES,
      ...additional
    });
  });
  return router;
};
