import { randomUUID } from 'node:crypto';
import type { UUID } from 'node:crypto';
import { faker } from '@faker-js/faker';

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
  x: number;
  y: number;
  level!: number;
  hp!: number;
  characterClass!: string;
  Strength!: number;
  Dexterity!: number;
  Constitution!: number;
  Intelligence!: number;
  Wisdom!: number;
  Charisma!: number;

  constructor() {
    this.characterId = randomUUID();
    this.x = 0;
    this.y = 0;
  }

  public toString(): string {
    return JSON.stringify(
      {
        characterId: this.characterId,
        name: this.name,
        level: this.level,
        hp: this.hp,
        characterClass: this.characterClass,
        Strength: this.Strength,
        Dexterity: this.Dexterity,
        Constitution: this.Constitution,
        Intelligence: this.Intelligence,
        Wisdom: this.Wisdom,
        Charisma: this.Charisma,
      },
      null,
      2,
    );
  }
}

class Characters {
  private static instance: Characters;
  private characters: Map<UUID, Character>;

  private constructor() {
    this.characters = new Map<UUID, Character>();
  }

  public static getInstance(): Characters {
    if (!Characters.instance) {
      Characters.instance = new Characters();
    }
    return Characters.instance;
  }

  public generateRandomCharacter(): Character {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const level = Math.floor(Math.random() * 5) + 1;
    const characterClass = Math.floor(
      (Math.random() * Object.keys(CharacterClass).length) / 2,
    ) as CharacterClass;

    const character = new Character();
    character.name = name;
    character.level = level;
    character.characterClass = CharacterClass[characterClass];
    character.hp = Math.floor(Math.random() * 10) + 1 + level * 2; // Base HP + level scaling

    // Shuffle the standard stats array and assign them to the character's stats
    const stats = [...standardStatsArray].sort(() => Math.random() - 0.5);
    character.Strength = stats[0];
    character.Dexterity = stats[1];
    character.Constitution = stats[2];
    character.Intelligence = stats[3];
    character.Wisdom = stats[4];
    character.Charisma = stats[5];
    this.characters.set(character.characterId, character);
    return character;
  }

  public getCharacter(characterId: UUID): Character | undefined {
    return this.characters.get(characterId);
  }
}

export { Character, Characters };
