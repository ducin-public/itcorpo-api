import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

import { logger } from '../lib/logger';
import { FILES } from '../lib/files';
import { ErrorResponse } from '../contract-types/data-contracts';

FILES.MAINTENANCE_FILE;

/**
 * If the file content is YES, the middleware should respond with 503 Service Unavailable.
 * If the file content is NO, the middleware should pass the request to normal processing.
 * If the file content has different value, the function should throw an error, preventing the application from starting.
 * If the file does not exist, the middleware should pass the request.
 *
 * File content are case-insensitive, whitespace-insensitive.
 */
const verifyMaintenanceStatus = async () => {
  let maintenanceFileContent: string;
  try {
    maintenanceFileContent = await fs.promises.readFile(FILES.MAINTENANCE_FILE, 'utf-8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false; // File does not exist - no maintenance
    } else {
      throw error // Something else went wrong
    }
  }  
  const status = maintenanceFileContent.trim().toLowerCase();
  if (status === 'yes') {
    return true;
  } else if (status === 'no') {
    return false;
  } else {
    throw new Error(`Invalid maintenance status: ${status}`);
  }
}

let currentStatus: {
  isMaintenance: boolean;
  lastUpdate: Date
} = {
  isMaintenance: null,
  lastUpdate: null
} as any

const updateMaintenanceStatus = async () => {
  const isMaintenance = await verifyMaintenanceStatus();
  currentStatus.isMaintenance = isMaintenance;
  currentStatus.lastUpdate = new Date();
  if (isMaintenance) {
    logger.warn('Maintenance status updated: ON');
  } else {
    logger.info('Maintenance status updated: OFF');
  }
}

export const maintenanceMiddleware = () => {
  updateMaintenanceStatus();
  setInterval(updateMaintenanceStatus, 1000 * 60);
  logger.info('Maintenance check: every minute');

  return async (req: Request, res: Response<ErrorResponse>, next: NextFunction): Promise<void> => {
    if (currentStatus.isMaintenance) {
      res.status(503).send({
        code: 'SERVICE_UNAVAILABLE',
        message: `Service is currently unavailable due to maintenance (last updated: ${currentStatus.lastUpdate.toISOString()})`
      });
    } else {
      next();
    }
  };
};
