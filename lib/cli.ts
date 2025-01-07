import yargs from 'yargs';

export const argv = yargs(process.argv.slice(2))
  .option('port', {
    alias: 'p',
    default: 3000,
    describe: 'Service port',
    type: 'number'
  })
  .option('delayRange', {
    alias: 'd',
    // default: "0-0",
    default: "500-1000",
    describe: 'Delay range in milliseconds in format: "from-to"',
    type: 'string'
  })
  .option('fail', {
    alias: 'f',
    default: 0,
    describe: 'Probability of requests to randomly fail (0..1)',
    type: 'number'
  })
  .option('failUrls', {
    default: null,
    describe: 'Comma-separated list of pattern-matched urls to randomly fail',
    type: 'string'
  })
  .option('contractValidation', {
    alias: 'cv',
    default: true,
    describe: 'Requests and/or responses validation against the OpenAPI contract',
    type: 'boolean'
  })
  .option('jwtAuth', {
    default: false,
    describe: 'JWT Auth is required (Authorization Bearer <token>)',
    type: 'boolean'
  })
  .option('tenantRequired', {
    alias: 't',
    default: false,
    describe: 'TenantID header is required',
    type: 'boolean'
  })
  .parseSync();
