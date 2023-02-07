const { v4: uuid } = require('uuid')
const { logError, logDebug } = require('../lib/util');
const { validateFunctions } = require('../schema/validate');
const validate = validateFunctions.logRequest;

module.exports = (req, res, next) => {
  if (req.path.includes('/logs') && req.method === 'POST'){
    // validate 
    var valid = validate(req.body);
    if (!valid) {
      logError(JSON.stringify(validate.errors))
      return res.status(400).send(validate.errors)
    }

    // include system datetime
    req.body.date = new Date().toISOString()
    req.body.id = uuid()
  }
  next() // proceed to "native" json-server logic
}
