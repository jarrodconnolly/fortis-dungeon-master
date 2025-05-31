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

async function getGames() {
  const response = await fetch(`${API_BASE_URL}/games`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

async function getGame(gameId: string) {
  const response = await fetch(`${API_BASE_URL}/games?gameId=${gameId}`);
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

export {
  ping,
  getCharacters,
  getCharacter,
  generateCharacter,
  getGames,
  getGame,
};
