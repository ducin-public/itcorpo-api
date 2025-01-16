
import { Request, Response, NextFunction } from 'express';
import { randomInt } from 'crypto';

import { logger } from '../lib/logger';
const pause = require('connect-pause');

export const delayingMiddleware = ([from, to]: [number, number]) => {
  logger.config(`Delaying: ${from}-${to} ms`);
  return function delay(req: Request, res: Response, next: NextFunction): void {
    const delayMS = randomInt(from, to);
    logger.debug(`Delaying ${delayMS}ms`);
    pause(delayMS)(req, res, next);
  };
};