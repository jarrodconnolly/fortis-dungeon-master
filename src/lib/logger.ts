import { pino } from 'pino';
import type { LoggerOptions } from 'pino';

const pinoOptions: LoggerOptions = {};

if (process.env.NODE_ENV === 'test') {
  pinoOptions.level = 'silent';
}

const logger = pino(pinoOptions);

export { logger };
