import { strict as assert } from 'node:assert';
import { suite, test } from 'node:test';
import { Character } from './character.js';

suite('Character Tests', () => {
  test('Character returns valid JSON object', async () => {
    const character = await Character.generateRandomCharacter();
    const obj = character.toJSON();
    assert.ok(typeof obj.name === 'string');
    assert.ok(typeof obj.level === 'number');
    assert.ok(typeof obj.characterClass === 'string');
    assert.ok(typeof obj.Strength === 'number');
    await Character.saveCharacter(character);
  });

  test('Character.generateRandomCharacter creates a valid character', async () => {
    const character = await Character.generateRandomCharacter();
    assert.ok(character.name, 'Character should have a name');
    assert.ok(
      character.level >= 1 && character.level <= 5,
      'Level should be between 1 and 5',
    );
    assert.ok(
      typeof character.characterClass === 'string',
      'characterClass should be a string',
    );
    assert.ok(
      typeof character.Strength === 'number',
      'Strength should be a number',
    );
    assert.ok(
      typeof character.Dexterity === 'number',
      'Dexterity should be a number',
    );
    assert.ok(
      typeof character.Constitution === 'number',
      'Constitution should be a number',
    );
    assert.ok(
      typeof character.Intelligence === 'number',
      'Intelligence should be a number',
    );
    assert.ok(
      typeof character.Wisdom === 'number',
      'Wisdom should be a number',
    );
    assert.ok(
      typeof character.Charisma === 'number',
      'Charisma should be a number',
    );
  });

  test('Character.getCharacter retrieves the correct character', async () => {
    const character = await Character.generateRandomCharacter();
    await Character.saveCharacter(character);
    const fetched = await Character.getCharacter(character.characterId);
    assert.deepEqual(fetched, character, 'Should retrieve the same character');
  });
});
