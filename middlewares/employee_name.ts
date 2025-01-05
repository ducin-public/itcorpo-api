import { Request, Response, NextFunction } from 'express';

import { logger } from '../lib/logger';
import { Employee } from '../typedef/data-contracts';

interface Database {
  getState: () => { employees: Employee[] };
}

const matchUnicase = (phrase: string, data: string): boolean =>
  data.toLocaleUpperCase().includes(phrase.toLocaleUpperCase());

const getEmployees = (phrase: string, employees: Employee[]): Employee[] =>
  employees.filter(e => 
    matchUnicase(phrase, e.firstName) || 
    matchUnicase(phrase, e.lastName)
  );

export const employeeNameMiddleware = (db: Database) => {
  return function employeesByName(req: Request, res: Response, next: NextFunction): void {
    if (req.path === "/employees" && req.query['name_like']) {
      const name = req.query['name_like'] as string;
      logger.debug(`Searching employees by name: ${name}`);
      
      const result = getEmployees(name, db.getState().employees);
      logger.info(`Found ${result.length} employees matching "${name}"`);
      
      res.status(200).send(result);
    } else {
      next();
    }
  };
};
