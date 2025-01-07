import { Request, Response } from 'express';

import { logger } from '../lib/logger';

const queryParams = (url: string): string => url.split('?')[1] ?? '';
const isCountRequest = (req: Request): boolean =>
  queryParams(req.originalUrl).includes('mode=count');

export const countMiddleware = (req: Request, res: Response): void => {
  if (isCountRequest(req)) {
    logger.debug(`Processing count request for: ${req.originalUrl}`);
    if (Array.isArray(res.locals.data)) {
      const count = (res.getHeader('x-total-count') as any).value();
      logger.info(`Count result for ${req.originalUrl}: ${count}`);
      res.jsonp(count);
    } else {
      logger.error(`Count request failed for ${req.originalUrl} - perhaps the data is not an array`);
      res.status(400);
      res.end('Count unavailable on a non-array', 'utf-8');
    }
  } else {
    res.jsonp(res.locals.data);
  }
};
