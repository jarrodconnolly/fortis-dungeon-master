import Fastify from 'fastify';
import api from './api/index.js';

const fastify = Fastify({
  logger: true,
});

fastify.register(api, { prefix: '/api' });

export function startServer() {
  fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
}
