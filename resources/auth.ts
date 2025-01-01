import { Router, Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { appConfig } from '../lib/config'
import { logger } from '../lib/logger'

interface JWTPayload {
  issuer: string
}

const createAuthHandler = () => {
  logger.config('JWT authorization available under /auth')

  return (req: Request, res: Response, next: NextFunction): void => {
    const token = jwt.sign({
      issuer: appConfig.NAME
    } as JWTPayload, appConfig.SECRET)

    res.set('Content-Type', 'application/json')
    res.send({
      token
    })
  }
}

export const authRouter = Router()
authRouter.get('/', createAuthHandler())
