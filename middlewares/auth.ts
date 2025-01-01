import { Request } from 'express';
import { expressjwt } from 'express-jwt';
import { pass } from './pass';
import { appConfig } from '../lib/config';
import { logger } from '../lib/logger';

const maskedSecret = (secret: string): string =>
  secret[0] + Array(secret.length-1).fill('*').join('');

export const authMiddleware = (requiredAuth: boolean) => {
  if (!appConfig.SECRET) {
    throw new Error('JWT Secret not provided');
  } else if (appConfig.SECRET.length < 8) {
    throw new Error('JWT Secret too short');
  }

  if (!requiredAuth) {
    logger.config('No Authentication required');
    return pass;
  }

  logger.config(`JWT Authentication required with secret: ${maskedSecret(appConfig.SECRET)}`);

  return expressjwt({
    secret: appConfig.SECRET,
    algorithms: ['HS256'],
    // FIXME: migrating expressjwt from v6 to v8 is NOT FINISHED
    // getToken: function fromHeaderOrQuerystring(req: Request) {
    //   if (req.headers.authorization?.split(' ')[0] === 'Bearer') {
    //     return req.headers.authorization.split(' ')[1];
    //   } else if (req.query && req.query.token) {
    //     return req.query.token as string;
    //   }
    //   return null;
    // }
  }).unless({ path: appConfig.OPEN_RESOURCES });
};
