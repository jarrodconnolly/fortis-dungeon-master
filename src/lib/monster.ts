import { randomUUID } from 'node:crypto';
import type { UUID } from 'node:crypto';
import { faker } from '@faker-js/faker';
import type { AnimalModule } from '@faker-js/faker';

const animalTypes = [
  'bear',
  'bird',
  'cat',
  'cetacean',
  'cow',
  'crocodilia',
  'dog',
  'fish',
  'horse',
  'insect',
  'lion',
  'rabbit',
  'rodent',
  'snake',
];

const standardStatsArray = [6, 7, 7, 9, 9, 13];

class Monster {
  monsterId: UUID;
  name: string;
  x!: number;
  y!: number;
  hp!: number;
  level!: number;
  Strength!: number;
  Dexterity!: number;
  Constitution!: number;
  Intelligence!: number;
  Wisdom!: number;
  Charisma!: number;

  constructor() {
    this.monsterId = randomUUID();
    const animalType = faker.helpers.arrayElement(animalTypes) as keyof AnimalModule;
    this.name = `${faker.animal[animalType]()}`;
    this.level = Math.floor(Math.random() * 3) + 1;
    this.hp = Math.floor(Math.random() * 10) + 1 + this.level * 2;

    const stats = [...standardStatsArray].sort(() => Math.random() - 0.5);
    this.Strength = stats[0];
    this.Dexterity = stats[1];
    this.Constitution = stats[2];
    this.Intelligence = stats[3];
    this.Wisdom = stats[4];
    this.Charisma = stats[5];
  }
}

export { Monster };
