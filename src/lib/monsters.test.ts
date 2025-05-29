import { strict as assert } from 'node:assert';
import { suite, test } from 'node:test';
import { Monster } from './monsters.js';

suite('Monster Tests', () => {
  test('Monster constructor assigns a UUID', () => {
    const monster = new Monster();
    assert.ok(monster.monsterId, 'monsterId should be assigned');
    assert.ok(
      typeof monster.monsterId === 'string',
      'monsterId should be a string',
    );
    assert.ok(monster.monsterId.length > 0, 'monsterId should not be empty');
  });
});
