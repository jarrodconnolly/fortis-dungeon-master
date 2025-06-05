import type { UUID } from 'node:crypto';
import type { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { Character } from '../lib/character.js';

interface characterRequest {
  characterId: UUID;
}

// Example using Fastify's schema validation
const postCharacterOptions: RouteShorthandOptions = {
  schema: {
    response: {
      404: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
      200: {
        type: 'object',
        properties: {
          characterId: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          class: { type: 'string' },
          level: { type: 'integer' },
          hp: { type: 'integer' },
          xp: { type: 'integer' },
          characterClass: { type: 'string' },
          Strength: { type: 'integer' },
          Dexterity: { type: 'integer' },
          Constitution: { type: 'integer' },
          Intelligence: { type: 'integer' },
          Wisdom: { type: 'integer' },
          Charisma: { type: 'integer' },
        },
      },
    },
  },
};

async function characters(fastify: FastifyInstance) {
  // Generate a random character
  fastify.post('/characters', postCharacterOptions, async (req, reply) => {
    const character = await Character.generateRandomCharacter();
    return character;
  });

  // Get a specific character by ID
  fastify.get<{ Params: characterRequest }>('/characters/:characterId', async (req, reply) => {
    const characterId = req.params.characterId as UUID;
    const character = Character.getCharacter(characterId);
    if (!character) {
      return reply.status(404).send({ error: 'Character not found' });
    }
    return character;
  });

  // Get all characters
  fastify.get('/characters', async (req, reply) => {
    const characters = Character.getCharacters();
    return characters;
  });
}

export default characters;
