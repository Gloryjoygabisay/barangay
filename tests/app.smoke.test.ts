import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, beforeEach, vi } from 'vitest';

const createGameMock = vi.fn();
const setLanguageMock = vi.fn();
const initTelemetryMock = vi.fn();
const logInfoMock = vi.fn();

vi.mock('../src/game', () => ({
  createGame: createGameMock,
  GameController: {}
}));

vi.mock('../src/telemetry', () => ({
  initTelemetry: initTelemetryMock,
  logInfo: logInfoMock
}));

function loadHtmlShell(): void {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
  const bodyMatch = html.match(/<body>([\s\S]*)<\/body>/i);

  if (!bodyMatch) {
    throw new Error('Failed to load app shell from index.html');
  }

  document.body.innerHTML = bodyMatch[1].replace(
    /<script type="module" src="\/src\/main\.ts"><\/script>/,
    ''
  );
}

describe('app bootstrap smoke test', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    setLanguageMock.mockReset();
    createGameMock.mockReturnValue({
      setLanguage: setLanguageMock
    });
    loadHtmlShell();
  });

  it('renders the start screen and wires core UI actions', async () => {
    await import('../src/main');

    expect(initTelemetryMock).toHaveBeenCalledOnce();
    expect(document.getElementById('start-title')?.textContent).toBe('Trail Through the Barangay');
    expect(document.getElementById('start-button')?.textContent).toBe('Start journey');

    const startLanguageSelect = document.getElementById('start-language-select') as HTMLSelectElement;
    startLanguageSelect.value = 'tl';
    startLanguageSelect.dispatchEvent(new Event('change'));

    expect(document.getElementById('start-title')?.textContent).toBe('Landas sa Kabundukan');
    expect(document.getElementById('about-button')?.textContent).toBe('Tungkol Dito');

    (document.getElementById('start-about-button') as HTMLButtonElement).click();
    expect(document.getElementById('about-panel')?.classList.contains('hidden')).toBe(false);

    (document.getElementById('close-about') as HTMLButtonElement).click();
    expect(document.getElementById('about-panel')?.classList.contains('hidden')).toBe(true);

    (document.getElementById('start-button') as HTMLButtonElement).click();

    expect(createGameMock).toHaveBeenCalledOnce();
    expect(createGameMock).toHaveBeenCalledWith('tl');
    expect(document.getElementById('start-screen')?.classList.contains('hidden')).toBe(true);
    expect(document.getElementById('game-shell')?.classList.contains('hidden')).toBe(false);
    expect(setLanguageMock).toHaveBeenCalledWith('tl');
    expect(logInfoMock).toHaveBeenCalledWith(
      'Journey started',
      expect.objectContaining({
        eventName: 'journey_started',
        language: 'tl'
      })
    );
  });
});
