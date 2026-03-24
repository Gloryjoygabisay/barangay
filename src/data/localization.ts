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
  | 'startLoading'
  | 'startLoadError'
  | 'startHint'
  | 'startVersionLabel'
  | 'eyebrow'
  | 'title'
  | 'language'
  | 'about'
  | 'aboutTitle'
  | 'aboutBody'
  | 'versionLabel'
  | 'stats'
  | 'trust'
  | 'courage'
  | 'supplies'
  | 'score'
  | 'controlsHeading'
  | 'controlsHeading'
  | 'instructionsHeading'
  | 'instructionsBody'
  | 'riverFallMessage'
  | 'close'
  | 'completed'
  | 'resultPrefix'
  | 'encounterPrompt'
  | 'questionLabel'
  | 'ofLabel'
  | 'checkpointCleared'
  | 'checkpointBody'
  | 'gameOver'
  | 'gameOverTitle'
  | 'gameOverBody'
  | 'finalScore'
  | 'playAgain'
  | 'trueFalse'
  | 'multipleChoice'
  | 'nextQuestion'
  | 'nextLevel';

export const uiText: Record<UiTextKey, LocalizedText> = {
  startEyebrow: {
    en: 'Bridge Survival Challenge',
    tl: 'Hamon ng Pagtawid sa Tulay'
  },
  startTitle: {
    en: 'Bamboo Bridge Logic Quest',
    tl: 'Hamon ng Kawayan'
  },
  startBlurb: {
    en: 'You are crossing a dangerous bamboo bridge in the forest. Every time you move forward, the bridge tests your mind. To survive, you must answer the logic questions correctly.',
    tl: 'Tumatawid ka sa isang mapanganib na tulayang kawayan sa kagubatan. Sa bawat hakbang mo pasulong, sinusubok ng tulay ang iyong isip. Para makaligtas, kailangan mong sagutin nang tama ang mga tanong ng lohika.'
  },
  startFeaturesHeading: {
    en: 'What awaits you',
    tl: 'Ano ang naghihintay sa iyo'
  },
  startFeatureVillage: {
    en: 'Navigate a hand-drawn bamboo bridge map with treacherous planks and forest paths.',
    tl: 'Tawirin ang iginuhit na mapa ng tulayang kawayan na may mapanganib na tabla at mga landas sa kagubatan.'
  },
  startFeatureChoices: {
    en: 'Solve logic puzzles at each section of the bridge to keep moving forward.',
    tl: 'Lutasin ang mga tanong ng lohika sa bawat bahagi ng tulay para makasulong.'
  },
  startFeatureLanguage: {
    en: 'Play in English or Filipino, and switch languages at any time.',
    tl: 'Maglaro sa English o Filipino, at magpalit ng wika anumang oras.'
  },
  startButton: {
    en: 'Start crossing',
    tl: 'Simulan ang pagtawid'
  },
  startLoading: {
    en: 'Loading the bridge...',
    tl: 'Inihahanda ang tulay...'
  },
  startLoadError: {
    en: 'Unable to load the game. Please try again.',
    tl: 'Hindi ma-load ang laro. Pakisubukang muli.'
  },
  startHint: {
    en: 'Best played on mobile or in a narrow browser window.',
    tl: 'Pinakamainam laruin sa mobile o sa makitid na browser window.'
  },
  startVersionLabel: {
    en: 'Version',
    tl: 'Bersyon'
  },
  eyebrow: {
    en: 'Logic Quest',
    tl: 'Hamon ng Lohika'
  },
  title: {
    en: 'Bamboo Bridge Logic Quest',
    tl: 'Hamon ng Kawayan'
  },
  language: {
    en: 'Language',
    tl: 'Wika'
  },
  about: {
    en: 'About',
    tl: 'Tungkol Dito'
  },
  aboutTitle: {
    en: 'About This Game',
    tl: 'Tungkol sa Laro'
  },
  aboutBody: {
    en: 'Bamboo Bridge Logic Quest is a mobile-friendly puzzle game where you cross a dangerous forest bridge by answering logic questions. Each correct answer keeps you moving forward. Each wrong answer costs you precious planks. How far can your mind take you?',
    tl: 'Ang Hamon ng Kawayan ay isang mobile-friendly na larong palaisipan kung saan tumatawid ka ng mapanganib na tulay sa kagubatan sa pamamagitan ng pagsagot sa mga tanong ng lohika. Ang bawat tamang sagot ay nagpapasulong sa iyo. Ang bawat maling sagot ay kumukuha ng iyong mahahalagang tabla. Gaano kalayo ang maaabot ng iyong isip?'
  },
  versionLabel: {
    en: 'Version',
    tl: 'Bersyon'
  },
  stats: {
    en: 'Bridge Stats',
    tl: 'Kalagayan sa Tulay'
  },
  trust: {
    en: 'Mind',
    tl: 'Isip'
  },
  courage: {
    en: 'Courage',
    tl: 'Tapang'
  },
  supplies: {
    en: 'Planks',
    tl: 'Tabla'
  },
  score: {
    en: 'Score',
    tl: 'Puntos'
  },
  instructionsHeading: {
    en: 'How to Play',
    tl: 'Paano Maglaro'
  },
  instructionsBody: {
    en: 'Move with the on-screen pad or arrow keys. Walk into a glowing section to face a logic challenge, then choose your answer.',
    tl: 'Gumalaw gamit ang on-screen pad o arrow keys. Lumapit sa kumikislap na bahagi para harapin ang hamon ng lohika, saka pumili ng sagot.'
  },
  controlsHeading: {
    en: 'Controls',
    tl: 'Mga Kontrol'
  },
  close: {
    en: 'Continue crossing',
    tl: 'Magpatuloy sa pagtawid'
  },
  riverFallMessage: {
    en: '💦 You fell in! Start again from the bank',
    tl: '💦 Nahulog ka! Bumalik sa simula ng tulay'
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
    en: 'Answer the logic question:',
    tl: 'Sagutin ang tanong ng lohika:'
  },
  questionLabel: {
    en: 'Question',
    tl: 'Tanong'
  },
  ofLabel: {
    en: 'of',
    tl: 'ng'
  },
  checkpointCleared: {
    en: 'Checkpoint Cleared! ⭐',
    tl: 'Tagumpay sa Checkpoint! ⭐'
  },
  checkpointBody: {
    en: 'You answered all questions correctly and may continue your journey!',
    tl: 'Nasagot mo nang tama ang lahat ng tanong at maaari kang magpatuloy sa iyong paglalakbay!'
  },
  gameOver: {
    en: 'Game Over',
    tl: 'Tapos na ang Laro'
  },
  gameOverTitle: {
    en: 'You Fell! 😱',
    tl: 'Nahulog Ka! 😱'
  },
  gameOverBody: {
    en: 'A wrong answer caused you to fall from the bridge. Better luck next time!',
    tl: 'Ang maling sagot ay naging sanhi ng pagkahulog mo mula sa tulay. Subukan muli sa susunod!'
  },
  finalScore: {
    en: 'Final Score',
    tl: 'Huling Puntos'
  },
  playAgain: {
    en: 'Try Again',
    tl: 'Subukan Ulit'
  },
  trueFalse: {
    en: '🟡 True or False',
    tl: '🟡 Tama o Mali'
  },
  multipleChoice: {
    en: '🔵 Multiple Choice',
    tl: '🔵 Maramihang Pagpipilian'
  },
  nextQuestion: {
    en: 'Next Question ▶',
    tl: 'Susunod na Tanong ▶'
  },
  nextLevel: {
    en: 'Next Level →',
    tl: 'Susunod na Antas →'
  }
};

export function t(key: UiTextKey, language: Language): string {
  return uiText[key][language];
}
