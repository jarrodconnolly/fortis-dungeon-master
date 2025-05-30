import { strict as assert } from 'node:assert';
import { suite, test } from 'node:test';
import { Character } from './character.js';
import { Game } from './game.js';

suite('Game Tests', () => {
  test('Game constructor initializes properties', async () => {
    const character = await Character.generateRandomCharacter();
    await Character.saveCharacter(character);
    const game = await Game.createGame(character.characterId);
    assert.ok(game, 'Game instance should be created');
    assert.ok(game.gameId, 'gameId should be assigned');
    assert.equal(
      game.characters[0],
      character.characterId,
      'Game should be associated with the correct character',
    );
    assert.ok(Array.isArray(game.treasures), 'Treasures should be an array');
    assert.ok(Array.isArray(game.monsters), 'Monsters should be an array');
    assert.ok(Array.isArray(game.walls), 'Walls should be an array');
    assert.ok(game.treasures.length > 0, 'Treasures should be initialized');
    assert.ok(game.monsters.length > 0, 'Monsters should be initialized');
    assert.ok(game.walls.length > 0, 'Walls should be initialized');
    assert.equal(game.roomHeight, 20, 'Default room height should be 20');
    assert.equal(game.roomWidth, 20, 'Default room width should be 20');
    assert.equal(game.treasureCount, 8, 'Default treasure count should be 8');
    assert.equal(game.monsterCount, 5, 'Default monster count should be 5');
  });
});
