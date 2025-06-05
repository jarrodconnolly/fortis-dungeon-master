import type { FastifyInstance, FastifyServerOptions } from 'fastify';
import characters from './characters.js';
import games from './games.js';
import monsters from './monsters.js';
import treasures from './treasures.js';

// Fastify API entry point
// This file registers all the API routes for the application.
async function api(fastify: FastifyInstance, opts: FastifyServerOptions) {
  fastify.register(games);
  fastify.register(characters);
  fastify.register(monsters);
  fastify.register(treasures);
}

export default api;
