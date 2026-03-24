import type { Language, LocalizedText } from './localization';

export type StatKey = 'trust' | 'courage' | 'supplies';

export type EncounterChoice = {
  id: string;
  text: LocalizedText;
  result: LocalizedText;
  effects: Partial<Record<StatKey, number>>;
};

export type Encounter = {
  id: string;
  hotspotId: string;
  location: LocalizedText;
  title: LocalizedText;
  body: LocalizedText;
  choices: EncounterChoice[];
};

export const encounters: Encounter[] = [
  {
    id: 'bridge-puzzle',
    hotspotId: 'bridge',
    location: {
      en: 'Bamboo Bridge',
      tl: 'Tulayang Kawayan'
    },
    title: {
      en: 'The Number Pattern',
      tl: 'Ang Pattern ng Bilang'
    },
    body: {
      en: 'A section of planks is marked with numbers: 2, 4, 6, ?, 10. You must step on the correct plank to cross safely. What is the missing number?',
      tl: 'Ang isang bahagi ng mga tabla ay may mga numero: 2, 4, 6, ?, 10. Kailangan mong tumuntong sa tamang tabla para makatawid nang ligtas. Ano ang nawawalang numero?'
    },
    choices: [
      {
        id: 'answer-8',
        text: {
          en: '8 — the pattern increases by 2 each time.',
          tl: '8 — ang pattern ay nagdaragdag ng 2 sa bawat pagkakataon.'
        },
        result: {
          en: 'Correct! You step confidently across the safe plank and move forward.',
          tl: 'Tama! Tiwala kang tumuntong sa ligtas na tabla at sumusulong ka.'
        },
        effects: { courage: 2, trust: 1 }
      },
      {
        id: 'answer-7',
        text: {
          en: '7 — roughly midway between 6 and 10.',
          tl: '7 — halos nasa gitna ng 6 at 10.'
        },
        result: {
          en: 'Wrong! The plank cracks under your foot. You barely hold on, losing precious planks.',
          tl: 'Mali! Sumibak ang tabla sa iyong paa. Halos malaglag ka, nawala ang iyong mahahalagang tabla.'
        },
        effects: { courage: 1, supplies: -1 }
      }
    ]
  },
  {
    id: 'market-puzzle',
    hotspotId: 'market',
    location: {
      en: 'Forest Clearing',
      tl: 'Kaparangan sa Kagubatan'
    },
    title: {
      en: "The Merchant's Riddle",
      tl: 'Palaisipan ng Mangangalakal'
    },
    body: {
      en: 'A forest merchant guards the rope bridge. "I am thinking of a number. Double it, then add 4, and you get 14. What is my number?" he asks, blocking the path.',
      tl: 'Isang mangangalakal sa kagubatan ang nagbabantay ng tulay na lubid. "Nag-iisip ako ng numero. I-doble ito, pagkatapos ay dagdag ng 4, at makukuha mo ang 14. Ano ang aking numero?" tanong niya, hinahadlangan ang daan.'
    },
    choices: [
      {
        id: 'answer-5',
        text: {
          en: '5 — if 2x + 4 = 14, then x = 5.',
          tl: '5 — kung 2x + 4 = 14, kung gayon x = 5.'
        },
        result: {
          en: 'Correct! The merchant steps aside, impressed by your quick thinking.',
          tl: 'Tama! Lumayo ang mangangalakal, humanga sa iyong mabilis na pag-iisip.'
        },
        effects: { trust: 2, courage: 1 }
      },
      {
        id: 'answer-9',
        text: {
          en: '9 — half of 14 rounded up.',
          tl: '9 — kalahati ng 14 na pinataas.'
        },
        result: {
          en: 'Wrong! The merchant shakes his head and makes you take the longer path around.',
          tl: 'Mali! Umiling ang mangangalakal at pinapaligid ka ng mas mahabang landas.'
        },
        effects: { courage: 1, supplies: -1 }
      }
    ]
  },
  {
    id: 'ridge-puzzle',
    hotspotId: 'ridge',
    location: {
      en: 'Final Crossing',
      tl: 'Huling Tawiran'
    },
    title: {
      en: "The Elder's Logic Test",
      tl: 'Pagsubok ng Lohika ng Matanda'
    },
    body: {
      en: 'An elder sits at the last section of the bridge. "If it rains, the river rises. The river has risen. Did it necessarily rain?" she asks, hand resting on the final plank.',
      tl: 'Isang matanda ang nakaupo sa huling bahagi ng tulay. "Kung umulan, ang ilog ay tataas. Ang ilog ay tumaas na. Kailangan bang umulan?" tanong niya, kamay na nakapatong sa huling tabla.'
    },
    choices: [
      {
        id: 'answer-not-necessarily',
        text: {
          en: 'Not necessarily — something else could have raised the river.',
          tl: 'Hindi kinakailangan — may iba pang bagay na maaaring nagtaas ng ilog.'
        },
        result: {
          en: 'Correct! The elder smiles and lifts the final plank. You have crossed the bridge!',
          tl: 'Tama! Ngumiti ang matanda at itinaas ang huling tabla. Natawid mo na ang tulay!'
        },
        effects: { trust: 2, supplies: 1 }
      },
      {
        id: 'answer-yes',
        text: {
          en: 'Yes — if the river rose, it must have rained.',
          tl: 'Oo — kung tumaas ang ilog, dapat ay umulan.'
        },
        result: {
          en: 'Wrong! The elder shakes her head. "That is a logical fallacy, young one." You stumble on the crossing.',
          tl: 'Mali! Umiling ang matanda. "Iyon ay lohikal na kamalian, batang ito." Natisod ka sa tawiran.'
        },
        effects: { courage: 2, trust: 1 }
      }
    ]
  }
];

export function localizeText(text: LocalizedText, language: Language): string {
  return text[language];
}
