import './styles.css';
import type { GameController } from './game';
import { loadGameModule } from './game-loader';
import { t, type Language } from './data/localization';
import packageJson from '../package.json';
import { initTelemetry, logInfo } from './telemetry';

let language: Language = 'en';
let gameController: GameController | null = null;
let gameModulePromise: Promise<typeof import('./game')> | null = null;
let isStarting = false;
const appVersion = import.meta.env.VITE_APP_VERSION || packageJson.version;
initTelemetry(appVersion);

const startScreen = document.getElementById('start-screen');
const gameShell = document.getElementById('game-shell');
const aboutPanel = document.getElementById('about-panel');
const startButton = document.getElementById('start-button') as HTMLButtonElement | null;
const startAboutButton = document.getElementById('start-about-button') as HTMLButtonElement | null;
const aboutButton = document.getElementById('about-button') as HTMLButtonElement | null;
const closeAboutButton = document.getElementById('close-about') as HTMLButtonElement | null;
const startLanguageSelect = document.getElementById('start-language-select') as HTMLSelectElement | null;
const gameLanguageSelect = document.getElementById('language-select') as HTMLSelectElement | null;
const startLoading = document.getElementById('start-loading');

function setText(id: string, value: string): void {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function setVersionText(id: string): void {
  setText(id, appVersion);
}

function openAbout(): void {
  aboutPanel?.classList.remove('hidden');
  logInfo('About opened', {
    eventName: 'about_opened'
  });
}

function closeAbout(): void {
  aboutPanel?.classList.add('hidden');
}

function setStartLoadingState(loading: boolean, error = false): void {
  isStarting = loading;
  if (startButton) {
    startButton.disabled = loading;
    startButton.textContent = loading ? t('startLoading', language) : t('startButton', language);
  }

  if (!startLoading) {
    return;
  }

  startLoading.classList.toggle('hidden', !loading && !error);
  startLoading.classList.toggle('is-error', error);
  setText('start-loading-text', error ? t('startLoadError', language) : t('startLoading', language));
}

function getGameModule(): Promise<typeof import('./game')> {
  if (!gameModulePromise) {
    gameModulePromise = loadGameModule();
  }

  return gameModulePromise;
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
  setText('start-button', isStarting ? t('startLoading', language) : t('startButton', language));
  setText('start-about-button', t('about', language));
  setText('start-loading-text', t('startLoading', language));
  setText('start-hint', t('startHint', language));
  setText('start-version-label', `${t('startVersionLabel', language)}:`);

  setText('title-eyebrow', t('eyebrow', language));
  setText('title-text', t('title', language));
  setText('language-label', t('language', language));
  setText('about-button', t('about', language));
  setText('version-label', `${t('versionLabel', language)}:`);

  setText('about-kicker', t('about', language));
  setText('about-title', t('aboutTitle', language));
  setText('about-body', t('aboutBody', language));
  setText('about-version-label', `${t('versionLabel', language)}:`);
  setText('close-about', t('close', language));

  setVersionText('start-version-value');
  setVersionText('version-value');
  setVersionText('about-version-value');

  if (startLanguageSelect) {
    startLanguageSelect.value = language;
  }
  if (gameLanguageSelect) {
    gameLanguageSelect.value = language;
  }

  gameController?.setLanguage(language);
}

async function startJourney(): Promise<void> {
  if (isStarting) {
    return;
  }

  if (!gameController) {
    setStartLoadingState(true);

    try {
      const { createGame } = await getGameModule();
      gameController = createGame(language);
      logInfo('Journey started', {
        eventName: 'journey_started',
        language
      });
    } catch (error) {
      setStartLoadingState(false, true);
      return;
    }
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
  void startJourney();
});

startAboutButton?.addEventListener('click', () => {
  openAbout();
});

aboutButton?.addEventListener('click', () => {
  openAbout();
});

closeAboutButton?.addEventListener('click', () => {
  closeAbout();
});

aboutPanel?.addEventListener('click', (event) => {
  if (event.target === aboutPanel) {
    closeAbout();
  }
});

applyLanguage(language);
