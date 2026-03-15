# Trail Through the Barangay

Starter repo for a mobile-friendly narrative exploration game built with Phaser 3, TypeScript, and Vite. It is designed to deploy as a static site on GitHub Pages and includes a sample bilingual encounter system in English and Filipino (Tagalog).

## Features

- Top-down village exploration scene with simple generated art
- Data-driven encounters with branching responses
- English and Filipino localization toggle
- Stats that change based on encounter choices
- Mobile-friendly controls with an on-screen directional pad
- Static build output suitable for GitHub Pages

## Quick start

```bash
npm install
npm run dev
```

Build for deployment:

```bash
npm run build
```

## Project structure

```text
src/
  data/
    encounters.ts      # Encounter content and stat effects
    localization.ts    # UI strings and translation helper
  game.ts              # Phaser scene and DOM UI integration
  main.ts              # App entry
  styles.css           # Mobile-first styling
```

## How localization works

- UI strings live in [src/data/localization.ts](/Users/david.payne/c/rogame/src/data/localization.ts)
- Encounter content lives in [src/data/encounters.ts](/Users/david.payne/c/rogame/src/data/encounters.ts)
- Each translatable string is stored as `{ en: "...", tl: "..." }`
- Changing the language select updates the UI and any currently open encounter

## Extending the encounter system

Each encounter needs:

- `hotspotId` to connect it to a location in the map
- `location`, `title`, and `body` in both languages
- one or more `choices`
- `effects` to update `trust`, `courage`, or `supplies`

To add a new encounter:

1. Add a hotspot to `HOTSPOTS` in [src/game.ts](/Users/david.payne/c/rogame/src/game.ts)
2. Add an encounter with the same `hotspotId` in [src/data/encounters.ts](/Users/david.payne/c/rogame/src/data/encounters.ts)

## GitHub Pages deployment

This Vite config uses a relative `base` path, so it can be deployed to GitHub Pages project sites without changing asset URLs.

Typical deployment flow:

1. Push this repo to GitHub
2. Enable GitHub Pages with a GitHub Actions workflow or the `dist/` artifact
3. Run `npm run build`
4. Publish the generated `dist/` folder

If you want, the next step can be adding:

- sprite art and tilemaps
- a save system with local storage
- a larger quest graph with inventory and relationship flags
