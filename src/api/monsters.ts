import type { UUID } from 'node:crypto';
import type { FastifyInstance, FastifyRequest, FastifyServerOptions, RequestGenericInterface } from 'fastify';
import { Game } from '../lib/game.js';

interface monsterListRequest extends RequestGenericInterface {
  Querystring: {
    gameId: UUID;
  };
}
interface monsterUpdateRequest extends RequestGenericInterface {
  Params: {
    monsterId: UUID;
  };
  Querystring: {
    gameId: UUID;
  };
  Body: {
    x: number;
    y: number;
    hp: number;
  };
}

async function monsters(fastify: FastifyInstance, opts: FastifyServerOptions) {
  // List all monsters in a game
  fastify.get('/monsters', async (req: FastifyRequest<monsterListRequest>, reply) => {
    const gameId = req.query.gameId;
    const game = await Game.getGame(gameId);
    if (!game) {
      return reply.status(404).send({ error: 'Game not found' });
    }
    return game.monsters;
  });

  // Update a monster (unused presently)
  fastify.put('/monsters/:monsterId', async (req: FastifyRequest<monsterUpdateRequest>, reply) => {
    const gameId = req.query.gameId;
    const game = await Game.getGame(gameId);
    if (!game) {
      return reply.status(404).send({ error: 'Game not found' });
    }

    const monsterId = req.params.monsterId;
    const monster = game.monsters.find((m) => m.monsterId === monsterId);
    if (!monster) {
      return reply.status(404).send({ error: 'Monster not found' });
    }

    const { x, y, hp } = req.body;
    monster.x = x;
    monster.y = y;
    monster.hp = hp;
    return monster;
  });
}

export default monsters;
