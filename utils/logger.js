const chalk = require('chalk');

const logger = {
    error: (...args) => console.log(chalk.red.bold('ERROR:', ...args)),
    warn: (...args) => console.log(chalk.yellow.bold('WARN:', ...args)),
    info: (...args) => console.log(chalk.blue('INFO:', ...args)),
    debug: (...args) => console.log(chalk.gray('DEBUG:', ...args)),
    success: (...args) => console.log(chalk.green.bold('SUCCESS:', ...args))
};

module.exports = logger;
