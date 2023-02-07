const config = require('../config.json')
const pass = require('./pass')
const { logConfig, logCustom } = require('../lib/util')
const logRandomFail = logCustom('RANDOM-FAIL')

const FAIL_STATUS = 500

// requested URL matches at least 1 open resource (and should not fail)
const isOpenResource = (requestURL) =>
  config.OPEN_RESOURCES.some(openURL => requestURL.includes(openURL))

const matchingStrategy = (failUrlsCommaSeparated) => {
  let strategy
  if (failUrlsCommaSeparated === null) {
    strategy = () => true
  } else {
    const urls = failUrlsCommaSeparated.split(',')
    strategy = (requestURL) => urls.some(url => requestURL.includes(url))
  }

  return (requestURL) => strategy(requestURL) && !isOpenResource(requestURL)
}

const logFailingInfo = (failProbability, failUrlsCommaSeparated) => {
  let str = `Failing probability is ${failProbability}`
  if (failProbability) {
    if (failUrlsCommaSeparated === null) {
      str += `, all URLs are possible to fail`
    } else {
      str += `, URLs possible to fail are: ${ failUrlsCommaSeparated.split(',').join(', ')}`
    }
  }
  return str
}

module.exports = (failProbability, failUrlsCommaSeparated) => {
  logConfig(logFailingInfo(failProbability, failUrlsCommaSeparated))

  const failNow = () => Math.random() < failProbability
  const matchesUrls = matchingStrategy(failUrlsCommaSeparated)

  if (!failProbability) return pass

  return (req, res, next) => {
    const matches = matchesUrls(req.originalUrl)
    logRandomFail(() => `the ${req.method} ${req.originalUrl} ${matches ? 'matches' : 'doesn\'t match'} potentially failing URLs`)

    if (matches && failNow()) {
      logRandomFail(() => `the ${req.method} ${req.originalUrl} request is destined to fail`)
      res.status(FAIL_STATUS)
      throw new Error('RANDOM FAIL with <3 from failingMiddleware')
    } else {
      next()
    }
  }
}
