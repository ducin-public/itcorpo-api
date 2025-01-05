import { Request, Response, NextFunction } from 'express';

import { appConfig } from '../lib/config';
import { pass } from './pass';
import { logger } from '../lib/logger';

const FAIL_STATUS = 500;

type UrlMatcher = (requestURL: string) => boolean;

const isOpenResource = (requestURL: string): boolean =>
  appConfig.OPEN_RESOURCES.some(openURL => requestURL.includes(openURL));

const matchingStrategy = (failUrlsCommaSeparated: string | null): UrlMatcher => {
  let strategy: UrlMatcher;
  
  if (failUrlsCommaSeparated === null) {
    strategy = () => true;
  } else {
    const urls = failUrlsCommaSeparated.split(',');
    strategy = (requestURL: string) => urls.some(url => requestURL.includes(url));
  }

  return (requestURL: string) => strategy(requestURL) && !isOpenResource(requestURL);
};

const logFailingInfo = (failProbability: number, failUrlsCommaSeparated: string | null): string => {
  let str = `Failing probability is ${failProbability}`;
  if (failProbability) {
    if (failUrlsCommaSeparated === null) {
      str += ', all URLs are possible to fail';
    } else {
      str += `, URLs possible to fail are: ${failUrlsCommaSeparated.split(',').join(', ')}`;
    }
  }
  return str;
};

export const failingMiddleware = (failProbability: number, failUrlsCommaSeparated: string | null) => {
  logger.config(logFailingInfo(failProbability, failUrlsCommaSeparated));

  const failNow = (): boolean => Math.random() < failProbability;
  const matchesUrls = matchingStrategy(failUrlsCommaSeparated);

  if (!failProbability) return pass;

  return (req: Request, res: Response, next: NextFunction): void => {
    const matches = matchesUrls(req.originalUrl);
    logger.debug(`The ${req.method} ${req.originalUrl} ${matches ? 'matches' : 'doesn\'t match'} potentially failing URLs`);

    if (matches && failNow()) {
      logger.warn(`The ${req.method} ${req.originalUrl} request is destined to fail`);
      res.status(FAIL_STATUS);
      throw new Error('RANDOM FAIL with <3 from failingMiddleware');
    } else {
      next();
    }
  };
};
