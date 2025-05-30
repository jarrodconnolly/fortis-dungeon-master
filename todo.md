# Requirments and TODOs

## TODOs

* Complete basic functionality
* ~~Unit testing~~
* Fastify input validation
* API documentation
* Authentication / Authorization
  * API Key?
* Rate limiting
* ~~In-Memory singleton data stores replaced with database~~
* Game join codes
* Cleaner map generation, things clobber each other
* Observability. Metrics, ~~logging~~, tracing
* Ensure TLS, compression, etc.
* Move room size to game instance
* Build a basic CLI to play the game
* Game knows which players are in it, player does not know what games it is in
  * Add reference or players can join multiple games


## Fortis Dungeon Master Functional Requirements

### Game Management

* Create Game Instance: Implement `POST /games` endpoint to create a new game session, accepting a player's preferred character as input, initializing the game state with randomly placed monsters and treasures at different locations, and returning a unique game ID for the created session.
* Retrieve Game State: Implement `GET /games/{gameId}` endpoint to fetch the current state of a specific game, returning details such as the character’s position, nearby monsters, available treasures, and other relevant game state data.
* Update Game State: Implement `PUT /games/{gameId}` endpoint to update the game state, supporting actions like moving the player's character to a new location, initiating combat with a monster, and collecting or interacting with treasures to update the player's inventory, with validation to ensure updates align with game rules (e.g., valid moves, combat outcomes).

### Character Management

* Create Character: Implement `POST /characters` endpoint to create a new character, accepting initial stats (e.g., health, strength) and abilities (e.g., attack types, special skills), and returning a unique character ID along with the character’s details.
* Retrieve Character Details: Implement `GET /characters/{characterId}` endpoint to fetch details of a specific character, returning the character’s stats, abilities, and current inventory contents.

### Monster Management

* Retrieve Monster List: Implement `GET /monsters` endpoint to retrieve a list of all available monsters, including each monster’s stats (e.g., health, attack power) and behaviors (e.g., aggressive, defensive).
* Update Monster Status: Implement `PUT /monsters/{monsterId}` endpoint for admin use, allowing updates to a monster’s status (e.g., active/inactive) and health (e.g., after combat), with access restricted to authorized admin users.

### Treasure Management

* Retrieve Treasure List: Implement `GET /treasures` endpoint to retrieve a list of available treasures, including each treasure’s value (e.g., gold amount) and properties (e.g., health boost, weapon).
* Update Treasure Status: Implement `POST /treasures/{treasureId}` endpoint for admin use, allowing updates to a treasure’s status (e.g., collected, available) or properties, with access restricted to authorized admin users.

### Combat and Inventory

* Combat Resolution: Support combat interactions between a player’s character and a monster via the `PUT /games/{gameId}` endpoint, implementing logic to resolve combat based on character and monster stats (e.g., health, attack power), updating character and monster health post-combat, and reflecting outcomes in the game state.
* Inventory Management: Allow players to check their character’s inventory via the `GET /characters/{characterId}` endpoint and support adding treasures to the inventory via the `PUT /games/{gameId}` endpoint when a player collects a treasure, tracking inventory items and their effects (e.g., boosts to stats or abilities).

### Admin Functionality

* Manage Monsters, Characters, and Treasures: Enable admin users to create and manage monsters, characters, and treasures via the respective endpoints (`POST /characters`, `PUT /monsters/{monsterId}`, `POST /treasures/{treasureId}`), ensuring these actions are restricted to authorized admin users through an implied authentication/authorization mechanism.

### General Requirements

* RESTful API Design: Follow REST principles for endpoint design, using appropriate HTTP methods, status codes, and resource-based URLs, ensuring endpoints are stateless and handle requests idempotently where applicable (e.g., `PUT` for updates).
* Game State Tracking: Persist and track the game state for each game session, including character position, monster status, treasure locations, and inventory, ensuring updates to the game state are consistent and accurately reflect player actions.
* Randomization: Randomly place monsters and treasures in the game world when a new game session is created via `POST /games`, ensuring randomization is fair and varied to enhance gameplay.
* Error Handling: Return appropriate HTTP status codes and error messages for invalid requests (e.g., non-existent game ID, unauthorized access), validating inputs to prevent invalid game states or actions.

### Submission Requirements

* Node.js Project: Develop the API using Node.js and TypeScript, implementing all specified endpoints (`POST /games`, `GET /games/{gameId}`, `PUT /games/{gameId}`, `POST /characters`, `GET /characters/{characterId}`, `GET /monsters`, `PUT /monsters/{monsterId}`, `GET /treasures`, `POST /treasures/{treasureId}`).
* README Documentation: Include a README file explaining design decisions (e.g., architecture, data models, technology choices), API implementation details (e.g., how to run the project, endpoint usage), notable features (e.g., combat mechanics, randomization logic), and challenges faced during development with their solutions.
