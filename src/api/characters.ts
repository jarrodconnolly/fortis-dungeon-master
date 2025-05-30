import type { UUID } from 'node:crypto';
import type { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { Character } from '../lib/character.js';

interface characterRequest {
  characterId: UUID;
}

const characterOptions = {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        characterId: { type: 'string', format: 'uuid' },
      },
      required: ['characterId'],
    },
  },
};

const postCharacterOptions: RouteShorthandOptions = {
  schema: {
    body: { additionalProperties: false },
    querystring: { additionalProperties: false },
    params: { additionalProperties: false },
    headers: { additionalProperties: false },
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
  fastify.post('/characters', postCharacterOptions, async (req, reply) => {
    const character = await Character.generateRandomCharacter();
    return character;
  });

  fastify.get<{ Querystring: characterRequest }>(
    '/characters',
    characterOptions,
    async (req, reply) => {
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
