import type { GameDB } from '../src/lib/db.js';

const API_BASE_URL = 'http://127.0.0.1:3000/api';

async function getCharacters() {
  const response = await fetch(`${API_BASE_URL}/characters`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

async function getCharacter(characterId: string) {
  const response = await fetch(`${API_BASE_URL}/characters/${characterId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

async function generateCharacter() {
  const response = await fetch(`${API_BASE_URL}/characters`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

async function getGames(): Promise<GameDB[]> {
  const response = await fetch(`${API_BASE_URL}/games`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

async function newGame(characterId: string) {
  const response = await fetch(`${API_BASE_URL}/games?characterId=${characterId}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

async function getGame(gameId: string) {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

async function joinGame(gameId: string, characterId: string) {
  const response = await fetch(`${API_BASE_URL}/games/join?gameId=${gameId}&characterId=${characterId}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

async function ping(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/ping`);
    if (!response.ok) {
      return false;
    }
  } catch (error) {
    return false;
  }
  return true;
}

async function moveCharacter(gameId: string, characterId: string, direction: 'up' | 'down' | 'left' | 'right') {
  const response = await fetch(
    `${API_BASE_URL}/games/${gameId}/move?characterId=${characterId}&direction=${direction}`,
    {
      method: 'POST',
    },
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export { ping, getCharacters, getCharacter, generateCharacter, getGames, getGame, joinGame, newGame, moveCharacter };
