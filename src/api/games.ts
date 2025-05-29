import type { UUID } from 'node:crypto';
import type {
  FastifyInstance,
  FastifyRequest,
  FastifyServerOptions,
  RequestGenericInterface,
} from 'fastify';
import { Games } from '../lib/game.js';

interface getGameRequest extends RequestGenericInterface {
  Querystring: {
    gameId: UUID;
  };
}

interface createGameRequest extends RequestGenericInterface {
  Querystring: {
    characterId: UUID;
  };
}

async function games(fastify: FastifyInstance, opts: FastifyServerOptions) {
  fastify.post(
    '/games',
    async (req: FastifyRequest<createGameRequest>, reply) => {
      const characterId = req.query.characterId;
      const game = Games.getInstance().createGame(characterId);
      return game;
    },
  );

  fastify.get('/games', async (req: FastifyRequest<getGameRequest>, reply) => {
    const gameId = req.query.gameId;
    const game = Games.getInstance().getGame(gameId);
    if (!game) {
      return reply.status(404).send({ error: 'Game not found' });
    }
    return game;
  });
}

export default games;
