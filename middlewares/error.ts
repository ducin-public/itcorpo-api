import { Request, Response, NextFunction } from 'express';
import path from 'path';

import { logger } from '../lib/logger';

// FIXME: what is this?
interface ErrorWithStatus {
  status?: number;
  name?: string;
    message: string;
}

const basePath = path.normalize(__dirname + '/../images/error');

const errorFilePath = (status?: number): string => {
  switch (status) {
    case 401: return path.join(basePath, 'error-401.html');
    default: return path.join(basePath, 'error.html');
  }
};

export const errorMiddleware = () => {
  return (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`"${err.message}" occurred for ${req.method} ${req.originalUrl}`);

    if (err.name === 'UnauthorizedError') {
      res.status(401).sendFile(errorFilePath(err.status));
    } else {
      res.sendFile(errorFilePath(err.status));
    }
  };
};
