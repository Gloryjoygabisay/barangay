import type { Language, LocalizedText } from './localization';

export type StatKey = 'trust' | 'courage' | 'supplies';

export type QuizChoice = {
  id: string;
  text: LocalizedText;
  result: LocalizedText;
  isCorrect: boolean;
  effects: Partial<Record<StatKey, number>>;
};

export type QuestionType = 'true-false' | 'multiple-choice';

export type QuizQuestion = {
  id: string;
  questionType: QuestionType;
  title: LocalizedText;
  body: LocalizedText;
  choices: QuizChoice[];
};

export type Encounter = {
  id: string;
  hotspotId: string;
  location: LocalizedText;
  level: number;
  questions: QuizQuestion[];
};

// Five bridge steps — one logical question each, increasing in difficulty.
export const encounters: Encounter[] = [
  {
    id: 'step-1',
    hotspotId: 'bridge-1',
    level: 1,
    location: { en: 'Step 1 — Bamboo Bridge', tl: 'Hakbang 1 — Tulayang Kawayan' },
    questions: [
      {
        id: 'step1-q',
        questionType: 'multiple-choice',
        title: { en: 'Deductive Reasoning', tl: 'Deduktibong Pag-iisip' },
        body: {
          en: 'All villagers know how to swim. Maria is a villager. What can you logically conclude?',
          tl: 'Lahat ng mga naninirahan sa nayon ay marunong lumangoy. Si Maria ay isang naninirahan sa nayon. Ano ang maaari mong lohikal na tapusin?'
        },
        choices: [
          {
            id: 'step1-correct',
            text: { en: 'Maria knows how to swim.', tl: 'Si Maria ay marunong lumangoy.' },
            result: { en: 'Correct! If all villagers swim and Maria is a villager, then Maria swims — solid deductive logic!', tl: 'Tama! Kung lahat ng naninirahan ay lumalangoy at si Maria ay naninirahan, kung gayon si Maria ay lumalangoy — matibay na deduktibong lohika!' },
            isCorrect: true,
            effects: { courage: 1, trust: 1 }
          },
          {
            id: 'step1-wrong',
            text: { en: 'Maria likes to swim.', tl: 'Si Maria ay mahilig lumangoy.' },
            result: { en: 'Wrong! Knowing how to swim and liking to swim are different — the statement says ability, not preference.', tl: 'Mali! Ang pag-alam kung paano lumangoy at ang pagmamahal sa paglangoy ay magkaiba — sinasabi ng pahayag ang kakayahan, hindi kagustuhan.' },
            isCorrect: false,
            effects: { supplies: -1 }
          }
        ]
      }
    ]
  },
  {
    id: 'step-2',
    hotspotId: 'bridge-2',
    level: 2,
    location: { en: 'Step 2 — Bamboo Bridge', tl: 'Hakbang 2 — Tulayang Kawayan' },
    questions: [
      {
        id: 'step2-q',
        questionType: 'multiple-choice',
        title: { en: 'Pattern Recognition', tl: 'Pagkilala ng Pattern' },
        body: {
          en: 'Stones mark the safe path across the bridge: 2, 4, 8, 16, ?. What number is on the next stone?',
          tl: 'Ang mga bato ay nagmamarka ng ligtas na landas sa tulay: 2, 4, 8, 16, ?. Anong numero ang nasa susunod na bato?'
        },
        choices: [
          {
            id: 'step2-correct',
            text: { en: '32 — each number is doubled.', tl: '32 — ang bawat numero ay dino-doble.' },
            result: { en: 'Correct! 2 × 2 = 4, 4 × 2 = 8, 8 × 2 = 16, 16 × 2 = 32. You spot the doubling pattern!', tl: 'Tama! 2 × 2 = 4, 4 × 2 = 8, 8 × 2 = 16, 16 × 2 = 32. Nakita mo ang pattern ng pagdoble!' },
            isCorrect: true,
            effects: { courage: 1, trust: 1 }
          },
          {
            id: 'step2-wrong',
            text: { en: '20 — add 4 more each time.', tl: '20 — dagdag ng 4 pa sa bawat pagkakataon.' },
            result: { en: 'Wrong! The gaps are 2, 4, 8 — they double too, so the rule is multiply by 2: 16 × 2 = 32.', tl: 'Mali! Ang mga pagitan ay 2, 4, 8 — dino-doble rin sila, kaya ang panuntunan ay i-multiply ng 2: 16 × 2 = 32.' },
            isCorrect: false,
            effects: { supplies: -1 }
          }
        ]
      }
    ]
  },
  {
    id: 'step-3',
    hotspotId: 'bridge-3',
    level: 3,
    location: { en: 'Step 3 — Bamboo Bridge', tl: 'Hakbang 3 — Tulayang Kawayan' },
    questions: [
      {
        id: 'step3-q',
        questionType: 'multiple-choice',
        title: { en: 'The Banana Trick', tl: 'Ang Trick ng Saging' },
        body: {
          en: 'You see 5 bananas on the bridge. You take away 3. How many bananas do YOU now have?',
          tl: 'Nakakita ka ng 5 saging sa tulay. Kinuha mo ang 3. Ilan na saging ang MAYROON KA ngayon?'
        },
        choices: [
          {
            id: 'step3-correct',
            text: { en: '3 — I took 3, so I have 3.', tl: '3 — kinuha ko ang 3, kaya mayroon akong 3.' },
            result: { en: 'Correct! The question asks what YOU have, not what remains on the bridge. You took 3, so you have 3!', tl: 'Tama! Ang tanong ay kung ano ang MAYROON KA, hindi kung ano ang naiwan sa tulay. Kinuha mo ang 3, kaya mayroon kang 3!' },
            isCorrect: true,
            effects: { courage: 1, trust: 1 }
          },
          {
            id: 'step3-wrong',
            text: { en: '2 — 5 minus 3 equals 2.', tl: '2 — 5 minus 3 ay katumbas ng 2.' },
            result: { en: 'Wrong! 5 − 3 = 2 is what remains on the bridge, not what YOU have. The trick is in the wording!', tl: 'Mali! 5 − 3 = 2 ang naiwan sa tulay, hindi kung ano ang MAYROON KA. Ang trick ay nasa pagbuo ng tanong!' },
            isCorrect: false,
            effects: { supplies: -1 }
          }
        ]
      }
    ]
  },
  {
    id: 'step-4',
    hotspotId: 'bridge-4',
    level: 4,
    location: { en: 'Step 4 — Bamboo Bridge', tl: 'Hakbang 4 — Tulayang Kawayan' },
    questions: [
      {
        id: 'step4-q',
        questionType: 'true-false',
        title: { en: 'The Weight Riddle', tl: 'Ang Palaisipan ng Bigat' },
        body: {
          en: 'The bridge keeper asks: "Which is heavier — 1 kg of bamboo or 1 kg of stone?" Answer True if stone is heavier, False if they weigh the same.',
          tl: 'Tinanong ng tagabantay ng tulay: "Alin ang mas mabigat — 1 kg na kawayan o 1 kg na bato?" Sumagot ng Tama kung mas mabigat ang bato, Mali kung magkapantay ang bigat.'
        },
        choices: [
          {
            id: 'step4-correct',
            text: { en: 'False — they weigh the same; both are 1 kg.', tl: 'Mali — magkapantay ang bigat; parehong 1 kg.' },
            result: { en: 'Correct! 1 kg is 1 kg regardless of material. The keeper nods and lets you pass!', tl: 'Tama! Ang 1 kg ay 1 kg anuman ang materyal. Tumango ang tagabantay at pinayagan ka niyang makaraan!' },
            isCorrect: true,
            effects: { trust: 2 }
          },
          {
            id: 'step4-wrong',
            text: { en: 'True — stone is heavier because it is denser.', tl: 'Tama — mas mabigat ang bato dahil mas siksik ito.' },
            result: { en: 'Wrong! Density affects volume, not mass. Both are 1 kg — the bridge keeper shakes his head!', tl: 'Mali! Ang density ay nakakaapekto sa volume, hindi sa mass. Parehong 1 kg — umiling ang tagabantay ng tulay!' },
            isCorrect: false,
            effects: { supplies: -1 }
          }
        ]
      }
    ]
  },
  {
    id: 'step-5',
    hotspotId: 'bridge-5',
    level: 5,
    location: { en: 'Step 5 — Bamboo Bridge', tl: 'Hakbang 5 — Tulayang Kawayan' },
    questions: [
      {
        id: 'step5-q',
        questionType: 'true-false',
        title: { en: 'The Logic Trap', tl: 'Ang Bitag ng Lohika' },
        body: {
          en: '"Some brave people cross bridges. I am crossing this bridge. Therefore, I must be brave." Is this reasoning logically valid?',
          tl: '"Ang ilang matapang na tao ay tumatawid ng tulay. Tumatawid ako ng tulayang ito. Samakatuwid, matapang ako." Lohikal ba ang pangangatwirang ito?'
        },
        choices: [
          {
            id: 'step5-correct',
            text: { en: 'False — this is a logical fallacy; crossing a bridge does not prove bravery.', tl: 'Mali — ito ay isang lohikal na kamalian; ang pagtawid sa tulay ay hindi nagpapatunay ng tapang.' },
            result: { en: 'Correct! "Some brave people cross" does not mean "all who cross are brave." You see through the fallacy! 🎉', tl: 'Tama! Ang "ilang matapang ay tumatawid" ay hindi nangangahulugang "lahat ng tumatawid ay matapang." Nakita mo ang kamalian! 🎉' },
            isCorrect: true,
            effects: { trust: 2, courage: 1 }
          },
          {
            id: 'step5-wrong',
            text: { en: 'True — crossing the bridge proves bravery.', tl: 'Tama — ang pagtawid sa tulay ay nagpapatunay ng tapang.' },
            result: { en: 'Wrong! This is affirming the consequent — a classic logical fallacy. Not all who cross are brave!', tl: 'Mali! Ito ay ang pagpapatunay ng kahihinatnan — isang klasikong lohikal na kamalian. Hindi lahat ng tumatawid ay matapang!' },
            isCorrect: false,
            effects: { supplies: -1 }
          }
        ]
      }
    ]
  }
];

export function localizeText(text: LocalizedText, language: Language): string {
  return text[language];
}
