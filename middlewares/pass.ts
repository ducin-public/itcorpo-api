import { Request, Response, NextFunction } from 'express';

export const pass = (req: Request, res: Response, next: NextFunction): void => {
  next();
};
