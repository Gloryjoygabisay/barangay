# Trail Through the Barangay

`rogame` is a small static web game built with Vite, TypeScript, and Phaser 3. It presents a mobile-friendly narrative exploration demo where a young traveler walks through a mountain village, discovers encounter hotspots, and makes choices that affect `trust`, `courage`, and `supplies`.

The app is designed for static hosting and currently deploys to GitHub Pages.

## What is in the game

- A bilingual start screen with English and Filipino language selection
- An About panel and visible app version in both the start and in-game UI
- A lazy-loaded Phaser scene so the game code is only loaded when the player starts
- A hand-drawn village map with three encounter hotspots: `bridge`, `market`, and `ridge`
- Dialogue choices that update journey stats and mark completed hotspots in the world
- Mobile-friendly touch controls plus keyboard arrow-key movement
- Optional New Relic browser telemetry when the required `VITE_NEW_RELIC_*` variables are set

## Quick start

```bash
npm install
npm run dev
```

Open the Vite dev server URL in your browser to play locally.

## Available scripts

- `npm run dev` starts the Vite development server
- `npm run build` runs TypeScript checks with `tsc` and creates a production build in `dist/`
- `npm run preview` serves the production build locally
- `npm test` runs the Vitest smoke suite
- `npm run test:watch` runs Vitest in watch mode

## Project structure

```text
public/
  assets/
    maps/village.json      Tilemap with spawn and hotspot points
    sprites/               Player and hotspot marker SVGs
    tiles/                 Village tileset artwork
src/
  data/
    encounters.ts          Encounter content, choices, and stat effects
    localization.ts        UI strings and translation helper
  game-loader.ts           Lazy loader for the Phaser game module
  game.ts                  Phaser scene, movement, encounters, and UI sync
  main.ts                  DOM wiring, start screen, about panel, and boot flow
  styles.css               Layout and mobile-first styling
  telemetry.ts             New Relic browser telemetry helpers
tests/
  app.smoke.test.ts        App shell and startup wiring smoke test
  build.smoke.test.ts      Production build smoke test
```

## How it works

`src/main.ts` owns the HTML shell outside Phaser. It sets language, shows the start screen, opens and closes the About panel, initializes telemetry, and loads the Phaser game only after the player starts the journey.

`src/game.ts` contains the Phaser scene. It loads the village tilemap and SVG assets, spawns the player at the `spawn` point from the map, renders hotspot markers, handles keyboard and touch movement, and opens encounter dialogue when the player reaches a hotspot.

Encounter content is data-driven in `src/data/encounters.ts`. Each encounter maps to a hotspot ID from `public/assets/maps/village.json` and provides localized copy, choices, result text, and stat effects.

## Localization

- Supported languages are `en` and `tl`
- Shared UI copy lives in `src/data/localization.ts`
- Encounter text lives in `src/data/encounters.ts`
- Translatable strings are stored as localized objects, for example `{ en: '...', tl: '...' }`
- Players can switch languages on the start screen and again after the game loads

## Adding or editing encounters

Each encounter needs:

- a unique encounter `id`
- a `hotspotId` that matches a hotspot object in `public/assets/maps/village.json`
- localized `location`, `title`, and `body` text
- one or more localized `choices`
- `effects` that modify `trust`, `courage`, or `supplies`

To add a new encounter:

1. Add a hotspot point to the `Points` object layer in `public/assets/maps/village.json`
2. Add a matching encounter entry in `src/data/encounters.ts`
3. If the hotspot needs custom marker art, register its texture in `HOTSPOT_TEXTURES` in `src/game.ts`

## Testing

The repo currently uses a small Vitest smoke suite instead of deep gameplay tests.

- `tests/app.smoke.test.ts` verifies the app shell, language switching, About panel, and game startup wiring
- `tests/build.smoke.test.ts` verifies that a production build succeeds and emits loadable assets

Before shipping changes, run:

```bash
npm test
npm run build
```

## GitHub Pages deployment

`vite.config.ts` uses `base: './'`, which keeps the generated asset URLs compatible with static hosting.

The GitHub Pages workflow lives at `.github/workflows/deploy.yml`. On pushes to `main`, it:

1. installs dependencies with `npm ci`
2. computes `VITE_APP_VERSION` from `package.json` plus the GitHub Actions run number
3. builds the app
4. uploads `dist/`
5. deploys the site with GitHub Pages

## New Relic browser telemetry

Telemetry is optional. If `VITE_NEW_RELIC_APPLICATION_ID` and `VITE_NEW_RELIC_LICENSE_KEY` are missing, the app runs with telemetry disabled.

Start from `.env.example`:

```bash
VITE_NEW_RELIC_APPLICATION_ID=
VITE_NEW_RELIC_LICENSE_KEY=
VITE_NEW_RELIC_AGENT_ID=
VITE_NEW_RELIC_ACCOUNT_ID=
VITE_NEW_RELIC_TRUST_KEY=
VITE_NEW_RELIC_BEACON=bam.nr-data.net
VITE_NEW_RELIC_ERROR_BEACON=bam.nr-data.net
```

Use the Browser app Copy/Paste JavaScript settings from New Relic to populate these values.
