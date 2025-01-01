import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

interface PagingOptions {
  excludePatterns?: string[];
}

export const pagingMiddleware = (maxPageSize: number, { excludePatterns = [] }: PagingOptions = {}) => {
  logger.config(`Max pagesize is ${maxPageSize}, excludePatterns: ${excludePatterns}`);

  return (req: Request, res: Response, next: NextFunction): void => {
    if (!excludePatterns.some(pattern => req.url.includes(pattern))) {
      if (!req.query._limit || parseInt(req.query._limit as string) > maxPageSize) {
        req.query._limit = maxPageSize.toString();
      }
    }
    next();
  };
};
