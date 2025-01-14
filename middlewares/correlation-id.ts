import { randomUUID } from "crypto";
import { Request, Response, NextFunction } from "express";

export const CORRELATION_ID_HEADER = 'x-correlation-id';
export const correlationIDMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.headers[CORRELATION_ID_HEADER]) {
    req.headers[CORRELATION_ID_HEADER] = randomUUID();
  }
  next();
}
