import './styles.css';
import { createGame, type GameController } from './game';
import { t, type Language } from './data/localization';

let language: Language = 'en';
let gameController: GameController | null = null;

const startScreen = document.getElementById('start-screen');
const gameShell = document.getElementById('game-shell');
const startButton = document.getElementById('start-button') as HTMLButtonElement | null;
const startLanguageSelect = document.getElementById('start-language-select') as HTMLSelectElement | null;
const gameLanguageSelect = document.getElementById('language-select') as HTMLSelectElement | null;

function setText(id: string, value: string): void {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function applyLanguage(nextLanguage: Language): void {
  language = nextLanguage;

  setText('start-eyebrow', t('startEyebrow', language));
  setText('start-title', t('startTitle', language));
  setText('start-blurb', t('startBlurb', language));
  setText('start-features-heading', t('startFeaturesHeading', language));
  setText('start-feature-village', t('startFeatureVillage', language));
  setText('start-feature-choices', t('startFeatureChoices', language));
  setText('start-feature-language', t('startFeatureLanguage', language));
  setText('start-language-label', t('language', language));
  setText('start-button', t('startButton', language));
  setText('start-hint', t('startHint', language));

  if (startLanguageSelect) {
    startLanguageSelect.value = language;
  }
  if (gameLanguageSelect) {
    gameLanguageSelect.value = language;
  }

  gameController?.setLanguage(language);
}

function startJourney(): void {
  if (!gameController) {
    gameController = createGame(language);
  }

  startScreen?.classList.add('hidden');
  gameShell?.classList.remove('hidden');
  gameController.setLanguage(language);
}

startLanguageSelect?.addEventListener('change', () => {
  applyLanguage(startLanguageSelect.value as Language);
});

gameLanguageSelect?.addEventListener('change', () => {
  applyLanguage(gameLanguageSelect.value as Language);
});

startButton?.addEventListener('click', () => {
  startJourney();
});

applyLanguage(language);
