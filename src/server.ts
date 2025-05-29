import Fastify from 'fastify';
import api from './api/index.js';
import { logger } from './lib/logger.js';

const fastify = Fastify({
  loggerInstance: logger,
});

fastify.register(api, { prefix: '/api' });

export function startServer() {
  fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
  });
}
