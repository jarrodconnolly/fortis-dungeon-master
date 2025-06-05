import type { UUID } from 'node:crypto';
import type { FastifyInstance, FastifyRequest, FastifyServerOptions, RequestGenericInterface } from 'fastify';
import { Game } from '../lib/game.js';

interface getGameRequest extends RequestGenericInterface {
  Params: {
    gameId: UUID;
  };
}

interface joinGameRequest extends RequestGenericInterface {
  Querystring: {
    gameId: UUID;
    characterId: UUID;
  };
}

interface updateGameRequest extends RequestGenericInterface {
  Params: {
    gameId: UUID;
  };
  Body: {
    characters: {
      x: number;
      y: number;
    };
  };
}

interface createGameRequest extends RequestGenericInterface {
  Querystring: {
    characterId: UUID;
  };
}

async function games(fastify: FastifyInstance, opts: FastifyServerOptions) {
  fastify.post('/games', async (req: FastifyRequest<createGameRequest>, reply) => {
    const characterId = req.query.characterId;
    const game = Game.createGame(characterId);
    return game;
  });

  fastify.post(
    '/games/:gameId/move',
    async (
      req: FastifyRequest<{
        Params: { gameId: UUID };
        Querystring: { characterId: UUID; direction: 'up' | 'down' | 'left' | 'right' };
      }>,
      reply,
    ) => {
      const characterId = req.query.characterId;
      const direction = req.query.direction;
      const game = await Game.getGame(req.params.gameId);
      if (!game) {
        return reply.status(404).send({ error: 'Game not found' });
      }
      const result = await game.moveCharacter(characterId, direction);
      return result;
    },
  );

  fastify.post('/games/join', async (req: FastifyRequest<joinGameRequest>, reply) => {
    const gameId = req.query.gameId;
    const characterId = req.query.characterId;
    const game = Game.joinGame(gameId, characterId);
    return game;
  });

  fastify.put('/games/:gameId', async (req: FastifyRequest<updateGameRequest>, reply) => {
    const gameId = req.params.gameId;
    const game = await Game.getGame(gameId);
    if (!game) {
      return reply.status(404).send({ error: 'Game not found' });
    }
    // Update game properties based on request body
    Object.assign(game, req.body);
    await Game.updateGame(game);
    return game;
  });

  fastify.get('/games/:gameId', async (req: FastifyRequest<getGameRequest>, reply) => {
    const game = await Game.getGame(req.params.gameId);
    if (!game) {
      return reply.status(404).send({ error: 'Game not found' });
    }
    return game;
  });

  fastify.get('/games', async (req, reply) => {
    const games = await Game.getGames();
    if (!games) {
      return reply.status(404).send({ error: 'No games found' });
    }
    return games;
  });
}

export default games;
