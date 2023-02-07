const chalk = require('chalk')

const logCustom = (type, color) =>
  (message) => {
    console.log(chalk[color](`${type} > `) + message)
  }

const logDebug = (message) => {
  console.log(chalk.gray('DEBUG > ') + message)
}

const logInfo = (message) => {
  console.log(chalk.green('INFO > ') + message)
}

const logConfig = (message) => {
  console.log(chalk.yellow('CONFIG > ') + message)
}

const logError = (message) => {
  console.log(chalk.red('ERROR > ') + message)
}

const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
  .toString(16)
  .substring(1);

const randomGUID = () => s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

const randomID = () => Math.random().toString(36).substring(2)

module.exports = {
  logCustom,
  logDebug,
  logInfo,
  logConfig,
  logError,
  randomGUID,
  randomID,
}
