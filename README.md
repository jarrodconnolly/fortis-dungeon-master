# Fortis Dungeon Master

[![CI](https://github.com/jarrodconnolly/fortis-dungeon-master/actions/workflows/ci.yml/badge.svg)](https://github.com/jarrodconnolly/fortis-dungeon-master/actions/workflows/ci.yml)
![Static Badge](https://img.shields.io/badge/Typescript-white?style=flat&logo=typescript)
![Static Badge](https://img.shields.io/badge/Node.js-white?style=flat&logo=node.js)

## Overview

Fortis Dungeon Master is a Typescript API which implements a dungeon style game server. It allows players to create and manage characters, explore dungeons, and engage in combat with monsters.

## Features

- Character creation and management
- Dungeon exploration
- Combat with monsters
- Persistent data storage using [Lowdb](https://github.com/typicode/lowdb)
- Basic game mechanics and rules
- Simple RESTful API for interaction
- Basic error handling and validation
- Basic unit tests for core functionality
- Basic logging for debugging and monitoring

## Design

The project uses a modular structure that keeps core game logic, data models, and API routes organized for easy maintenance and understanding.

The backend is built with Fastify and TypeScript and provides a RESTful API for interacting with the game.

Data is stored and persisted with Lowdb, and TypeScript interfaces are used throughout to keep the code type safe.

Each main feature, like character management, dungeon exploration, and combat, lives in its own module so the codebase is simple to extend and test.

## Technology Stack

- **Node.js**: JavaScript runtime for building the API.
- **TypeScript**: Superset of JavaScript for type safety.
- **Fastify**: Web framework for building the API.
- **Lowdb**: Lightweight database for persistent storage.
- **Unit Testing**: Using built-in Node.js testing.

## Data Models

The data models are defined using TypeScript interfaces, ensuring type safety and clarity. The main models include:

### Game

Represents a game session, including the player character, monsters, and treasures.

### Character

Represents a player character, including stats, inventory, and abilities.

### Monster

Represents monsters in the game, including stats and behaviors.

### Treasure

Represents treasures in the game, including properties and effects.

## Usage

To start playing Fortis Dungeon Master, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/jarrodconnolly/fortis-dungeon-master.git
cd fortis-dungeon-master
```

1. Install dependencies:

```bash
npm install
```

1. Run the tests:

```bash
npm test
```

1. Start the server:

```bash
npm start
```

1. Interact with the API using your favorite API client (Postman) or with the included CLI.

## Known Issues

The game is still in early development, and some features are not yet implemented.

## Changelog

- **v1.0.0** - Initial release with basic functionality
