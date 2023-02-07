const pass = require('./pass')
const { logConfig } = require('../lib/util')
const config = require('../config.json')

module.exports = (tenantRequired) => {
  if (!tenantRequired) {
    logConfig('TenantID not required')
    return pass
  }

  logConfig('TenantID header required for most resources')

  const allowedTenantIDs = [
    'E2B31329-8818-428A-90DC-8F065318C052'
  ];

  const resourceIsOpened = url =>
    config.OPEN_RESOURCES.some(resUrl => url.startsWith(resUrl))
  
  const getTenantHeader = req => req.headers[config.TENANT_ID_HEADER]

  return (req, res, next) => {
    if (resourceIsOpened(req.url)) {
      next()
    } else {
      // lowercased: https://stackoverflow.com/a/43666082
      if (!getTenantHeader(req)) {
        res.resstatus(400)
        throw new Error('`TenantID` header is required')
      } else if (!allowedTenantIDs.includes(getTenantHeader())) {
        res.status(404)
      } else {
        next()
      }
    }
  }
}
