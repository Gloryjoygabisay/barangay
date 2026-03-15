# Copilot Instructions

## Build and test commands

- `npm run dev` starts the Vite dev server for local gameplay checks.
- `npm run build` runs `tsc` and then creates the production build in `dist/`.
- `npm run preview` serves the built app locally from `dist/`.
- `npm test` runs the full Vitest smoke suite.
- `npm run test:watch` runs Vitest in watch mode.
- Run a single test file with `npx vitest run tests/app.smoke.test.ts` or `npx vitest run tests/build.smoke.test.ts`.
- Run a single test by name with `npx vitest run --grep "renders the start screen"` (or another test name substring).

## High-level architecture

The app has a split bootstrap flow across `index.html`, `src/main.ts`, `src/game-loader.ts`, and `src/game.ts`.

- `index.html` contains the full DOM shell for the start screen, About panel, in-game HUD, stats, and dialogue panel.
- `src/main.ts` owns all non-Phaser UI state: selected language, start/about interactions, version labels, and the transition from the start screen into gameplay.
- `src/game-loader.ts` exists only to lazy-load the Phaser module. `main.ts` deliberately imports the game through this loader so the Phaser bundle is not downloaded until the player starts the journey.
- `src/game.ts` owns the actual game runtime. It creates a single `VillageScene`, loads the tilemap and SVG assets, handles movement, tracks encounter progress, updates journey stats, and syncs localized text back into the DOM.

Game content is split across map data and TypeScript data, and those parts must stay aligned.

- `public/assets/maps/village.json` defines the `Points` object layer, including the `spawn` point and hotspot names.
- `src/data/encounters.ts` defines narrative encounters. Each encounter `hotspotId` must match a hotspot object name from the map.
- `src/game.ts` maps hotspot IDs to marker textures through `HOTSPOT_TEXTURES`. Adding a new hotspot can require updating the map, the encounter data, and this texture map together.

Localization is also split intentionally.

- `src/data/localization.ts` holds shared UI text such as labels, headings, and button copy.
- `src/data/encounters.ts` holds the narrative text for locations, titles, bodies, choices, and results.
- `src/main.ts` and `src/game.ts` both react to language changes. `main.ts` updates the outer DOM shell and forwards the current language to the game through `GameController.setLanguage`.

Deployment is wired for static hosting.

- `index.html` contains the New Relic browser snippet directly in the page `<head>`. Do not reintroduce a second app-managed browser agent unless the monitoring approach changes intentionally.
- `vite.config.ts` uses `base: './'` and manual chunking for Phaser, so keep asset references and routing compatible with static hosting.
- `.github/workflows/deploy.yml` computes `VITE_APP_VERSION` during GitHub Pages builds; `src/main.ts` shows that version in the UI and falls back to `package.json` locally.

## Key conventions

- Keep UI text out of scene logic unless it belongs to encounters. Shared interface copy belongs in `src/data/localization.ts`; encounter copy belongs in `src/data/encounters.ts`.
- Every translatable string is bilingual. When adding text, update both `en` and `tl`.
- `src/main.ts` owns DOM elements outside Phaser. `src/game.ts` should not become the source of truth for the start screen, About modal, or top-level language selectors.
- The game currently has one scene and no persistence. Encounter completion, resolved choices, and stats live in memory inside `VillageScene`; page reloads reset progress.
- The stats model is fixed to `trust`, `courage`, and `supplies`. Encounter effects are additive partial updates to those keys.
- Touch controls, keyboard movement, and responsive layout span multiple files. Changes in controls usually require coordinated updates in `index.html`, `src/game.ts`, and `src/styles.css`.
- The tests are smoke tests tied to the current bootstrap structure. `tests/app.smoke.test.ts` reads `index.html`, removes the module script tag, imports `src/main.ts`, and asserts against specific DOM IDs and text. If you rename IDs or move startup behavior, update the test with the markup.
- `tests/build.smoke.test.ts` validates that the Vite build emits a usable entrypoint. Build changes should preserve the current static output model.
- TypeScript is strict and `noUnusedLocals`/`noUnusedParameters` are enabled. Keep new code type-safe and remove unused symbols rather than leaving placeholders.
- Asset and map IDs follow gameplay-facing names such as `marker-bridge`, `player-down-idle`, `bridge`, `market`, and `ridge`. Reuse those naming patterns when adding new content.
