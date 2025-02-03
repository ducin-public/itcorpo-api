import { Request, Response } from "express";
import { randomUUID } from "crypto"

import { logger } from "../../lib/logger";
import { CORRELATION_ID_HEADER } from "../../middlewares/correlation-id";
import { HTTPError } from "./HTTPError";

export const getErrorID = () => {
    return randomUUID();
}

type handleRouterErrorParams = {
    error: unknown;
    req?: Request<any, any, any, any>;
    res?: Response;
    publicError: string;
}

const ctxToString = (ctx: Record<string, unknown>) => {
    return Object.entries(ctx).map(([key, value]) => `${key}: ${value}`).join(', ');
}

export const handleRouterError = ({ error, req, res, publicError }: handleRouterErrorParams) => {
    const errorID = getErrorID();
    const correlationId = req?.headers?.[CORRELATION_ID_HEADER];
    const ctx = {
        errorID,
        publicError,
        ...(correlationId && { correlationId }),
    }
    
    // logger
    logger.error(ctxToString(ctx));
    if (error instanceof Error) {
        logger.error(errorID, ',', error.stack);
    }

    if (res) {
        if (error instanceof HTTPError) {
            res.status(error.status).json({
                message: [error.message, publicError].join('. '),
                errorID
            });
        } else {
            res.status(500).json({
                message: publicError,
                errorID
            });
        }
    }
}
