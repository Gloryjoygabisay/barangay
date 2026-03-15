export type Language = 'en' | 'tl';

export type LocalizedText = Record<Language, string>;

export type UiTextKey =
  | 'startEyebrow'
  | 'startTitle'
  | 'startBlurb'
  | 'startFeaturesHeading'
  | 'startFeatureVillage'
  | 'startFeatureChoices'
  | 'startFeatureLanguage'
  | 'startButton'
  | 'startHint'
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
  startEyebrow: {
    en: 'Mountain Village Journey',
    tl: 'Paglalakbay sa Baryong Bundok'
  },
  startTitle: {
    en: 'Trail Through the Barangay',
    tl: 'Landas sa Kabundukan'
  },
  startBlurb: {
    en: 'Travel as a young Filipino through a highland village, meeting neighbors, helping families, and choosing what kind of traveler you become.',
    tl: 'Maglakbay bilang isang batang Pilipino sa baryong nasa kabundukan, makipagkilala sa mga kapitbahay, tumulong sa mga pamilya, at pumili kung anong uri ng manlalakbay ang nais mong maging.'
  },
  startFeaturesHeading: {
    en: 'What awaits you',
    tl: 'Ano ang naghihintay sa iyo'
  },
  startFeatureVillage: {
    en: 'Explore a hand-drawn village map with mountain paths, bridges, and market spaces.',
    tl: 'Galugarin ang iginuhit na mapa ng baryo na may mga landas, tulay, at pamilihan.'
  },
  startFeatureChoices: {
    en: 'Shape encounters through dialogue choices that affect trust, courage, and supplies.',
    tl: 'Hubugin ang mga tagpo sa pamamagitan ng mga pagpili sa usapan na nakaaapekto sa tiwala, tapang, at baon.'
  },
  startFeatureLanguage: {
    en: 'Play in English or Filipino, and switch languages at any time.',
    tl: 'Maglaro sa English o Filipino, at magpalit ng wika anumang oras.'
  },
  startButton: {
    en: 'Start journey',
    tl: 'Simulan ang paglalakbay'
  },
  startHint: {
    en: 'Best played on mobile or in a narrow browser window.',
    tl: 'Pinakamainam laruin sa mobile o sa makitid na browser window.'
  },
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
