import type { FastifyInstance, FastifyServerOptions } from 'fastify';
import characters from './characters.js';
import games from './games.js';
import monsters from './monsters.js';

async function api(fastify: FastifyInstance, opts: FastifyServerOptions) {
  fastify.register(games);
  fastify.register(characters);
  fastify.register(monsters);
}

export default api;
