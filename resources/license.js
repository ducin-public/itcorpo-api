const fs = require('fs')
const { logConfig, logInfo, logError } = require('../lib/util')

module.exports = () => {
  let licenseContent = null
  logConfig(`License will be available under /license`)

  fs.readFile(`${__dirname}/license.txt`, (err, data) => {
    if (err) {
      logError('License loading failed')
      logError(err)
    } else {
      licenseContent = data
      logInfo('License file loaded and available')
    }
  })

  return (req, res, next) => {
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
