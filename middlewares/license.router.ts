import { Router, Request, Response, NextFunction } from 'express'
import fs from 'fs'

import { logger } from '../lib/logger'

const createLicenseHandler = () => {
  let licenseContent: Buffer | null = null
  logger.config(`License will be available under /license`)

  fs.readFile(`${__dirname}/license.txt`, (err: NodeJS.ErrnoException | null, data: Buffer) => {
    if (err) {
      logger.error('License loading failed', err)
    } else {
      licenseContent = data
      logger.info('License file loaded and available')
    }
  })

  return (req: Request, res: Response, next: NextFunction): void => {
    if (!licenseContent) {
      res.status(503)
      res.send('This resource is not yet available. Try later.')
    } else if (!req.headers['content-type'] || !req.headers['content-type'].includes('text/plain')) {
      res.status(400)
      res.send('Only `text/plain` media type is supported (set `Content-Type` header).')
    } else {
      res.set('Content-Type', 'text/plain')
      res.send(licenseContent)
    }
  }
}

export const licenseRouter = Router()
licenseRouter.get('/', createLicenseHandler())
