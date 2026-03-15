import Phaser from 'phaser';
import { encounters, localizeText, type Encounter, type StatKey } from './data/encounters';
import { t, type Language } from './data/localization';

type GameStats = Record<StatKey, number>;

type Hotspot = {
  id: string;
  x: number;
  y: number;
  sprite: Phaser.GameObjects.Image;
  label: Phaser.GameObjects.Text;
};

const STARTING_STATS: GameStats = {
  trust: 1,
  courage: 1,
  supplies: 3
};

const MAP_WIDTH = 640;
const MAP_HEIGHT = 352;

const HOTSPOT_TEXTURES: Record<string, string> = {
  bridge: 'marker-bridge',
  market: 'marker-market',
  ridge: 'marker-ridge'
};

class VillageScene extends Phaser.Scene {
  private map!: Phaser.Tilemaps.Tilemap;
  private player!: Phaser.GameObjects.Container;
  private playerSprite!: Phaser.GameObjects.Image;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private language: Language = 'en';
  private stats: GameStats = { ...STARTING_STATS };
  private activeEncounterId: string | null = null;
  private completed = new Set<string>();
  private resolvedChoices = new Map<string, string>();
  private hotspots: Hotspot[] = [];
  private thumbstickState = { left: false, right: false, up: false, down: false };
  private isDialogueOpen = false;
  private spawnPoint = { x: 80, y: 304 };

  constructor() {
    super('village');
  }

  preload(): void {
    this.load.tilemapTiledJSON('village-map', 'assets/maps/village.json');
    this.load.image('village-tiles', 'assets/tiles/village-tileset.svg');
    this.load.image('player-down', 'assets/sprites/player-down.svg');
    this.load.image('player-up', 'assets/sprites/player-up.svg');
    this.load.image('player-side', 'assets/sprites/player-side.svg');
    this.load.image('marker-bridge', 'assets/sprites/marker-bridge.svg');
    this.load.image('marker-market', 'assets/sprites/marker-market.svg');
    this.load.image('marker-ridge', 'assets/sprites/marker-ridge.svg');
  }

  create(): void {
    this.cursors = this.input.keyboard?.createCursorKeys() ?? ({} as Phaser.Types.Input.Keyboard.CursorKeys);
    this.createMap();
    this.createHotspots();
    this.createPlayer();
    this.createTouchControls();
    this.hookUi();
    this.refreshStaticUi();
    this.refreshStatsUi();
  }

  update(): void {
    if (this.isDialogueOpen) {
      return;
    }

    const speed = 2.4;
    let dx = 0;
    let dy = 0;

    if (this.cursors.left?.isDown || this.thumbstickState.left) {
      dx -= speed;
    }
    if (this.cursors.right?.isDown || this.thumbstickState.right) {
      dx += speed;
    }
    if (this.cursors.up?.isDown || this.thumbstickState.up) {
      dy -= speed;
    }
    if (this.cursors.down?.isDown || this.thumbstickState.down) {
      dy += speed;
    }

    this.player.x = Phaser.Math.Clamp(this.player.x + dx, 24, MAP_WIDTH - 24);
    this.player.y = Phaser.Math.Clamp(this.player.y + dy, 28, MAP_HEIGHT - 12);

    this.updatePlayerSprite(dx, dy);

    this.checkEncounters();
  }

  setLanguage(language: Language): void {
    this.language = language;
    this.refreshStaticUi();
    this.refreshStatsUi();
    this.refreshHotspotLabels();

    const active = this.getActiveEncounter();
    if (active) {
      this.showEncounter(active);
    }
  }

  private createMap(): void {
    this.map = this.make.tilemap({ key: 'village-map' });
    const tileset = this.map.addTilesetImage('village-tileset', 'village-tiles', 32, 32, 0, 0);

    if (!tileset) {
      throw new Error('Tileset failed to load for village-map.');
    }

    this.map.createLayer('Ground', tileset, 0, 0)?.setDepth(0);
    this.map.createLayer('Decor', tileset, 0, 0)?.setDepth(1);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  }

  private createHotspots(): void {
    const pointLayer = this.map.getObjectLayer('Points');
    const pointObjects = pointLayer?.objects ?? [];

    const titleStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Georgia, serif',
      fontSize: '13px',
      color: '#18311d',
      align: 'center'
    };

    const spawn = pointObjects.find((object) => object.type === 'spawn');
    if (spawn?.x !== undefined && spawn?.y !== undefined) {
      this.spawnPoint = { x: spawn.x, y: spawn.y };
    }

    this.hotspots = encounters.flatMap((encounter) => {
      const point = pointObjects.find(
        (object) => object.type === 'hotspot' && object.name === encounter.hotspotId
      );
      if (point?.x === undefined || point.y === undefined) {
        return [];
      }

      const sprite = this.add
        .image(point.x, point.y - 20, HOTSPOT_TEXTURES[encounter.hotspotId] ?? 'marker-market')
        .setDisplaySize(36, 36)
        .setDepth(3);

      const label = this.add
        .text(point.x - 48, point.y + 8, localizeText(encounter.location, this.language), titleStyle)
        .setDepth(3)
        .setWordWrapWidth(96)
        .setAlign('center');

      return [
        {
          id: encounter.hotspotId,
          x: point.x,
          y: point.y,
          sprite,
          label
        }
      ];
    });
  }

  private createPlayer(): void {
    const shadow = this.add.ellipse(0, 13, 18, 8, 0x000000, 0.18);
    this.playerSprite = this.add.image(0, 0, 'player-down').setOrigin(0.5, 0.9);
    this.playerSprite.setDisplaySize(30, 38);
    this.player = this.add.container(this.spawnPoint.x, this.spawnPoint.y, [shadow, this.playerSprite]);
    this.player.setDepth(4);
  }

  private createTouchControls(): void {
    document.querySelector('.touch-controls')?.remove();
    const controls = document.createElement('div');
    controls.className = 'touch-controls';
    controls.innerHTML = `
      <button class="touch-button touch-up" data-direction="up" aria-label="Move up">▲</button>
      <button class="touch-button touch-left" data-direction="left" aria-label="Move left">◀</button>
      <button class="touch-button touch-right" data-direction="right" aria-label="Move right">▶</button>
      <button class="touch-button touch-down" data-direction="down" aria-label="Move down">▼</button>
    `;

    const gameRoot = document.getElementById('game-root');
    gameRoot?.appendChild(controls);

    controls.querySelectorAll('button').forEach((button) => {
      const direction = button.getAttribute('data-direction') as keyof typeof this.thumbstickState;
      const setState = (next: boolean) => {
        this.thumbstickState[direction] = next;
      };

      button.addEventListener('pointerdown', () => setState(true));
      button.addEventListener('pointerup', () => setState(false));
      button.addEventListener('pointerleave', () => setState(false));
      button.addEventListener('pointercancel', () => setState(false));
    });
  }

  private hookUi(): void {
    const closeButton = document.getElementById('close-dialogue');
    closeButton?.addEventListener('click', () => this.closeDialogue());
  }

  private checkEncounters(): void {
    const encounter = encounters.find((entry) => {
      if (this.completed.has(entry.id)) {
        return false;
      }

      const hotspot = this.hotspots.find((spot) => spot.id === entry.hotspotId);
      if (!hotspot) {
        return false;
      }

      return Phaser.Math.Distance.Between(this.player.x, this.player.y, hotspot.x, hotspot.y) < 28;
    });

    if (encounter && this.activeEncounterId !== encounter.id) {
      this.activeEncounterId = encounter.id;
      this.showEncounter(encounter);
    }
  }

  private showEncounter(encounter: Encounter): void {
    const panel = document.getElementById('dialogue-panel');
    const location = document.getElementById('dialogue-location');
    const title = document.getElementById('dialogue-title');
    const body = document.getElementById('dialogue-body');
    const choiceList = document.getElementById('choice-list');

    if (!panel || !location || !title || !body || !choiceList) {
      return;
    }

    this.isDialogueOpen = true;
    panel.classList.remove('hidden');
    location.textContent = localizeText(encounter.location, this.language);
    title.textContent = localizeText(encounter.title, this.language);

    choiceList.replaceChildren();
    const resolvedChoiceId = this.resolvedChoices.get(encounter.id);
    if (resolvedChoiceId) {
      const resolvedChoice = encounter.choices.find((choice) => choice.id === resolvedChoiceId);
      body.textContent = resolvedChoice
        ? `${t('resultPrefix', this.language)}: ${localizeText(resolvedChoice.result, this.language)}`
        : localizeText(encounter.body, this.language);
    } else {
      body.textContent = `${localizeText(encounter.body, this.language)} ${t('encounterPrompt', this.language)}`;
      encounter.choices.forEach((choice) => {
        const button = document.createElement('button');
        button.className = 'choice-button';
        button.textContent = localizeText(choice.text, this.language);
        button.addEventListener('click', () => {
          Object.entries(choice.effects).forEach(([key, value]) => {
            this.stats[key as StatKey] += value ?? 0;
          });
          this.completed.add(encounter.id);
          this.resolvedChoices.set(encounter.id, choice.id);
          this.refreshStatsUi();
          body.textContent = `${t('resultPrefix', this.language)}: ${localizeText(choice.result, this.language)}`;
          choiceList.replaceChildren();
          this.markHotspotCompleted(encounter.hotspotId);
        });
        choiceList.appendChild(button);
      });
    }

    const closeButton = document.getElementById('close-dialogue');
    if (closeButton) {
      closeButton.textContent = this.completed.has(encounter.id)
        ? t('completed', this.language)
        : t('close', this.language);
    }
  }

  private closeDialogue(): void {
    const panel = document.getElementById('dialogue-panel');
    if (!panel) {
      return;
    }

    panel.classList.add('hidden');
    this.isDialogueOpen = false;
    this.activeEncounterId = null;
    const closeButton = document.getElementById('close-dialogue');
    if (closeButton) {
      closeButton.textContent = t('close', this.language);
    }
  }

  private markHotspotCompleted(hotspotId: string): void {
    const hotspot = this.hotspots.find((spot) => spot.id === hotspotId);
    if (!hotspot) {
      return;
    }

    hotspot.sprite.setTint(0x7a7a7a).setAlpha(0.75);
    hotspot.label.setColor('#586155');
    const closeButton = document.getElementById('close-dialogue');
    if (closeButton) {
      closeButton.textContent = t('completed', this.language);
    }
  }

  private refreshHotspotLabels(): void {
    this.hotspots.forEach((hotspot) => {
      const encounter = encounters.find((entry) => entry.hotspotId === hotspot.id);
      if (!encounter) {
        return;
      }

      hotspot.label.setText(localizeText(encounter.location, this.language));
    });
  }

  private updatePlayerSprite(dx: number, dy: number): void {
    if (dx === 0 && dy === 0) {
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      this.playerSprite.setTexture('player-side');
      this.playerSprite.setFlipX(dx < 0);
      return;
    }

    this.playerSprite.setFlipX(false);
    this.playerSprite.setTexture(dy < 0 ? 'player-up' : 'player-down');
  }

  private refreshStaticUi(): void {
    this.setText('title-eyebrow', t('eyebrow', this.language));
    this.setText('title-text', t('title', this.language));
    this.setText('language-label', t('language', this.language));
    this.setText('stats-heading', t('stats', this.language));
    this.setText('trust-label', t('trust', this.language));
    this.setText('courage-label', t('courage', this.language));
    this.setText('supplies-label', t('supplies', this.language));
    this.setText('instructions-heading', t('instructionsHeading', this.language));
    this.setText('instructions-body', t('instructionsBody', this.language));
    this.setText('close-dialogue', t('close', this.language));
  }

  private refreshStatsUi(): void {
    this.setText('trust-value', String(this.stats.trust));
    this.setText('courage-value', String(this.stats.courage));
    this.setText('supplies-value', String(this.stats.supplies));
  }

  private setText(id: string, value: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  private getActiveEncounter(): Encounter | undefined {
    if (!this.activeEncounterId) {
      return undefined;
    }

    return encounters.find((encounter) => encounter.id === this.activeEncounterId);
  }
}

export type GameController = {
  setLanguage: (language: Language) => void;
};

export function createGame(initialLanguage: Language): GameController {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    parent: 'game-root',
    backgroundColor: '#254336',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [VillageScene]
  });

  let scene: VillageScene | null = null;
  let pendingLanguage = initialLanguage;

  game.events.once(Phaser.Core.Events.READY, () => {
    scene = game.scene.getScene('village') as VillageScene;
    scene.setLanguage(pendingLanguage);
    game.scale.refresh();
  });

  return {
    setLanguage(language: Language) {
      pendingLanguage = language;
      scene?.setLanguage(language);
    }
  };
}
