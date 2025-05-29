import { randomUUID } from 'node:crypto';
import type { UUID } from 'node:crypto';
import type { Character } from './character.js';
import { Characters } from './character.js';
import { Monster } from './monsters.js';
import { Treasure } from './treasure.js';

class Games {
  private static instance: Games;
  private games: Game[];

  private constructor() {
    this.games = [];
  }

  public static getInstance(): Games {
    if (!Games.instance) {
      Games.instance = new Games();
    }
    return Games.instance;
  }

  public createGame(characterId: UUID): Game {
    const character = Characters.getInstance().getCharacter(characterId);
    if (!character) {
      throw new Error(`Character with ID ${characterId} does not exist.`);
    }
    const game = new Game(character);
    this.games.push(game);
    return game;
  }

  public getGame(gameId: UUID): Game | undefined {
    return this.games.find((game) => game.gameId === gameId);
  }
}

class Game {
  gameId: UUID;
  character: Character;
  treasures: Treasure[] = [];
  monsters: Monster[] = [];
  private static readonly ROOM_HEIGHT = 20;
  private static readonly ROOM_WIDTH = 20;
  private static readonly TREASURE_COUNT = 8;
  private static readonly MONSTER_COUNT = 5;

  roomMap: string[][] = Array.from({ length: Game.ROOM_HEIGHT }, () =>
    Array(Game.ROOM_WIDTH).fill(' '),
  );

  constructor(character: Character) {
    this.gameId = randomUUID();
    this.character = character;
    this.createRoomMap();
    this.createMonsters();
    this.createTreasures();

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
    this.character.x = start.x;
    this.character.y = start.y;
    this.roomMap[start.y][start.x] = 'C';
  }

  private createMonsters() {
    this.monsters = [];
    for (let i = 0; i < Game.MONSTER_COUNT; i++) {
      const monster = new Monster();
      monster.x = Math.floor(Math.random() * (Game.ROOM_WIDTH - 2)) + 1; // Ensure monster is not on the wall
      monster.y = Math.floor(Math.random() * (Game.ROOM_HEIGHT - 2)) + 1;
      this.roomMap[monster.y][monster.x] = 'M'; // Place monster on the map
      this.monsters.push(monster);
    }
  }

  private createTreasures() {
    this.treasures = [];
    for (let i = 0; i < Game.TREASURE_COUNT; i++) {
      const treasure = new Treasure();
      treasure.x = Math.floor(Math.random() * (Game.ROOM_WIDTH - 2)) + 1; // Ensure treasure is not on the wall
      treasure.y = Math.floor(Math.random() * (Game.ROOM_HEIGHT - 2)) + 1;
      this.roomMap[treasure.y][treasure.x] = 'T'; // Place treasure on the map
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
          this.roomMap[i][j] = '#'; // Wall
        } else if (Math.random() < 0.2) {
          // 20% chance to place a wall
          this.roomMap[i][j] = '#'; // Wall
        } else {
          this.roomMap[i][j] = '.'; // Floor
        }
      }
    }
  }

  public toJSON(): object {
    const map = this.roomMap.map((row) => row.join('')).join('\n');
    return {
      gameId: this.gameId,
      character: this.character,
      treasures: this.treasures,
      monsters: this.monsters,
      roomMap: map,
    };
  }
}

export { Games, Game };
