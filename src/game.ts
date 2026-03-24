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
const ENCOUNTER_TRIGGER_RADIUS = 28;
const ENCOUNTER_RESET_RADIUS = 40;
const BRIDGE_APPROACH_RADIUS = 60;
const BRIDGE_CHALLENGE_STEPS = 8;
const QUESTION_TRANSITION_DELAY_MS = 1200;
const GAME_OVER_DELAY_MS = 1500;
const POINTS_PER_LEVEL = 10;

type Facing = 'down' | 'up' | 'side';

class VillageScene extends Phaser.Scene {
  private map!: Phaser.Tilemaps.Tilemap;
  private player!: Phaser.GameObjects.Container;
  private playerSprite!: Phaser.GameObjects.Image;
  private playerShadow!: Phaser.GameObjects.Ellipse;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private language: Language = 'en';
  private stats: GameStats = { ...STARTING_STATS };
  private score = 0;
  private activeEncounterId: string | null = null;
  private dismissedEncounterId: string | null = null;
  private completed = new Set<string>();
  private questionProgressMap = new Map<string, number>();
  private hotspots: Hotspot[] = [];
  private thumbstickState = { left: false, right: false, up: false, down: false };
  private isDialogueOpen = false;
  private spawnPoint = { x: 80, y: 304 };
  private facing: Facing = 'down';
  private walkFrame = 0;
  private stepCount = 0;

  constructor() {
    super('village');
  }

  preload(): void {
    this.load.tilemapTiledJSON('village-map', 'assets/maps/village.json');
    this.load.image('village-tiles', 'assets/tiles/village-tileset.svg');
    this.load.image('player-down-idle', 'assets/sprites/player-down-idle.svg');
    this.load.image('player-down-step', 'assets/sprites/player-down-step.svg');
    this.load.image('player-up-idle', 'assets/sprites/player-up-idle.svg');
    this.load.image('player-up-step', 'assets/sprites/player-up-step.svg');
    this.load.image('player-side-idle', 'assets/sprites/player-side-idle.svg');
    this.load.image('player-side-step', 'assets/sprites/player-side-step.svg');
    this.load.image('marker-bridge', 'assets/sprites/marker-bridge.svg');
    this.load.image('marker-market', 'assets/sprites/marker-market.svg');
    this.load.image('marker-ridge', 'assets/sprites/marker-ridge.svg');
  }

  create(): void {
    this.cursors = this.input.keyboard?.createCursorKeys() ?? ({} as Phaser.Types.Input.Keyboard.CursorKeys);
    this.createMap();
    this.createHotspots();
    this.createPlayer();
    this.applyViewportMode();
    this.createTouchControls();
    this.hookUi();
    this.refreshStaticUi();
    this.refreshStatsUi();
    this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    });
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

    const prevWalkFrame = this.walkFrame;
    this.updatePlayerSprite(dx, dy);

    // Count each walk-animation step (frame 0→1 transition while moving)
    if (this.walkFrame === 1 && prevWalkFrame !== 1 && (dx !== 0 || dy !== 0)) {
      this.stepCount++;
    }

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
    this.playerShadow = this.add.ellipse(0, 13, 18, 8, 0x000000, 0.18);
    this.playerSprite = this.add.image(0, 0, 'player-down-idle').setOrigin(0.5, 0.9);
    this.playerSprite.setDisplaySize(30, 38);
    this.player = this.add.container(this.spawnPoint.x, this.spawnPoint.y, [this.playerShadow, this.playerSprite]);
    this.player.setDepth(4);
  }

  private createTouchControls(): void {
    document.querySelector('.touch-controls')?.remove();
    const controls = document.createElement('div');
    controls.className = 'touch-controls';
    controls.innerHTML = `
      <button class="touch-button touch-up" data-direction="up" aria-label="Move up">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 4 L20 15 L15 15 L15 20 L9 20 L9 15 L4 15 Z"/>
        </svg>
      </button>
      <button class="touch-button touch-left" data-direction="left" aria-label="Move left">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4 12 L15 4 L15 9 L20 9 L20 15 L15 15 L15 20 Z"/>
        </svg>
      </button>
      <button class="touch-button touch-right" data-direction="right" aria-label="Move right">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20 12 L9 20 L9 15 L4 15 L4 9 L9 9 L9 4 Z"/>
        </svg>
      </button>
      <button class="touch-button touch-down" data-direction="down" aria-label="Move down">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 20 L4 9 L9 9 L9 4 L15 4 L15 9 L20 9 Z"/>
        </svg>
      </button>
    `;

    const gameRoot = document.getElementById('game-root');
    gameRoot?.appendChild(controls);

    controls.querySelectorAll('button').forEach((button) => {
      const direction = button.getAttribute('data-direction') as keyof typeof this.thumbstickState;
      const setState = (next: boolean) => {
        this.thumbstickState[direction] = next;
      };

      button.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        setState(true);
      });
      button.addEventListener('pointerup', () => setState(false));
      button.addEventListener('pointerleave', () => setState(false));
      button.addEventListener('pointercancel', () => setState(false));
    });
  }

  private hookUi(): void {
    const closeButton = document.getElementById('close-dialogue');
    closeButton?.addEventListener('click', () => this.closeDialogue());

    const playAgainButton = document.getElementById('play-again-button');
    playAgainButton?.addEventListener('click', () => {
      window.location.reload();
    });
  }

  private handleResize(): void {
    this.applyViewportMode();
  }

  private applyViewportMode(): void {
    const camera = this.cameras.main;
    const isMobile = this.scale.width <= 900;

    this.playerSprite.setDisplaySize(isMobile ? 38 : 30, isMobile ? 48 : 38);
    this.playerShadow.setSize(isMobile ? 24 : 18, isMobile ? 10 : 8);

    this.hotspots.forEach((hotspot) => {
      hotspot.sprite.setDisplaySize(isMobile ? 52 : 36, isMobile ? 52 : 36);
      hotspot.sprite.setPosition(hotspot.x, hotspot.y - (isMobile ? 28 : 20));
      hotspot.label
        .setFontSize(isMobile ? '16px' : '13px')
        .setWordWrapWidth(isMobile ? 128 : 96)
        .setPosition(hotspot.x - (isMobile ? 64 : 48), hotspot.y + (isMobile ? 12 : 8));
    });

    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    if (isMobile) {
      camera.setZoom(1.85);
      camera.setDeadzone(110, 72);
      camera.startFollow(this.player, true, 0.12, 0.12);
      return;
    }

    camera.stopFollow();
    camera.setZoom(1);
    camera.centerOn(MAP_WIDTH / 2, MAP_HEIGHT / 2);
  }

  private checkEncounters(): void {
    if (this.dismissedEncounterId) {
      const dismissedEncounter = encounters.find((entry) => entry.id === this.dismissedEncounterId);
      const dismissedHotspot = dismissedEncounter
        ? this.hotspots.find((spot) => spot.id === dismissedEncounter.hotspotId)
        : undefined;

      if (
        !dismissedHotspot ||
        Phaser.Math.Distance.Between(this.player.x, this.player.y, dismissedHotspot.x, dismissedHotspot.y) >=
          ENCOUNTER_RESET_RADIUS
      ) {
        this.dismissedEncounterId = null;
      }
    }

    const encounter = encounters.find((entry) => {
      if (this.completed.has(entry.id)) {
        return false;
      }

      if (this.dismissedEncounterId === entry.id) {
        return false;
      }

      const hotspot = this.hotspots.find((spot) => spot.id === entry.hotspotId);
      if (!hotspot) {
        return false;
      }

      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, hotspot.x, hotspot.y);

      // Bridge: step-based trigger — player must walk a few steps and be within
      // the approach zone before the challenge appears.
      if (entry.hotspotId === 'bridge') {
        return dist < BRIDGE_APPROACH_RADIUS && this.stepCount >= BRIDGE_CHALLENGE_STEPS;
      }

      return dist < ENCOUNTER_TRIGGER_RADIUS;
    });

    if (encounter && this.activeEncounterId !== encounter.id) {
      this.activeEncounterId = encounter.id;
      if (encounter.hotspotId === 'bridge') {
        // Briefly show a warning before the challenge dialogue opens
        this.isDialogueOpen = true;
        this.showBridgeWarning(() => {
          this.isDialogueOpen = false;
          this.showEncounter(encounter);
        });
      } else {
        this.showEncounter(encounter);
      }
    }
  }

  private showEncounter(encounter: Encounter): void {
    const panel = document.getElementById('dialogue-panel');
    const locationEl = document.getElementById('dialogue-location');
    const progressEl = document.getElementById('question-progress');
    const title = document.getElementById('dialogue-title');
    const body = document.getElementById('dialogue-body');
    const choiceList = document.getElementById('choice-list');
    const closeButton = document.getElementById('close-dialogue');

    if (!panel || !locationEl || !title || !body || !choiceList || !closeButton) {
      return;
    }

    this.isDialogueOpen = true;
    panel.classList.remove('hidden');
    locationEl.textContent = localizeText(encounter.location, this.language);

    if (this.completed.has(encounter.id)) {
      if (progressEl) progressEl.textContent = '';
      title.textContent = t('checkpointCleared', this.language);
      body.textContent = t('checkpointBody', this.language);
      choiceList.replaceChildren();
      closeButton.textContent = t('completed', this.language);
      closeButton.classList.remove('hidden');
      return;
    }

    const questionIdx = this.questionProgressMap.get(encounter.id) ?? 0;
    const question = encounter.questions[questionIdx];
    const total = encounter.questions.length;

    if (progressEl) {
      progressEl.textContent = `${t('questionLabel', this.language)} ${questionIdx + 1} ${t('ofLabel', this.language)} ${total}`;
    }

    title.textContent = localizeText(question.title, this.language);
    body.textContent = localizeText(question.body, this.language);

    closeButton.classList.add('hidden');
    choiceList.replaceChildren();

    question.choices.forEach((choice) => {
      const button = document.createElement('button');
      button.className = 'choice-button';
      button.textContent = localizeText(choice.text, this.language);
      button.addEventListener('click', () => {
        choiceList.replaceChildren();

        if (choice.isCorrect) {
          Object.entries(choice.effects).forEach(([key, value]) => {
            this.stats[key as StatKey] += value ?? 0;
          });
          this.score += encounter.level * POINTS_PER_LEVEL;
          this.refreshStatsUi();

          const nextIdx = questionIdx + 1;
          if (nextIdx >= total) {
            this.completed.add(encounter.id);
            this.questionProgressMap.delete(encounter.id);
            this.markHotspotCompleted(encounter.hotspotId);
            if (progressEl) progressEl.textContent = '';
            title.textContent = t('checkpointCleared', this.language);
            body.textContent = t('checkpointBody', this.language);
            closeButton.textContent = t('completed', this.language);
            closeButton.classList.remove('hidden');
          } else {
            this.questionProgressMap.set(encounter.id, nextIdx);
            body.textContent = localizeText(choice.result, this.language);
            this.time.delayedCall(QUESTION_TRANSITION_DELAY_MS, () => {
              if (this.isDialogueOpen) {
                this.showEncounter(encounter);
              }
            });
          }
        } else {
          body.textContent = localizeText(choice.result, this.language);
          this.time.delayedCall(GAME_OVER_DELAY_MS, () => {
            panel.classList.add('hidden');
            this.isDialogueOpen = false;
            this.showGameOver();
          });
        }
      });
      choiceList.appendChild(button);
    });
  }

  private showBridgeWarning(onComplete: () => void): void {
    const cam = this.cameras.main;
    const warningText = this.add
      .text(cam.width / 2, cam.height / 3, t('bridgeChallenge', this.language), {
        fontFamily: 'Georgia, serif',
        fontSize: '22px',
        color: '#ffdd00',
        stroke: '#2c1810',
        strokeThickness: 4,
        align: 'center'
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(10);

    this.tweens.add({
      targets: warningText,
      alpha: 0,
      duration: 500,
      ease: 'Power1',
      delay: 700,
      onComplete: () => {
        warningText.destroy();
        onComplete();
      }
    });
  }

  private showGameOver(): void {
    const gameOverPanel = document.getElementById('game-over-panel');
    if (!gameOverPanel) {
      return;
    }
    this.isDialogueOpen = true;
    this.refreshGameOverUi();
    gameOverPanel.classList.remove('hidden');
  }

  private closeDialogue(): void {
    const panel = document.getElementById('dialogue-panel');
    if (!panel) {
      return;
    }

    this.dismissedEncounterId = this.activeEncounterId;
    panel.classList.add('hidden');
    this.isDialogueOpen = false;
    this.activeEncounterId = null;
    const closeButton = document.getElementById('close-dialogue');
    if (closeButton) {
      closeButton.textContent = t('close', this.language);
      closeButton.classList.remove('hidden');
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
    const moving = dx !== 0 || dy !== 0;

    if (!moving) {
      this.walkFrame = 0;
      this.playerSprite.setTexture(`player-${this.facing}-idle`);
      this.playerSprite.y = 0;
      this.playerShadow.scaleX = 1;
      if (this.facing !== 'side') {
        this.playerSprite.setFlipX(false);
      }
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      this.facing = 'side';
      this.playerSprite.setFlipX(dx < 0);
    } else {
      this.facing = dy < 0 ? 'up' : 'down';
      this.playerSprite.setFlipX(false);
    }

    this.walkFrame = Math.floor(this.time.now / 180) % 2;
    const pose = this.walkFrame === 0 ? 'idle' : 'step';
    this.playerSprite.setTexture(`player-${this.facing}-${pose}`);

    if (pose === 'step') {
      this.playerSprite.y = 1.5;
      this.playerShadow.scaleX = 0.92;
    } else {
      this.playerSprite.y = 0;
      this.playerShadow.scaleX = 1;
    }
  }

  private refreshStaticUi(): void {
    this.setText('title-eyebrow', t('eyebrow', this.language));
    this.setText('title-text', t('title', this.language));
    this.setText('language-label', t('language', this.language));
    this.setText('stats-heading', t('stats', this.language));
    this.setText('score-label', t('score', this.language));
    this.setText('trust-label', t('trust', this.language));
    this.setText('courage-label', t('courage', this.language));
    this.setText('supplies-label', t('supplies', this.language));
    this.setText('instructions-heading', t('instructionsHeading', this.language));
    this.setText('instructions-body', t('instructionsBody', this.language));
    this.setText('close-dialogue', t('close', this.language));
    this.refreshGameOverUi();
  }

  private refreshStatsUi(): void {
    this.setText('trust-value', String(this.stats.trust));
    this.setText('courage-value', String(this.stats.courage));
    this.setText('supplies-value', String(this.stats.supplies));
    this.setText('score-value', String(this.score));
  }

  private refreshGameOverUi(): void {
    this.setText('game-over-kicker', t('gameOver', this.language));
    this.setText('game-over-title', t('gameOverTitle', this.language));
    this.setText('game-over-body', t('gameOverBody', this.language));
    this.setText('game-over-score', `${t('finalScore', this.language)}: ${this.score}`);
    this.setText('play-again-button', t('playAgain', this.language));
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
