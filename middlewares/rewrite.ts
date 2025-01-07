import express from 'express'
import rewrite from 'express-urlrewrite';

import { logger } from '../lib/logger';

export const rewriteRouter = (routes: Record<string, string>) => {
  const router = express.Router();
  router.get('/__rewrite', (_req, res) => {
    res.json(routes);
  });
  logger.config('Rewrite rules', JSON.stringify(routes));
  for (const [src, dest] of Object.entries(routes)) {
      router.use(rewrite(src, dest));
  }
  return router;
};
