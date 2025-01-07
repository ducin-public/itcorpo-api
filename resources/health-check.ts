import { Router, Request, Response } from 'express';

import { logger } from '../lib/logger';
import { Health } from '../contract-types/HealthRoute';
import { HealthStatus } from '../contract-types/data-contracts';

export const healthCheckRouter = () => {
  const router = Router();

  logger.config('Health check endpoint ready');

  router.get('/', (
    _req: Request<
      Health.HealthCheck.RequestParams,
      Health.HealthCheck.ResponseBody,
      Health.HealthCheck.RequestBody,
      Health.HealthCheck.RequestQuery
    >,
    // res: Response<Health.HealthCheck.ResponseBody>,
    res: Response<HealthStatus>
  ) => {
    try {
      // Memory usage check
      const memoryUsage = process.memoryUsage();
      const memoryThreshold = 500 * 1024 * 1024; // 500 MB
      if (memoryUsage.heapUsed > memoryThreshold) {
        throw new Error('Memory usage is too high');
      }

      // Disk space check (example, requires additional implementation)
      // const diskSpace = getDiskSpace(); // Implement this function
      // if (diskSpace.free < 100 * 1024 * 1024) { // 100 MB
      //   throw new Error('Not enough disk space');
      // }

      // External service connectivity check (example)
      // const externalServiceStatus = await checkExternalService(); // Implement this function
      // if (!externalServiceStatus) {
      //   throw new Error('Cannot connect to external service');
      // }

      // Uptime check
      const uptime = process.uptime();

      res.status(200).json({
        status: 'OK',
        message: 'All systems operational',
        memoryUsage,
        uptime,
        // diskSpace,
        // externalServiceStatus,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : JSON.stringify(error);
      res.status(500).json({
        status: 'ERROR',
        message: message,
      });
    }
  });

  return router;
}

