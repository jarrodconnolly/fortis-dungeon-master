import { randomUUID } from 'node:crypto';
import type { UUID } from 'node:crypto';
import { Character } from './character.js';
import { getGameById, saveGame } from './db.js';
import type { GameDB } from './db.js';
import { logger } from './logger.js';
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
  characters!: UUID[];
  treasures: Treasure[] = [];
  monsters: Monster[] = [];
  walls: Wall[] = [];
  roomHeight: number;
  roomWidth: number;
  treasureCount: number;
  monsterCount: number;

  constructor(
    roomHeight = 20,
    roomWidth = 20,
    treasureCount = 8,
    monsterCount = 5,
  ) {
    this.gameId = randomUUID();
    this.roomHeight = roomHeight;
    this.roomWidth = roomWidth;
    this.treasureCount = treasureCount;
    this.monsterCount = monsterCount;
  }

  public static async getGame(gameId: UUID): Promise<Game | null> {
    const gameDataRaw = await getGameById(gameId);
    if (!gameDataRaw) {
      throw new Error(`Game with ID ${gameId} does not exist.`);
    }
    // Use default world parameters for loaded games
    const game = new Game();
    Object.assign(game, gameDataRaw);
    return game;
  }

  public static async saveGame(game: Game): Promise<void> {
    await saveGame(game.toJSON());
  }

  public static async joinGame(gameId: UUID, characterId: UUID): Promise<Game> {
    logger.info(`Character ${characterId} is joining game ${gameId}`);
    const game = await Game.getGame(gameId);
    if (!game) {
      throw new Error(`Game with ID ${gameId} does not exist.`);
    }
    if (game.characters.includes(characterId)) {
      throw new Error(`Character ${characterId} is already in the game.`);
    }
    const character = await Character.getCharacter(characterId);
    if (!character) {
      throw new Error(`Character with ID ${characterId} does not exist.`);
    }
    game.characters.push(characterId);
    await Game.saveGame(game);
    return game;
  }

  public static async createGame(
    characterId: UUID,
    roomHeight = 20,
    roomWidth = 20,
    treasureCount = 8,
    monsterCount = 5,
  ): Promise<Game> {
    logger.info(
      `Creating game for character ${characterId} with dimensions ${roomWidth}x${roomHeight}, treasures: ${treasureCount}, monsters: ${monsterCount}`,
    );
    const character = await Character.getCharacter(characterId);
    if (!character) {
      throw new Error(`Character with ID ${characterId} does not exist.`);
    }
    const game = new Game(roomHeight, roomWidth, treasureCount, monsterCount);
    game.characters = [characterId];
    game.createRoomMap();
    game.createMonsters();
    game.createTreasures();

    // Move the character to a random start position at one edge of the map
    let start: { x: number; y: number };
    do {
      const edges = [
        { x: Math.floor(Math.random() * game.roomWidth), y: 1 }, // Top edge
        {
          x: Math.floor(Math.random() * game.roomWidth),
          y: game.roomHeight - 2,
        }, // Bottom edge
        { x: 1, y: Math.floor(Math.random() * game.roomHeight) }, // Left edge
        {
          x: game.roomWidth - 2,
          y: Math.floor(Math.random() * game.roomHeight),
        }, // Right edge
      ];
      start = edges[Math.floor(Math.random() * edges.length)];
      logger.info(`Trying start position: (${start.x}, ${start.y})`);
    } while (game.checkLocation(start.x, start.y));

    character.x = start.x;
    character.y = start.y;
    await Game.saveGame(game);
    return game;
  }

  checkLocation(x: number, y: number): Wall | Monster | Treasure | null {
    // Check if the coordinates are within the room bounds
    if (x < 0 || x >= this.roomWidth || y < 0 || y >= this.roomHeight) {
      return null;
    }
    // Check for walls
    for (const wall of this.walls) {
      if (wall.x === x && wall.y === y) {
        return wall;
      }
    }
    // Check for monsters
    for (const monster of this.monsters) {
      if (monster.x === x && monster.y === y) {
        return monster;
      }
    }
    // Check for treasures
    for (const treasure of this.treasures) {
      if (treasure.x === x && treasure.y === y) {
        return treasure;
      }
    }
    return null;
  }

  drawMap(): string {
    let map = '';
    for (let i = 0; i < this.roomHeight; i++) {
      for (let j = 0; j < this.roomWidth; j++) {
        const location = this.checkLocation(j, i);
        if (location instanceof Character) {
          map += 'C'; // Character
        } else if (location instanceof Wall) {
          map += '█'; // Wall
        } else if (location instanceof Monster) {
          map += 'M'; // Monster
        } else if (location instanceof Treasure) {
          map += 'T'; // Treasure
        } else {
          map += ' '; // Empty space
        }
      }
      map += '\n';
    }
    return map;
  }

  private createMonsters() {
    this.monsters = [];
    for (let i = 0; i < this.monsterCount; i++) {
      const monster = new Monster();
      monster.x = Math.floor(Math.random() * (this.roomWidth - 2)) + 1; // Ensure monster is not on the wall
      monster.y = Math.floor(Math.random() * (this.roomHeight - 2)) + 1;
      this.monsters.push(monster);
    }
  }

  private createTreasures() {
    this.treasures = [];
    for (let i = 0; i < this.treasureCount; i++) {
      const treasure = new Treasure();
      treasure.x = Math.floor(Math.random() * (this.roomWidth - 2)) + 1; // Ensure treasure is not on the wall
      treasure.y = Math.floor(Math.random() * (this.roomHeight - 2)) + 1;
      this.treasures.push(treasure);
    }
  }

  private createRoomMap() {
    for (let i = 0; i < this.roomHeight; i++) {
      for (let j = 0; j < this.roomWidth; j++) {
        // walls around the edges
        if (
          i === 0 ||
          i === this.roomHeight - 1 ||
          j === 0 ||
          j === this.roomWidth - 1
        ) {
          this.walls.push(new Wall(j, i));
        } else if (Math.random() < 0.2) {
          // 20% chance to place a wall
          this.walls.push(new Wall(j, i));
        }
      }
    }
  }

  public toJSON(): GameDB {
    return {
      gameId: this.gameId,
      characters: this.characters,
      treasures: this.treasures,
      monsters: this.monsters,
      walls: this.walls,
      roomHeight: this.roomHeight,
      roomWidth: this.roomWidth,
    };
  }
}

export { Game };
