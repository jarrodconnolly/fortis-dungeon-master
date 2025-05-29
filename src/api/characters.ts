import type { UUID } from 'node:crypto';
import type {
  FastifyInstance,
  FastifyRequest,
  FastifyServerOptions,
  RequestGenericInterface,
} from 'fastify';
import { Characters } from '../lib/character.js';

interface characterRequest extends RequestGenericInterface {
  Querystring: {
    characterId: UUID;
  };
}

async function characters(
  fastify: FastifyInstance,
  opts: FastifyServerOptions,
) {
  fastify.post('/characters', async (req, reply) => {
    const character = Characters.getInstance().generateRandomCharacter();
    return character;
  });

  fastify.get(
    '/characters',
    async (req: FastifyRequest<characterRequest>, reply) => {
      const characterId = req.query.characterId as UUID;
      const character = Characters.getInstance().getCharacter(characterId);
      if (!character) {
        return reply.status(404).send({ error: 'Character not found' });
      }
      return character;
    },
  );
}

export default characters;
