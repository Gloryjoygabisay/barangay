import Phaser from 'phaser';
import { encounters, localizeText, type Encounter, type StatKey } from './data/encounters';
import { t, type Language } from './data/localization';

type GameStats = Record<StatKey, number>;

type Hotspot = {
  id: string;
  x: number;
  y: number;
  label: string;
  color: number;
};

const STARTING_STATS: GameStats = {
  trust: 1,
  courage: 1,
  supplies: 3
};

const HOTSPOTS: Hotspot[] = [
  { id: 'bridge', x: 136, y: 216, label: 'Bridge', color: 0xf4d35e },
  { id: 'market', x: 320, y: 168, label: 'Market', color: 0xee964b },
  { id: 'ridge', x: 488, y: 116, label: 'Ridge', color: 0xf95738 }
];

class VillageScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private language: Language = 'en';
  private stats: GameStats = { ...STARTING_STATS };
  private activeEncounterId: string | null = null;
  private completed = new Set<string>();
  private encounterCircles: Phaser.GameObjects.Arc[] = [];
  private encounterLabels: Phaser.GameObjects.Text[] = [];
  private thumbstickState = { left: false, right: false, up: false, down: false };
  private isDialogueOpen = false;

  constructor() {
    super('village');
  }

  create(): void {
    this.cursors = this.input.keyboard?.createCursorKeys() ?? ({} as Phaser.Types.Input.Keyboard.CursorKeys);
    this.drawWorld();
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

    this.player.x = Phaser.Math.Clamp(this.player.x + dx, 32, 608);
    this.player.y = Phaser.Math.Clamp(this.player.y + dy, 36, 324);

    this.checkEncounters();
  }

  setLanguage(language: Language): void {
    this.language = language;
    this.refreshStaticUi();
    this.refreshStatsUi();

    const active = this.getActiveEncounter();
    if (active) {
      this.showEncounter(active);
    }
  }

  private drawWorld(): void {
    this.add.rectangle(320, 180, 640, 360, 0x92c47c);
    this.add.rectangle(320, 280, 640, 140, 0x7a5c3c, 0.35);
    this.add.rectangle(130, 220, 150, 28, 0x5a4630, 0.9).setAngle(-8);
    this.add.rectangle(130, 248, 150, 24, 0x3f6d4f, 0.45).setAngle(-8);

    for (let row = 0; row < 4; row += 1) {
      this.add.rectangle(460, 60 + row * 36, 180, 20, 0x7bb661, 0.85);
      this.add.rectangle(460, 74 + row * 36, 180, 10, 0x5f8f46, 0.8);
    }

    this.add.circle(318, 170, 54, 0xd99f6c, 0.85);
    this.add.circle(352, 152, 30, 0xd99f6c, 0.8);
    this.add.rectangle(302, 170, 28, 22, 0x704c24);
    this.add.rectangle(336, 150, 24, 18, 0x704c24);
    this.add.rectangle(508, 98, 124, 20, 0xa7d38c, 0.95).setAngle(-9);

    const titleStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Georgia, serif',
      fontSize: '14px',
      color: '#17301d'
    };

    this.encounterCircles = HOTSPOTS.map((hotspot) =>
      this.add.circle(hotspot.x, hotspot.y, 18, hotspot.color, 0.92).setStrokeStyle(3, 0xfff5d6, 0.9)
    );
    this.encounterLabels = HOTSPOTS.map((hotspot) =>
      this.add.text(hotspot.x - 30, hotspot.y + 24, hotspot.label, titleStyle)
    );

    this.add.text(22, 18, 'Barangay Trail', {
      fontFamily: 'Georgia, serif',
      fontSize: '18px',
      color: '#fff6dc'
    });
  }

  private createPlayer(): void {
    const body = this.add.rectangle(0, 4, 22, 28, 0x223d7a, 1);
    const head = this.add.rectangle(0, -12, 14, 12, 0xf6d0ad, 1);
    this.player = this.add.container(72, 282, [body, head]);
  }

  private createTouchControls(): void {
    const controls = document.createElement('div');
    controls.className = 'touch-controls';
    controls.innerHTML = `
      <button data-direction="up" aria-label="Move up">▲</button>
      <div class="touch-row">
        <button data-direction="left" aria-label="Move left">◀</button>
        <button data-direction="down" aria-label="Move down">▼</button>
        <button data-direction="right" aria-label="Move right">▶</button>
      </div>
    `;

    const shell = document.getElementById('game-shell');
    shell?.appendChild(controls);

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

    const languageSelect = document.getElementById('language-select') as HTMLSelectElement | null;
    if (languageSelect) {
      languageSelect.value = this.language;
      languageSelect.addEventListener('change', () => {
        this.setLanguage(languageSelect.value as Language);
      });
    }
  }

  private checkEncounters(): void {
    const encounter = encounters.find((entry) => {
      if (this.completed.has(entry.id)) {
        return false;
      }

      const hotspot = HOTSPOTS.find((spot) => spot.id === entry.hotspotId);
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
    body.textContent = `${localizeText(encounter.body, this.language)} ${t('encounterPrompt', this.language)}`;

    choiceList.replaceChildren();
    encounter.choices.forEach((choice) => {
      const button = document.createElement('button');
      button.className = 'choice-button';
      button.textContent = localizeText(choice.text, this.language);
      button.addEventListener('click', () => {
        Object.entries(choice.effects).forEach(([key, value]) => {
          this.stats[key as StatKey] += value ?? 0;
        });
        this.completed.add(encounter.id);
        this.refreshStatsUi();
        body.textContent = `${t('resultPrefix', this.language)}: ${localizeText(choice.result, this.language)}`;
        choiceList.replaceChildren();
        this.markHotspotCompleted(encounter.hotspotId);
      });
      choiceList.appendChild(button);
    });

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
    const index = HOTSPOTS.findIndex((spot) => spot.id === hotspotId);
    if (index === -1) {
      return;
    }

    this.encounterCircles[index]?.setFillStyle(0x7a7a7a, 0.7);
    this.encounterLabels[index]?.setColor('#51604f');
    const closeButton = document.getElementById('close-dialogue');
    if (closeButton) {
      closeButton.textContent = t('completed', this.language);
    }
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

export function createGame(): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    parent: 'game-root',
    backgroundColor: '#254336',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [VillageScene]
  });
}
