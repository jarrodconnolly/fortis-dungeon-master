import { randomUUID } from 'node:crypto';
import type { UUID } from 'node:crypto';
import { faker } from '@faker-js/faker';

class Treasure {
  treasureId: UUID;
  name: string;
  amount: number;
  x!: number;
  y!: number;

  constructor() {
    this.treasureId = randomUUID();
    this.name = faker.science.chemicalElement().name;
    this.amount = Math.floor(Math.random() * 100) + 1;
  }
}

export { Treasure };
