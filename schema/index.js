const schema = require('./json-schema')
const validate = require('./validate')

module.exports = {
  ...schema,
  validate,
}
