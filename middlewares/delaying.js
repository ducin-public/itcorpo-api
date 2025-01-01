const pause = require('connect-pause')

module.exports = (delayFn) => {
  return function delay(req, res, next) {
    const delayMS = delayFn()
    pause(delayMS)(req, res, next)
  }
}
