import { log } from 'node:console';
import { randomInt, randomUUID } from 'node:crypto';
import type { UUID } from 'node:crypto';
import { faker } from '@faker-js/faker';
import { Character } from './character.js';
import { getGameById, getGames, saveGame, updateGame } from './db.js';
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
  name: string;
  characters!: { characterId: UUID; x: number; y: number }[];
  treasures: Treasure[] = [];
  monsters: Monster[] = [];
  walls: Wall[] = [];
  roomHeight: number;
  roomWidth: number;
  treasureCount: number;
  monsterCount: number;

  constructor(roomHeight = 20, roomWidth = 20, treasureCount = 8, monsterCount = 5) {
    this.gameId = randomUUID();
    this.roomHeight = roomHeight;
    this.roomWidth = roomWidth;
    this.treasureCount = treasureCount;
    this.monsterCount = monsterCount;

    this.name = `${faker.commerce.productMaterial()} ${faker.commerce.product()}`;
  }

  public static async getGames(): Promise<Game[]> {
    const gameDataRaw = await getGames();
    if (!gameDataRaw) {
      logger.error('No games found');
      return [];
    }
    const games: Game[] = [];
    for (const gameData of gameDataRaw) {
      const game = new Game();
      Object.assign(game, gameData);
      games.push(game);
    }
    logger.info(`Retrieved ${games.length} games`);
    return games;
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

  public static async updateGame(game: Game): Promise<void> {
    await updateGame(game.toJSON());
  }

  public static async joinGame(gameId: UUID, characterId: UUID): Promise<Game> {
    logger.info(`Character ${characterId} is joining game ${gameId}`);
    const game = await Game.getGame(gameId);
    if (!game) {
      throw new Error(`Game with ID ${gameId} does not exist.`);
    }
    if (game.characters.some((c) => c.characterId === characterId)) {
      throw new Error(`Character ${characterId} is already in the game.`);
    }
    const character = await Character.getCharacter(characterId);
    if (!character) {
      throw new Error(`Character with ID ${characterId} does not exist.`);
    }
    const start = Game.findStartPosition(game);
    game.characters.push({ characterId, x: start.x, y: start.y });
    await Game.updateGame(game);
    return game;
  }

  private static findStartPosition(game: Game): { x: number; y: number } {
    // Find a random start position at one edge of the map
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
    } while (game.checkLocationOccupied(start.x, start.y));
    return start;
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

    game.createRoomMap();
    game.createMonsters();
    game.createTreasures();

    const start = Game.findStartPosition(game);
    game.characters = [{ characterId, x: start.x, y: start.y }];
    await Game.saveGame(game);
    return game;
  }

  async moveCharacter(characterId: UUID, direction: 'up' | 'down' | 'left' | 'right'): Promise<object> {
    const character = this.characters.find((c) => c.characterId === characterId);
    if (!character) {
      throw new Error(`Character with ID ${characterId} does not exist.`);
    }

    let newX = character.x;
    let newY = character.y;

    switch (direction) {
      case 'up':
        newY -= 1;
        break;
      case 'down':
        newY += 1;
        break;
      case 'left':
        newX -= 1;
        break;
      case 'right':
        newX += 1;
        break;
      default:
        throw new Error(`Invalid direction: ${direction}`);
    }

    let responseMessage = '';
    const isWall = this.checkWall(newX, newY);
    if (isWall) {
      logger.error(`Character ${characterId} tried to move into a wall at (${newX}, ${newY})`);
      return { success: false, message: 'Cannot move into a wall' };
    }

    const monster = this.checkMonster(newX, newY);
    if (monster) {
      // Use stats to run a combat encounter simulation
      const characterDB = await Character.getCharacter(characterId);
      if (!characterDB) {
        logger.error(`Character with ID ${characterId} not found`);
        return { success: false, message: 'Character not found' };
      }
      const characterName = characterDB.name;
      const monsterName = monster.name || 'Monster'; // Fallback if monster has no name
      // go round by round, rolling "dice" to simulate a D&D combat encounter
      let characterHP = characterDB.hp;
      let monsterHP = monster.hp; // Assume Monster has a hp property
      responseMessage = `${characterName} encounters ${monsterName} at (${newX}, ${newY})\n`;
      while (characterHP > 0 && monsterHP > 0) {
        // Character attempts to hit monster
        const characterHitRoll = randomInt(1, 20) + characterDB.Dexterity; // Simulate hit roll
        if (characterHitRoll >= monster.Dexterity) {
          // Compare to monster's Dexterity
          monsterHP -= randomInt(1, 8); // Simulate damage roll
          responseMessage += `${characterName} hits ${monsterName} for damage. HP: ${monsterHP}\n`;
        }
        // Monster attempts to hit character
        const monsterHitRoll = randomInt(1, 20) + monster.Dexterity; // Simulate monster hit roll
        if (monsterHitRoll >= characterDB.Dexterity) {
          // Compare to character's Dexterity
          characterHP -= randomInt(1, 8); // Simulate monster damage roll
          responseMessage += `${monsterName} hits ${characterName} for damage. HP: ${characterHP}\n`;
        }
      }
      // Check if character is defeated
      if (characterHP <= 0) {
        logger.error(`${characterName} has been defeated by ${monsterName} at (${newX}, ${newY})`);
        responseMessage += `${characterName} has been defeated by ${monsterName} at (${newX}, ${newY})\n`;
        await Character.updateCharacter(characterDB);
        await Game.updateGame(this);
        return { success: false, message: responseMessage };
      }
      logger.info(`${characterName} defeated ${monsterName} at (${newX}, ${newY})`);
      responseMessage += `${characterName} defeated ${monsterName} at (${newX}, ${newY})\n`;
      // Remove the monster from the game
      this.monsters = this.monsters.filter((m) => !(m.x === newX && m.y === newY));
      characterDB.xp += randomInt(20, 50); // Random XP gain for defeating a monster
      await Character.updateCharacter(characterDB);
      await Game.updateGame(this);
      return { success: true, message: responseMessage };
    }

    const treasure = this.checkTreasure(newX, newY);
    if (treasure) {
      // Collect the treasure
      this.treasures = this.treasures.filter((t) => !(t.x === newX && t.y === newY));
      const characterDB = await Character.getCharacter(characterId);
      if (!characterDB) {
        logger.error(`Character with ID ${characterId} not found`);
        return { success: false, message: 'Character not found' };
      }
      characterDB.treasure.push({ name: treasure.name, amount: treasure.amount });
      characterDB.xp += randomInt(10, 20); // Random XP gain
      logger.info(`Character ${characterId} collected a treasure!`);
      responseMessage = `Character ${characterDB.name} collected a treasure: ${treasure.name} (${treasure.amount})\n`;
      await Character.updateCharacter(characterDB);
    }

    // Update character position
    character.x = newX;
    character.y = newY;

    // Save the game state
    await Game.updateGame(this);

    return { success: true, message: responseMessage };
  }

  /**
   * Checks if the given coordinates are within the bounds of the room and if there is a wall at that location.
   * Returns true if there is a wall, false otherwise.
   */
  checkWall(x: number, y: number): boolean {
    // Check if the coordinates are within the room bounds
    if (x < 0 || x >= this.roomWidth || y < 0 || y >= this.roomHeight) {
      return false;
    }
    // Check for walls
    for (const wall of this.walls) {
      if (wall.x === x && wall.y === y) {
        return true;
      }
    }
    return false;
  }

  checkMonster(x: number, y: number): Monster | null {
    // Check if the coordinates are within the room bounds
    if (x < 0 || x >= this.roomWidth || y < 0 || y >= this.roomHeight) {
      return null;
    }
    // Check for monsters
    for (const monster of this.monsters) {
      if (monster.x === x && monster.y === y) {
        return monster;
      }
    }
    return null;
  }
  checkTreasure(x: number, y: number): Treasure | null {
    // Check if the coordinates are within the room bounds
    if (x < 0 || x >= this.roomWidth || y < 0 || y >= this.roomHeight) {
      return null;
    }
    // Check for treasures
    for (const treasure of this.treasures) {
      if (treasure.x === x && treasure.y === y) {
        return treasure;
      }
    }
    return null;
  }

  /**
   * Checks the location at the given coordinates.
   * Returns true if the location is occupied by a wall, monster, or treasure
   * Does not check for characters.
   */
  checkLocationOccupied(x: number, y: number): boolean {
    // Check if the coordinates are within the room bounds
    if (x < 0 || x >= this.roomWidth || y < 0 || y >= this.roomHeight) {
      return false;
    }
    // Check for walls
    for (const wall of this.walls) {
      if (wall.x === x && wall.y === y) {
        return true;
      }
    }
    // Check for monsters
    for (const monster of this.monsters) {
      if (monster.x === x && monster.y === y) {
        return true;
      }
    }
    // Check for treasures
    for (const treasure of this.treasures) {
      if (treasure.x === x && treasure.y === y) {
        return true;
      }
    }
    return false;
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
        if (i === 0 || i === this.roomHeight - 1 || j === 0 || j === this.roomWidth - 1) {
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
      name: this.name,
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
