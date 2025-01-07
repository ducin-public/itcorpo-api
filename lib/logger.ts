import chalk from 'chalk';

interface Logger {
    error: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    info: (...args: unknown[]) => void;
    debug: (...args: unknown[]) => void;
    config: (...args: unknown[]) => void;
}

export const logger: Logger = {
    error: (...args) => console.log(chalk.red.bold('[ERROR]', ...args)),
    warn: (...args) => console.log(chalk.magenta.bold('[WARN]', ...args)),
    info: (...args) => console.log(chalk.green('[INFO]', ...args)),
    debug: (...args) => console.log(chalk.gray('[DEBUG]', ...args)),
    config: (...args) => console.log(chalk.yellow('[CONFIG]', ...args)),
};
