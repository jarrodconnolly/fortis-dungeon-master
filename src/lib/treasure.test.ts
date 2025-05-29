import { strict as assert } from 'node:assert';
import { suite, test } from 'node:test';
import { Treasure } from './treasure.js';

suite('Treasure Tests', () => {
  test('Treasure constructor assigns a UUID', () => {
    const treasure = new Treasure();
    assert.ok(treasure.treasureId, 'treasureId should be assigned');
  });

  test('Treasure toString returns valid JSON string', () => {
    const treasure = new Treasure();
    assert.ok(typeof treasure.amount === 'number', 'amount should be a number');
    assert.ok(treasure.amount > 0, 'Amount should be greater than 0');
    assert.ok(typeof treasure.name === 'string', 'name should be a string');
    assert.ok(treasure.name.length > 0, 'Treasure should have a name');
  });
});
