
import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';

import { logger } from '../lib/logger';
// FIXME
const validateFunctions = require('../schema/validate');

const validate = validateFunctions.logRequest;

export const logsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.path.includes('/logs') && req.method === 'POST') {
    const valid = validate(req.body);
    if (!valid) {
      logger.error(JSON.stringify(validate.errors));
      return res.status(400).send(validate.errors);
    }

    req.body.date = new Date().toISOString();
    req.body.id = uuid();
  }
  next();
};