const { v4: uuid } = require('uuid')

const ErrorCodes = {
  "AUTH_FAILED": 401,
  "INVALID_TOKEN": 401,
  "NOT_FOUND": 404,
}

const APIErrorDTO = (code, message) => ({
  id: uuid(),
  code, message
})

module.exports = {
  APIErrorDTO,
  ErrorCodes,
}
