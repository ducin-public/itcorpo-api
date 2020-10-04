const { logConfig } = require('../lib/util')

module.exports = (maxPageSize, { excludePatterns = [] } = {}) => {
  logConfig(() => `Max pagesize is ${maxPageSize}`)

  return (req, res, next) => {
    console.log(req.url)
    if (!excludePatterns.includes(req.url)){
      if (!req.query._limit || parseInt(req.query._limit) > maxPageSize) {
        req.query._limit = maxPageSize
      }
    }
    next()
  }
}
