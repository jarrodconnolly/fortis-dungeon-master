import type { PinoLoggerOptions } from 'fastify/types/logger.js';
import { pino } from 'pino';

type Env = 'development' | 'production' | 'test';
const env = (process.env.NODE_ENV as Env) || 'development';

const logConfig: Record<Env, PinoLoggerOptions> = {
  development: {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        hideObject: true,
        messageFormat:
          '{msg} {if req}{reqId} {req.method} {req.url}{end}{if res}{reqId} {res.statusCode} {responseTime}{end}',
      },
    },
  },
  production: {
    level: 'info',
  },
  test: {
    level: 'silent',
  },
};

const pinoOptions = logConfig[env];
const logger = pino(pinoOptions);

logger.info(`Logger initialized in ${env} mode`);

export { logger };
