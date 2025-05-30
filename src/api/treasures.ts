import type { UUID } from 'node:crypto';
import type {
  FastifyInstance,
  FastifyRequest,
  FastifyServerOptions,
  RequestGenericInterface,
} from 'fastify';
import { Game } from '../lib/game.js';

interface treasureListRequest extends RequestGenericInterface {
  Querystring: {
    gameId: UUID;
  };
}
interface treasureUpdateRequest extends RequestGenericInterface {
  Params: {
    treasureId: UUID;
  };
  Querystring: {
    gameId: UUID;
  };
  Body: {
    x: number;
    y: number;
    amount: number;
  };
}

async function treasures(fastify: FastifyInstance, opts: FastifyServerOptions) {
  fastify.get(
    '/treasures',
    async (req: FastifyRequest<treasureListRequest>, reply) => {
      const gameId = req.query.gameId;
      const game = await Game.getGame(gameId);
      if (!game) {
        return reply.status(404).send({ error: 'Game not found' });
      }
      return game.treasures;
    },
  );

  fastify.put(
    '/treasures/:treasureId',
    async (req: FastifyRequest<treasureUpdateRequest>, reply) => {
      const gameId = req.query.gameId;
      const game = await Game.getGame(gameId);
      if (!game) {
        return reply.status(404).send({ error: 'Game not found' });
      }

      const treasureId = req.params.treasureId;
      const treasure = game.treasures.find((t) => t.treasureId === treasureId);
      if (!treasure) {
        return reply.status(404).send({ error: 'Treasure not found' });
      }

      const { x, y, amount } = req.body;
      treasure.x = x;
      treasure.y = y;
      treasure.amount = amount;
      return treasure;
    },
  );
}

export default treasures;
