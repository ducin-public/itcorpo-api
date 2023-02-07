const withoutRequiredID = (schema) => ({
  ...schema,
  required: schema.required.filter(field => field != "id")
})

const logDTO = require('./log.dto.schema.json');
const logRequest = require('./log.request.schema.json');

const transferDTO = require('./transfer.dto.schema.json');
const transferRequest = withoutRequiredID(transferDTO);

const loginRequest = require('./login.request.schema.json');

const limitsChangeRequest = require('./limits-change.request.schema.json');
const tokenConfirmRequest = require('./token-confirm.request.schema.json');
const tokenGenerateResponse = require('./token-generate.response.schema.json');

module.exports = {
  logDTO,
  logRequest,
  transferDTO,
  transferRequest,
  loginRequest,
  limitsChangeRequest,
  tokenConfirmRequest,
  tokenGenerateResponse,
}
