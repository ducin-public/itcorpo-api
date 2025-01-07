import { Request, Response, NextFunction } from 'express'

import { logger } from '../lib/logger';

type Headers = Record<string, string>;

const noCacheHeaders = {
  [Symbol('name')]: 'NO-CACHE (default)',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Expires': '-1'
}

function setResponseHeaders(res: Response, headers: Headers) {
  Object.entries(headers).forEach(([key, value]) => {
    res.header(key, value);
  });
}

export const HTTPCacheMiddleware = (cacheHeaders: Headers = noCacheHeaders) => {
  logger.config('Setting http cache headers', JSON.stringify(cacheHeaders));

  return (_req: Request, res: Response, next: NextFunction) => {
    setResponseHeaders(res, cacheHeaders);
    next();
  };
}
