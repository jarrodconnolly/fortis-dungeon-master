import type { UUID } from 'node:crypto';
import type {
  FastifyInstance,
  FastifyRequest,
  RequestGenericInterface,
} from 'fastify';
import { Character } from '../lib/character.js';

interface characterRequest extends RequestGenericInterface {
  Querystring: {
    characterId: UUID;
  };
}

async function characters(fastify: FastifyInstance) {
  fastify.post('/characters', async (req, reply) => {
    const character = Character.generateRandomCharacter();
    return character;
  });

  fastify.get(
    '/characters',
    async (req: FastifyRequest<characterRequest>, reply) => {
      const characterId = req.query.characterId as UUID;
      const character = Character.getCharacter(characterId);
      if (!character) {
        return reply.status(404).send({ error: 'Character not found' });
      }
      return character;
    },
  );
}

export default characters;
