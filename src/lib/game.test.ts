import { strict as assert } from 'node:assert';
import { suite, test } from 'node:test';
import { Character } from './character.js';
import { Game } from './game.js';

suite('Game Tests', () => {
  test('Game constructor initializes properties', async () => {
    const character = Character.generateRandomCharacter();
    await Character.saveCharacter(character);
    const game = await Game.createGame(character.characterId);
    assert.ok(game, 'Game instance should be created');
    assert.ok(game.gameId, 'gameId should be assigned');
    assert.equal(
      game.characterId,
      character.characterId,
      'Game should be associated with the correct character',
    );
    assert.ok(Array.isArray(game.treasures), 'Treasures should be an array');
    assert.ok(Array.isArray(game.monsters), 'Monsters should be an array');
    assert.ok(Array.isArray(game.walls), 'Walls should be an array');
    assert.ok(game.treasures.length > 0, 'Treasures should be initialized');
    assert.ok(game.monsters.length > 0, 'Monsters should be initialized');
    assert.ok(game.walls.length > 0, 'Walls should be initialized');
  });
});
