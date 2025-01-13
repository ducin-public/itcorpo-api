import { Request, Response, NextFunction } from 'express';

import { appConfig } from '../lib/config';
import { pass } from './pass';
import { logger } from '../lib/logger';

export type ChaosConfig = {
  probability: number;
  urls: 'ALL' | string[];
}

const FAIL_STATUS = 500;

type UrlMatcher = (requestURL: string) => boolean;

const isOpenResource = (requestURL: string): boolean =>
  appConfig.OPEN_RESOURCES.some(openURL => requestURL.includes(openURL));

const matchingStrategy = (urls: ChaosConfig['urls']): UrlMatcher => {
  let strategy: UrlMatcher;
  
  if (urls === "ALL") {
    strategy = () => true;
  } else {
    strategy = (requestURL: string) => urls.some(url => requestURL.includes(url));
  }

  return (requestURL: string) => strategy(requestURL) && !isOpenResource(requestURL);
};

const logFailingInfo = ({ probability, urls }: ChaosConfig): string => {
  let str = `Failing probability is ${probability}`;
  if (probability) {
    if (urls === "ALL") {
      str += ', all URLs are possible to fail';
    } else {
      str += `, URLs possible to fail are: ${urls.join(', ')}`;
    }
  }
  return str;
};

export const chaosMiddleware = (chaosConfig: ChaosConfig) => {
  logger.config(logFailingInfo(chaosConfig));

  const failNow = (): boolean => Math.random() < chaosConfig.probability;
  const matchesUrls = matchingStrategy(chaosConfig.urls);

  if (chaosConfig.probability == 0) return pass;

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
