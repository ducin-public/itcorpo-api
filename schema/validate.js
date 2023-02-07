/*
const expressAjv = require('express-ajv');
const schema = expressAjv.schema;

const jsonSchema = require('./json-schema');

schema.addSchema('log:request', jsonSchema.logRequest);
schema.addSchema('login:request', jsonSchema.loginRequest);
schema.addSchema('transfer:request', jsonSchema.transferRequest);

module.exports = expressAjv.validatorFactory;
*/
const Ajv = require('ajv');
const jsonSchema = require('./json-schema')

const ajv = new Ajv();
const validateFunctions = {
  transferRequest: ajv.compile(jsonSchema.transferRequest),
  logRequest: ajv.compile(jsonSchema.logRequest),
  loginRequest: ajv.compile(jsonSchema.loginRequest),
  tokenConfirmRequest: ajv.compile(jsonSchema.tokenConfirmRequest),
  limitsChangeRequest: ajv.compile(jsonSchema.limitsChangeRequest),
};

const { logError } = require('../lib/util');

const generateValidateBodyMiddleware = (validate) =>
  (req, res, next) => {
    var valid = validate(req.body);
    if (!valid) {
      logError(validate.errors)
      return res.status(400).send(validate.errors)
    }
  }

module.exports = {
  generateValidateBodyMiddleware,
  validateFunctions,
}
