import { input } from '@inquirer/prompts';
import chalk from 'chalk';
import Table from 'cli-table3';
import {
  generateCharacter,
  getCharacter,
  getCharacters,
  getGame,
  getGames,
} from './requests.js';

let selectedCharacterId: string | null = null;
let selectedGameId: string | null = null;

const helpMenu = `
${chalk.bold('Help Menu')}

${chalk.greenBright('Character Commands:')}
- ${chalk.green('character-list')}: List all characters.
- ${chalk.green('character-select')}: Select a character.
- ${chalk.green('character-generate')}: Generate a new character.

${chalk.greenBright('Game Commands:')}
- ${chalk.green('game-list')}: List all games.
- ${chalk.green('game-join')}: Select a game.

${chalk.greenBright('General Commands:')}
- ${chalk.green('quit')}: Exit the application.
- ${chalk.green('help')}: Show this help menu.
`;

async function main() {
  console.log(chalk.blueBright('Welcome to Fortis Dungeon Master!'));
  console.log(chalk.white('For help, type "help" at any time.\n'));

  let running = true;
  while (running) {
    const answer = await input({
      message: '',
      theme: {
        prefix: chalk.green('>'),
      },
    });

    switch (answer.trim().toLowerCase()) {
      case 'quit':
        running = false;
        break;
      case 'help':
        console.log(helpMenu);
        break;
      case 'status': {
        if (selectedCharacterId) {
          const character = await getCharacter(selectedCharacterId);
          if (character) {
            console.log(chalk.blue(`Character Status: ${character.name}`));
            console.log(chalk.green(`Level: ${character.level}`));
          } else {
            console.log(
              chalk.red(`Character with ID ${selectedCharacterId} not found.`),
            );
          }
        } else {
          console.log(chalk.yellow('No character selected.'));
        }
        if (selectedGameId) {
          const game = await getGame(selectedGameId);
          if (game) {
            console.log(chalk.blue(`Game Status: ${game.name}`));
            console.log(chalk.green(`Players: ${game.players.length}`));
          } else {
            console.log(chalk.red(`Game with ID ${selectedGameId} not found.`));
          }
        } else {
          console.log(chalk.yellow('No game selected.'));
        }
        break;
      }
      case 'character-generate': {
        console.log(chalk.blue('Generating a new character...'));
        try {
          const character = await generateCharacter();
          selectedCharacterId = character.characterId;
          console.log(chalk.green(`Generated character: ${character.name}`));
        } catch (error) {
          console.log(chalk.red('Error generating character.'));
        }
        break;
      }
      case 'character-select': {
        const characterId = await input({
          message: 'Enter character ID:',
          theme: {
            prefix: chalk.green(' >'),
          },
        });

        if (!characterId) {
          console.log(chalk.red('Character ID cannot be empty.'));
          break;
        }

        try {
          const character = await getCharacter(characterId);
          selectedCharacterId = character.characterId;
          console.log(chalk.green(`Selected character: ${character.name}`));
        } catch (error) {
          console.log(`Character with ID ${characterId} not found.`);
        }
        break;
      }
      case 'game-list': {
        console.log(chalk.blue('Listing all games...'));

        const games = await getGames();
        if (games.length === 0) {
          console.log(chalk.yellow('No games found.'));
          break;
        }
        const table = new Table({
          head: [chalk.green('ID'), chalk.green('Players')],
        });
        for (const game of games) {
          table.push([game.gameId, game.characters.length]);
        }
        console.log(table.toString());

        break;
      }
      case 'character-list': {
        console.log(chalk.blue('Listing all characters...'));
        const characters = await getCharacters();
        if (characters.length === 0) {
          console.log(chalk.yellow('No characters found.'));
          break;
        }

        const table = new Table({
          head: [
            chalk.green('ID'),
            chalk.green('Name'),
            chalk.green('Class'),
            chalk.green('Level'),
          ],
        });

        for (const character of characters) {
          table.push([
            character.characterId,
            character.name,
            character.characterClass,
            character.level,
          ]);
        }

        console.log(table.toString());
        break;
      }
      default:
        console.log(chalk.red(`Unknown command: ${answer}`));
    }
  }

  console.log(chalk.green('Thank you for playing Fortis Dungeon Master!\n'));
}

main().catch((err) => {
  if (err instanceof Error && err.name === 'ExitPromptError') {
    console.log(chalk.red('\nExiting the application...\n'));
    process.exit(0);
  }
  console.error(err);
  process.exit(1);
});
