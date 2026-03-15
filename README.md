# Trail Through the Barangay

Starter repo for a mobile-friendly narrative exploration game built with Phaser 3, TypeScript, and Vite. It is designed to deploy as a static site on GitHub Pages and includes a sample bilingual encounter system in English and Filipino (Tagalog).

## Features

- Top-down village exploration scene rendered from a tilemap and authored SVG sprite assets
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
public/
  assets/
    maps/village.json  # Tilemap with spawn and hotspot points
    sprites/           # Player and encounter marker art
    tiles/             # Tile atlas used by the map
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

1. Add a hotspot point to [public/assets/maps/village.json](/Users/david.payne/c/rogame/public/assets/maps/village.json)
2. Add an encounter with the same `hotspotId` in [src/data/encounters.ts](/Users/david.payne/c/rogame/src/data/encounters.ts)

## Editing the world art

- The playable world is now rendered from [public/assets/maps/village.json](/Users/david.payne/c/rogame/public/assets/maps/village.json)
- The tiles come from [public/assets/tiles/village-tileset.svg](/Users/david.payne/c/rogame/public/assets/tiles/village-tileset.svg)
- The player and encounter icons are in [public/assets/sprites](/Users/david.payne/c/rogame/public/assets/sprites)
- The map includes a `spawn` point plus `hotspot` points named `bridge`, `market`, and `ridge`

## GitHub Pages deployment

This Vite config uses a relative `base` path, so it can be deployed to GitHub Pages project sites without changing asset URLs.

Typical deployment flow:

1. Push this repo to GitHub
2. Enable GitHub Pages with a GitHub Actions workflow or the `dist/` artifact
3. Run `npm run build`
4. Publish the generated `dist/` folder

If you want, the next step can be adding:

- a save system with local storage
- a larger quest graph with inventory and relationship flags
- collisions, NPC patrols, and multi-room maps
