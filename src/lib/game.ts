import { randomUUID } from 'node:crypto';
import type { UUID } from 'node:crypto';
import { Character } from './character.js';
import { getGameById } from './db.js';
import { Monster } from './monster.js';
import { Treasure } from './treasure.js';

class Wall {
  x!: number;
  y!: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Game {
  gameId: UUID;
  characterId!: UUID;
  treasures: Treasure[] = [];
  monsters: Monster[] = [];
  walls: Wall[] = [];
  private static readonly ROOM_HEIGHT = 20;
  private static readonly ROOM_WIDTH = 20;
  private static readonly TREASURE_COUNT = 8;
  private static readonly MONSTER_COUNT = 5;

  private constructor() {
    this.gameId = randomUUID();
  }

  public static async getGame(gameId: UUID): Promise<Game | null> {
    const gameData = await getGameById(gameId);
    if (!gameData) {
      throw new Error(`Game with ID ${gameId} does not exist.`);
    }
    const game = new Game();
    Object.assign(game, gameData);
    return game;
  }

  public static async createGame(characterId: UUID): Promise<Game> {
    const character = await Character.getCharacter(characterId);
    if (!character) {
      throw new Error(`Character with ID ${characterId} does not exist.`);
    }
    const game = new Game();
    game.characterId = characterId;
    game.createRoomMap();
    game.createMonsters();
    game.createTreasures();

    // Move the character to a random start position at one edge of the map
    const edges = [
      { x: Math.floor(Math.random() * Game.ROOM_WIDTH), y: 0 }, // Top edge
      {
        x: Math.floor(Math.random() * Game.ROOM_WIDTH),
        y: Game.ROOM_HEIGHT - 1,
      }, // Bottom edge
      { x: 0, y: Math.floor(Math.random() * Game.ROOM_HEIGHT) }, // Left edge
      {
        x: Game.ROOM_WIDTH - 1,
        y: Math.floor(Math.random() * Game.ROOM_HEIGHT),
      }, // Right edge
    ];
    const start = edges[Math.floor(Math.random() * edges.length)];
    character.x = start.x;
    character.y = start.y;
    return game;
  }

  private createMonsters() {
    this.monsters = [];
    for (let i = 0; i < Game.MONSTER_COUNT; i++) {
      const monster = new Monster();
      monster.x = Math.floor(Math.random() * (Game.ROOM_WIDTH - 2)) + 1; // Ensure monster is not on the wall
      monster.y = Math.floor(Math.random() * (Game.ROOM_HEIGHT - 2)) + 1;
      this.monsters.push(monster);
    }
  }

  private createTreasures() {
    this.treasures = [];
    for (let i = 0; i < Game.TREASURE_COUNT; i++) {
      const treasure = new Treasure();
      treasure.x = Math.floor(Math.random() * (Game.ROOM_WIDTH - 2)) + 1; // Ensure treasure is not on the wall
      treasure.y = Math.floor(Math.random() * (Game.ROOM_HEIGHT - 2)) + 1;
      this.treasures.push(treasure);
    }
  }

  private createRoomMap() {
    for (let i = 0; i < Game.ROOM_HEIGHT; i++) {
      for (let j = 0; j < Game.ROOM_WIDTH; j++) {
        // walls around the edges
        if (
          i === 0 ||
          i === Game.ROOM_HEIGHT - 1 ||
          j === 0 ||
          j === Game.ROOM_WIDTH - 1
        ) {
          this.walls.push(new Wall(j, i));
        } else if (Math.random() < 0.2) {
          // 20% chance to place a wall
          this.walls.push(new Wall(j, i));
        }
      }
    }
  }

  public toJSON(): object {
    return {
      gameId: this.gameId,
      characterId: this.characterId,
      treasures: this.treasures,
      monsters: this.monsters,
      walls: this.walls,
    };
  }
}

export { Game };
