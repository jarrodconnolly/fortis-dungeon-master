import { randomUUID } from 'node:crypto';
import type { UUID } from 'node:crypto';
import { faker } from '@faker-js/faker';
import type { CharacterDB } from './db.js';
import { getCharacterById, getCharacters, saveCharacter, updateCharacter } from './db.js';
import { logger } from './logger.js';

const standardStatsArray = [15, 14, 13, 12, 10, 8];

enum CharacterClass {
  Barbarian = 0,
  Bard = 1,
  Cleric = 2,
  Druid = 3,
  Fighter = 4,
  Monk = 5,
  Paladin = 6,
  Ranger = 7,
  Rogue = 8,
  Sorcerer = 9,
  Warlock = 10,
  Wizard = 11,
}

class Character {
  characterId: UUID;
  name!: string;
  level!: number;
  hp!: number;
  xp!: number;
  treasure: { name: string; amount: number }[] = [];
  characterClass!: string;
  Strength!: number;
  Dexterity!: number;
  Constitution!: number;
  Intelligence!: number;
  Wisdom!: number;
  Charisma!: number;

  private constructor() {
    this.characterId = randomUUID();
  }

  public toJSON(): CharacterDB {
    return {
      characterId: this.characterId,
      name: this.name,
      level: this.level,
      hp: this.hp,
      xp: this.xp,
      treasure: this.treasure.map((t) => ({
        name: t.name,
        amount: t.amount,
      })),
      characterClass: this.characterClass,
      Strength: this.Strength,
      Dexterity: this.Dexterity,
      Constitution: this.Constitution,
      Intelligence: this.Intelligence,
      Wisdom: this.Wisdom,
      Charisma: this.Charisma,
    };
  }

  public static async getCharacter(characterId: UUID): Promise<Character | null> {
    const characterData = await getCharacterById(characterId);
    if (!characterData) {
      logger.error(`Character with ID ${characterId} not found`);
      return null;
    }
    const character = new Character();
    Object.assign(character, characterData);
    logger.info(`Character with ID ${characterId} retrieved successfully`);
    return character;
  }

  public static async getCharacters(): Promise<Character[] | null> {
    const characterData = await getCharacters();
    if (!characterData) {
      logger.error('No characters found');
      return null;
    }
    const characters = characterData.map((data: CharacterDB) => {
      const character = new Character();
      Object.assign(character, data);
      return character;
    });
    logger.info(`Retrieved ${characters.length} characters successfully`);
    return characters;
  }

  public static async updateCharacter(character: Character): Promise<Character> {
    const characterData = character.toJSON();
    await updateCharacter(characterData);
    logger.info(`Character with ID ${character.characterId} updated successfully`);
    return character;
  }

  public static async saveCharacter(character: Character): Promise<void> {
    await saveCharacter(character.toJSON());
  }

  public static async generateRandomCharacter(): Promise<Character> {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const level = Math.floor(Math.random() * 5) + 1;
    const characterClass = Math.floor((Math.random() * Object.keys(CharacterClass).length) / 2) as CharacterClass;

    const character = new Character();
    character.name = name;
    character.level = level;
    character.characterClass = CharacterClass[characterClass];
    character.hp = Math.floor(Math.random() * 10) + 1 + level * 2; // Base HP + level scaling
    character.xp = 0; // Start with 0 XP
    character.treasure = [];
    // Shuffle the standard stats array and assign them to the character's stats
    const stats = [...standardStatsArray].sort(() => Math.random() - 0.5);
    character.Strength = stats[0];
    character.Dexterity = stats[1];
    character.Constitution = stats[2];
    character.Intelligence = stats[3];
    character.Wisdom = stats[4];
    character.Charisma = stats[5];

    logger.info(
      `Generated character: ID: ${character.characterId}, Name: ${character.name}, Class: ${character.characterClass}, Level: ${character.level}`,
    );
    await Character.saveCharacter(character);
    return character;
  }
}

export { Character };
