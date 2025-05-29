import { strict as assert } from 'node:assert';
import { suite, test } from 'node:test';
import { Character } from './character.js';
import { Game } from './game.js';

suite('Game Tests', () => {
  test('Game constructor initializes properties', () => {
    const character = new Character();
    const game = new Game(character);
    assert.ok(game, 'Game instance should be created');
    assert.ok(game.gameId, 'gameId should be assigned');
    assert.equal(
      game.character,
      character,
      'Game should be associated with the correct character',
    );
    assert.ok(Array.isArray(game.treasures), 'Treasures should be an array');
    assert.ok(Array.isArray(game.monsters), 'Monsters should be an array');
    assert.ok(game.roomMap.length > 0, 'Room map should be initialized');
  });
});
