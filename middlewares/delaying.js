const pause = require('connect-pause')

module.exports = (baseDelay) => {
  const getDelay = () => 500 + Math.random() * baseDelay

  return function delay(req, res, next) {
    const delayMS = getDelay()
    pause(delayMS)(req, res, next)
  }
}
