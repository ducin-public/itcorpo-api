
import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';
import { random } from '../lib/random';
const pause = require('connect-pause');

export const delayingMiddleware = ([from, to]: [number, number]) => {
  logger.config(`Delaying: ${from}-${to} ms`);
  return function delay(req: Request, res: Response, next: NextFunction): void {
    const delayMS = random(from, to);
    logger.debug(`Delaying ${delayMS}ms`);
    pause(delayMS)(req, res, next);
  };
};