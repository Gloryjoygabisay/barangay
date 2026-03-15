export type Language = 'en' | 'tl';

export type LocalizedText = Record<Language, string>;

export type UiTextKey =
  | 'eyebrow'
  | 'title'
  | 'language'
  | 'stats'
  | 'trust'
  | 'courage'
  | 'supplies'
  | 'instructionsHeading'
  | 'instructionsBody'
  | 'close'
  | 'completed'
  | 'resultPrefix'
  | 'encounterPrompt';

export const uiText: Record<UiTextKey, LocalizedText> = {
  eyebrow: {
    en: 'Narrative Demo',
    tl: 'Demo ng Kuwento'
  },
  title: {
    en: 'Trail Through the Barangay',
    tl: 'Landas sa Kabundukan'
  },
  language: {
    en: 'Language',
    tl: 'Wika'
  },
  stats: {
    en: 'Journey Stats',
    tl: 'Kalagayan ng Paglalakbay'
  },
  trust: {
    en: 'Trust',
    tl: 'Tiwala'
  },
  courage: {
    en: 'Courage',
    tl: 'Tapang'
  },
  supplies: {
    en: 'Supplies',
    tl: 'Baon'
  },
  instructionsHeading: {
    en: 'How to Play',
    tl: 'Paano Maglaro'
  },
  instructionsBody: {
    en: 'Move with the on-screen pad or arrow keys. Walk into a glowing place to trigger an encounter, then choose how you respond.',
    tl: 'Gumalaw gamit ang on-screen pad o arrow keys. Lumapit sa kumikislap na lugar para magsimula ng tagpo, saka pumili ng sagot.'
  },
  close: {
    en: 'Continue walking',
    tl: 'Magpatuloy sa paglalakad'
  },
  completed: {
    en: 'Completed',
    tl: 'Natapos'
  },
  resultPrefix: {
    en: 'Result',
    tl: 'Bunga'
  },
  encounterPrompt: {
    en: 'Choose your response:',
    tl: 'Piliin ang iyong tugon:'
  }
};

export function t(key: UiTextKey, language: Language): string {
  return uiText[key][language];
}
