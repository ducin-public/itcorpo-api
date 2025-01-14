import { Request, Response } from "express";
import { randomUUID } from "crypto"

import { logger } from "../../lib/logger";
import { CORRELATION_ID_HEADER } from "../../middlewares/correlation-id";

export const getErrorGUID = () => {
    return randomUUID();
}

type logRouterErrorParams = {
    error: unknown;
    req?: Request<any, any, any, any>;
    res?: Response;
    publicError: string;
}

export const logRouterError = ({ error, req, res, publicError }: logRouterErrorParams) => {
    const errorGUID = req?.headers?.[CORRELATION_ID_HEADER] || getErrorGUID();
    
    logger.error(`publicError: ${publicError}, errorGUID: ${errorGUID}`);
    if (error instanceof Error) {
        logger.error(errorGUID, ',', error.stack);
    }

    if (res) {
        res.status(500).json({ message: `${publicError}, error: ${errorGUID}` });
    }
}
