import { logger } from "./logger";

export function measureTime<T>(fn: () => Promise<T>, label: string): Promise<T> {
    const start = Date.now();
    return fn().then(result => {
        const end = Date.now();
        logger.debug(`${label} took ${end - start}ms`);
        return result;
    });
}
