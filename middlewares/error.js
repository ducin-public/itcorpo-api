const path = require('path')
const { logError } = require('../lib/util')

const basePath = path.normalize(__dirname + '/../images/error')

const errorFilePath = (status) => {
  switch (status) {
    case 401: return basePath + '/error-401.html'
    default: return basePath + '/error.html'
  }
}

module.exports = () => {

  return (err, req, res, next) => {
    // console.error(err); // full error message
    logError(`"${err.message}" occurred for ${req.method} ${req.originalUrl}`); // request URL only

    if (err.name === 'UnauthorizedError') {
      res.status(401).sendFile(errorFilePath(err.status));
    } else {
      res.sendFile(errorFilePath(err.status));
    }
  }
}
