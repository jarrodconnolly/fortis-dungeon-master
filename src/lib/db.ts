import { join } from 'node:path';
import { JSONFilePreset } from 'lowdb/node';

export type Game = {
  gameId: string;
  characterId: string;
  monsters: Monster[];
  treasures: Treasure[];
};

export type CharacterDB = {
  characterId: string;
  name: string;
  x: number;
  y: number;
  level: number;
  hp: number;
  characterClass: string;
  Strength: number;
  Dexterity: number;
  Constitution: number;
  Intelligence: number;
  Wisdom: number;
  Charisma: number;
};

export type Treasure = {
  treasureId: string;
  name: string;
};
export type Monster = {
  monsterId: string;
  name: string;
};
export type DBSchema = {
  games: Game[];
  characters: CharacterDB[];
};

const defaultData: DBSchema = {
  games: [],
  characters: [],
};

const file = join(process.cwd(), 'db.json');
const db = await JSONFilePreset<DBSchema>(file, defaultData);

await db.read();
await db.write();

// Example CRUD helpers (expand as needed)
export async function getGames(): Promise<Game[]> {
  await db.read();
  return db.data?.games || [];
}

export async function getGameById(gameId: string): Promise<Game | null> {
  await db.read();
  return db.data?.games.find((game) => game.gameId === gameId) ?? null;
}

export async function saveGame(game: Game): Promise<void> {
  await db.read();
  db.data.games.push(game);
  await db.write();
}

export async function getCharacters(): Promise<CharacterDB[]> {
  await db.read();
  return db.data?.characters || [];
}

export async function getCharacterById(
  characterId: string,
): Promise<CharacterDB | null> {
  await db.read();
  return (
    db.data?.characters.find(
      (character) => character.characterId === characterId,
    ) ?? null
  );
}

export async function saveCharacter(character: CharacterDB): Promise<void> {
  await db.read();
  db.data.characters.push(character);
  await db.write();
}
