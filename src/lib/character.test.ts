import { strict as assert } from 'node:assert';
import { suite, test } from 'node:test';
import { Character, Characters } from './character.js';

suite('Character and Characters Tests', () => {
  test('Character constructor assigns a UUID', () => {
    const character = new Character();
    assert.ok(character.characterId, 'characterId should be assigned');
  });

  test('Character toString returns valid JSON string', () => {
    const character = new Character();
    character.name = 'Test Name';
    character.level = 1;
    character.characterClass = 'Wizard';
    character.Strength = 10;
    character.Dexterity = 10;
    character.Constitution = 10;
    character.Intelligence = 10;
    character.Wisdom = 10;
    character.Charisma = 10;

    const str = character.toString();
    const obj = JSON.parse(str);
    assert.equal(obj.name, 'Test Name');
    assert.equal(obj.level, 1);
    assert.equal(obj.characterClass, 'Wizard');
    assert.equal(obj.Strength, 10);
  });

  test('Characters.getInstance returns a singleton', () => {
    const a = Characters.getInstance();
    const b = Characters.getInstance();
    assert.equal(a, b, 'Should return the same instance');
  });

  test('Characters.generateRandomCharacter creates a valid character', () => {
    const chars = Characters.getInstance();
    const character = chars.generateRandomCharacter();
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

  test('Characters.getCharacter retrieves the correct character', () => {
    const chars = Characters.getInstance();
    const character = chars.generateRandomCharacter();
    const fetched = chars.getCharacter(character.characterId);
    assert.equal(fetched, character, 'Should retrieve the same character');
  });
});
