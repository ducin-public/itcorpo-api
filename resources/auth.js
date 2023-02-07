var jwt = require('jsonwebtoken');
const { logConfig } = require('../lib/util')
const config = require('../config.json')

module.exports = () => {
  logConfig('JWT authorization available under /auth')

  return (req, res, next) => {
    const token = jwt.sign({
      issuer: config.NAME
    }, config.SECRET);

    res.set('Content-Type', 'application/json')
    res.send({
      token
    })
  }
}
