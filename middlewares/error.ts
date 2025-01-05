import { Request, Response, NextFunction } from 'express';

import { logger } from '../lib/logger';

interface ErrorWithStatus {
  status?: number;
  name?: string;
  message: string;
  errors?: unknown;
}

type ErrorTemplateArgs = {
  label: string;
  imgPath: string;
  message?: unknown;
  details?: unknown;
}

const errorTemplate = ({ imgPath, label, message, details }: ErrorTemplateArgs) => `
<h3>oops... something went wrong!</h3>
<h4>${label}</h4>
<img src="${imgPath}" />
${  message ? `<pre>${message}</pre>` : '' }
${ details ? `<pre>${JSON.stringify(details, null, 2)}</pre>` : '' }
`

export const errorMiddleware = () => {
  return (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`Error "${err.message}" occurred for ${req.method} ${req.originalUrl}. Details:\n${JSON.stringify(err.errors)}`);

    if (err.name === 'UnauthorizedError') {
      res.status(401).send(errorTemplate({
        label: 'You are not authorized to access this resource',
        imgPath: '/images/error/monkey.gif'
      }));
    } else if (err.status === 400) {
      res.status(err.status).send(errorTemplate({
        label: 'Dude, you have a bad request',
        imgPath: '/images/error/facepalm.gif',
        message: err.message,
        details: err.errors
      }));
    } else {
      res.status(err.status || 500).send(errorTemplate({
        label: 'We are sorry, but our technicians are investigating the cause',
        imgPath: '/images/error/kto-to-panu.jpg',
        message: err.message,
        details: err.errors
      }));
    }
  };
};
