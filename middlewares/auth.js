const jwt = require('express-jwt')
const pass = require('./pass')
const { logConfig } = require('../lib/util')
const config = require('../config.json')

const maskedSecret = secret =>
  secret[0] + Array(secret.length-1).fill('*').join('')

module.exports = (requiredAuth) => {
  if (!config.SECRET) {
    throw new Error('JWT Secret not provided')
  } else if (config.SECRET.length < 8) {
    throw new Error('JWT Secret too short')
  }

  if (!requiredAuth){
    logConfig(`No Authentication required`)
    return pass
  }

  logConfig(`JWT Authentication required with secret: ${maskedSecret(config.SECRET)}`)

  return jwt({
    secret: config.SECRET,
    getToken: function fromHeaderOrQuerystring(req) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      }
      return null;
    }
  }).unless({ path: config.OPEN_RESOURCES })
}
