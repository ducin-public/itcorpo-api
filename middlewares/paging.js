const { logConfig } = require('../lib/util')

module.exports = (maxPageSize, { excludePatterns = [] } = {}) => {
  logConfig(`Max pagesize is ${maxPageSize}, excludePatterns: ${excludePatterns}`)

  return (req, res, next) => {
    if (!excludePatterns.some(pattern => req.url.includes(pattern))){
      if (!req.query._limit || parseInt(req.query._limit) > maxPageSize) {
        req.query._limit = maxPageSize
      }
    }
    next()
  }
}
