import chalk from 'chalk';

interface Logger {
    error: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    info: (...args: unknown[]) => void;
    debug: (...args: unknown[]) => void;
    success: (...args: unknown[]) => void;
}

const logger: Logger = {
    error: (...args) => console.log(chalk.red.bold('ERROR:', ...args)),
    warn: (...args) => console.log(chalk.yellow.bold('WARN:', ...args)),
    info: (...args) => console.log(chalk.blue('INFO:', ...args)),
    debug: (...args) => console.log(chalk.gray('DEBUG:', ...args)),
    success: (...args) => console.log(chalk.green.bold('SUCCESS:', ...args))
};

export default logger;
