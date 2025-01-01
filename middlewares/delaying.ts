
import { Request, Response, NextFunction } from 'express';
const pause = require('connect-pause');

type DelayFunction = () => number;

export const delayingMiddleware = (delayFn: DelayFunction) => {
  return function delay(req: Request, res: Response, next: NextFunction): void {
    const delayMS = delayFn();
    pause(delayMS)(req, res, next);
  };
};