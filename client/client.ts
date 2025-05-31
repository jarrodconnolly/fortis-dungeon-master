import { input } from '@inquirer/prompts';
import chalk from 'chalk';
import Table from 'cli-table3';
import {
  generateCharacter,
  getCharacter,
  getCharacters,
  getGame,
  getGames,
  joinGame,
} from './requests.js';

let selectedCharacterId: string | null = null;
let selectedGameId: string | null = null;

const helpMenu = `
${chalk.bold('Help Menu')}

${chalk.greenBright('General Commands:')}
- ${chalk.green('help')}: Show this help menu.
- ${chalk.green('status')}: Show the currently selected game and character.
- ${chalk.green('quit')}: Exit the application.

${chalk.greenBright('Character Commands:')}
- ${chalk.green('character list')}: List all characters.
- ${chalk.green('character select [character-id]')}: Select a character.
- ${chalk.green('character new')}: Generate a new character.

${chalk.greenBright('Game Commands:')}
- ${chalk.green('game list')}: List all games.
- ${chalk.green('game join [game-id]')}: Select a game.
- ${chalk.green('game new')}: Start a new game.

${chalk.greenBright('Dungeon Commands:')}
- ${chalk.green('map')}: Show the current dungeon map.
- ${chalk.green('w')}: Move the character north.
- ${chalk.green('s')}: Move the character south.
- ${chalk.green('a')}: Move the character west.
- ${chalk.green('d')}: Move the character east.
- ${chalk.green('i')}: Show the character's inventory.

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

    const pieces = answer.trim().toLowerCase().split(' ');
    const [command, ...args] = pieces;
    switch (command) {
      case 'quit':
        running = false;
        break;
      case 'help':
        console.log(helpMenu);
        break;
      case 'map': {
        if (!selectedGameId) {
          console.log(chalk.red('No game joined. Please join a game first.'));
          break;
        }
        const game = await getGame(selectedGameId);
        drawMap(game);
        break;
      }
      case 'status': {
        if (selectedCharacterId) {
          const character = await getCharacter(selectedCharacterId);
          if (character) {
            console.log(
              chalk.greenBright(`Character: ${character.name}`) +
                chalk.greenBright(` Level: ${character.level}`) +
                chalk.greenBright(` Class: ${character.characterClass}`),
            );
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
      case 'character': {
        const subCommand = args[0];
        if (!subCommand) {
          console.log(chalk.red('Please specify a character command.'));
          break;
        }
        switch (subCommand) {
          case 'new': {
            console.log(chalk.blue('Generating a new character...'));
            try {
              const character = await generateCharacter();
              selectedCharacterId = character.characterId;
              console.log(
                chalk.green(`Generated character: ${character.name}`),
              );
            } catch (error) {
              console.log(chalk.red('Error generating character.'));
            }
            break;
          }
          case 'list': {
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
          case 'select': {
            const characterId = args[1];
            if (!characterId) {
              console.log(chalk.red('Please provide a character ID.'));
              break;
            }
            try {
              const character = await getCharacter(characterId);
              selectedCharacterId = character.characterId;
              console.log(
                chalk.greenBright(`Selected character: ${character.name}`),
              );
            } catch (error) {
              console.log(`Character with ID ${characterId} not found.`);
            }
            break;
          }
        }
        break;
      }

      case 'game': {
        const subCommand = args[0];
        if (!subCommand) {
          console.log(chalk.red('Please specify a game command.'));
          break;
        }
        switch (subCommand) {
          case 'new': {
            break;
          }
          case 'join': {
            if (!selectedCharacterId) {
              console.log(chalk.red('Please select a character first.'));
              break;
            }
            const gameId = args[1];
            if (!gameId) {
              console.log(chalk.red('Please provide a game ID.'));
              break;
            }
            try {
              const game = await getGame(gameId);
              if (game) {
                selectedGameId = game.gameId;
                if (
                  !game.characters.some(
                    (c) => c.characterId === selectedCharacterId,
                  )
                ) {
                  await joinGame(gameId, selectedCharacterId);
                  console.log(chalk.green(`Joined game: ${game.name}`));
                } else {
                  console.log(chalk.green(`Joined game: ${game.name}`));
                }
              } else {
                console.log(chalk.red(`Game with ID ${gameId} not found.`));
              }
            } catch (error) {
              console.log(chalk.red('Error joining game.'));
            }
            break;
          }
          case 'list': {
            console.log(chalk.blue('Listing all games...'));
            const games = await getGames();
            if (games.length === 0) {
              console.log(chalk.yellow('No games found.'));
              break;
            }
            const table = new Table({
              head: [
                chalk.green('ID'),
                chalk.green('Name'),
                chalk.green('Players'),
              ],
            });
            for (const game of games) {
              let characters = '';
              for (const characterId of game.characters) {
                const character = await getCharacter(characterId.characterId);
                characters += `${character.name}, `;
              }
              table.push([game.gameId, game.name, characters.slice(0, -2)]);
            }
            console.log(table.toString());
            break;
          }
          default:
            console.log(chalk.red(`Unknown game command: ${subCommand}`));
            console.log(chalk.white('For help, type "help" at any time.\n'));
            break;
        }
        break;
      }
      default:
        console.log(chalk.red(`Unknown command: ${answer}`));
        console.log(chalk.white('For help, type "help" at any time.\n'));
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

function drawMap(game) {
  for (let y = 0; y < game.roomHeight; y++) {
    let row = '';
    for (let x = 0; x < game.roomWidth; x++) {
      if (game.walls.some((wall) => wall.x === x && wall.y === y)) {
        row += chalk.rgb(160, 82, 45)('▒'); // Wall
      } else if (game.characters.some((c) => c.x === x && c.y === y)) {
        row += chalk.greenBright('𐦂'); // Character
      } else if (game.treasures.some((t) => t.x === x && t.y === y)) {
        row += chalk.yellowBright('𐦒'); // Treasure
      } else if (game.monsters.some((m) => m.x === x && m.y === y)) {
        row += chalk.redBright('𐦃'); // Monster
      } else {
        row += ' '; // Empty space
      }
    }
    console.log(row);
  }
}
