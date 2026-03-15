# Repository Guidelines

## Project Structure & Module Organization
This repository is a small static web game built with Vite, TypeScript, and Phaser 3. Application code lives in `src/`. Use `src/main.ts` for app startup and DOM wiring, `src/game.ts` for Phaser scene logic, and `src/data/` for localized strings and encounter content. Static assets live in `public/assets/`, including `maps/`, `sprites/`, and `tiles/`. Production output is generated into `dist/`.

## Build, Test, and Development Commands
- `npm run dev`: starts the Vite dev server for local development.
- `npm run build`: runs TypeScript checks with `tsc` and creates a production build in `dist/`.
- `npm run preview`: serves the built app locally from `dist/` for a release sanity check.
- `npm test`: runs the Vitest smoke suite for app bootstrap and production build coverage.
- `npm run test:watch`: runs Vitest in watch mode while iterating locally.

## Coding Style & Naming Conventions
Follow the existing TypeScript style in `src/`: 2-space indentation, semicolons, single quotes, and ES module imports. Keep `strict` TypeScript compatibility; `tsconfig.json` enables `strict`, `noUnusedLocals`, and `noUnusedParameters`. Use:

- `camelCase` for variables, functions, and object properties
- `PascalCase` for types, scene classes, and interfaces
- descriptive asset IDs that match gameplay usage, such as `marker-bridge` or `player-down-idle`

Prefer small, focused modules and keep translatable text in `src/data/localization.ts` or encounter records rather than inline strings.

## Testing Guidelines
Vitest smoke tests live in `tests/`. They focus on regression protection for startup, page wiring, and build output rather than gameplay tuning. Verify changes by:

- running `npm test`
- running `npm run build`
- manually checking the main gameplay loop in `npm run dev`
- confirming localization, movement, encounters, and asset loading still work

If you add tests later, place them near the relevant source file or under a dedicated `src/__tests__/` directory and use `*.test.ts` naming.

## Commit & Pull Request Guidelines
Recent history favors short, imperative commit messages such as `improve the player sprite` and `add new relic`. Keep commits focused and descriptive. For pull requests, include:

- a brief summary of gameplay or UI changes
- linked issue or task reference when applicable
- screenshots or short recordings for visual changes
- confirmation that `npm run build` passed

## Deployment & Configuration Notes
`vite.config.ts` uses `base: './'`, which keeps the build compatible with static hosting such as GitHub Pages. Browser monitoring uses `@newrelic/browser-agent` and the `VITE_NEW_RELIC_*` values in [.env.example](/Users/david.payne/c/rogame/.env.example); populate them from the Browser app's Copy/Paste JavaScript settings in New Relic.
