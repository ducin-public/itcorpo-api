import { Request, Response, NextFunction } from 'express';
import { pass } from './pass';
import { appConfig } from '../lib/config';
import { logger } from '../lib/logger';

const allowedTenantIDs = [
  'E2B31329-8818-428A-90DC-8F065318C052'
];

const resourceIsOpened = (url: string): boolean =>
    appConfig.OPEN_RESOURCES.some((resUrl: string) => url.startsWith(resUrl));

const getTenantHeader = (req: Request): string | undefined => 
  req.headers[appConfig.TENANT_ID_HEADER] as string | undefined;

export const tenantMiddleware = (tenantRequired: boolean) => {
  if (!tenantRequired) {
    logger.config('TenantID not required');
    return pass;
  }

  logger.config('TenantID header required for most resources');

  return (req: Request, res: Response, next: NextFunction): void => {
    if (resourceIsOpened(req.url)) {
      next();
    } else {
      const tenantId = getTenantHeader(req);
      if (!tenantId) {
        res.status(400);
        throw new Error('`TenantID` header is required');
      } else if (!allowedTenantIDs.includes(tenantId)) {
        res.status(404);
      } else {
        next();
      }
    }
  };
};
