import type { Language, LocalizedText } from './localization';

export type StatKey = 'trust' | 'courage' | 'supplies';

export type EncounterChoice = {
  id: string;
  text: LocalizedText;
  result: LocalizedText;
  effects: Partial<Record<StatKey, number>>;
};

export type QuizChoice = {
  id: string;
  text: LocalizedText;
  isCorrect: boolean;
};

export type QuizQuestion = {
  question: LocalizedText;
  choices: QuizChoice[];
  explanation: LocalizedText;
  bonusEffects: Partial<Record<StatKey, number>>;
};

export type Encounter = {
  id: string;
  hotspotId: string;
  location: LocalizedText;
  title: LocalizedText;
  body: LocalizedText;
  choices: EncounterChoice[];
  quiz?: QuizQuestion;
};

export const encounters: Encounter[] = [
  {
    id: 'bridge-elder',
    hotspotId: 'bridge',
    location: {
      en: 'Bamboo Bridge',
      tl: 'Tulayang Kawayan'
    },
    title: {
      en: 'The Elder With the Basket',
      tl: 'Matandang May Dalang Basket'
    },
    body: {
      en: 'An elder balancing vegetables on her back pauses at the bridge. She asks if you can carry the basket while she crosses the wet planks.',
      tl: 'Huminto sa tulay ang isang matandang may gulay sa likod. Nakiusap siya kung maaari mong buhatin ang basket habang tumatawid siya sa madulas na kawayan.'
    },
    choices: [
      {
        id: 'help-carry',
        text: {
          en: 'Carry the basket and walk beside her.',
          tl: 'Buhatin ang basket at samahan siya.'
        },
        result: {
          en: 'She thanks you and tells nearby families that you are dependable.',
          tl: 'Nagpasalamat siya at ikinuwento sa mga kapitbahay na maaasahan ka.'
        },
        effects: { trust: 2, courage: 1 }
      },
      {
        id: 'repair-first',
        text: {
          en: 'Tighten the bridge rope before crossing.',
          tl: 'Higpitan muna ang tali ng tulay bago tumawid.'
        },
        result: {
          en: 'The crossing takes longer, but everyone behind you passes more safely.',
          tl: 'Mas tumagal ang tawiran, pero naging mas ligtas ang mga susunod na dadaan.'
        },
        effects: { trust: 1, supplies: -1, courage: 1 }
      }
    ],
    quiz: {
      question: {
        en: 'The spirit of "Bayanihan" is a core Filipino value. What does Bayanihan mean?',
        tl: 'Ang "Bayanihan" ay isang mahalagang pagpapahalaga ng mga Pilipino. Ano ang ibig sabihin nito?'
      },
      choices: [
        {
          id: 'bayanihan-unity',
          text: { en: 'Community unity and cooperative effort to help one another', tl: 'Pagkakaisa ng komunidad at tulong sa isa\'t isa' },
          isCorrect: true
        },
        {
          id: 'bayanihan-festival',
          text: { en: 'A traditional harvest festival', tl: 'Isang tradisyonal na pagdiriwang ng ani' },
          isCorrect: false
        },
        {
          id: 'bayanihan-hero',
          text: { en: 'The story of a village hero', tl: 'Kwento ng isang bayani ng baryo' },
          isCorrect: false
        }
      ],
      explanation: {
        en: 'Bayanihan is the Filipino spirit of communal unity and cooperation — helping each other as a community, not just as individuals.',
        tl: 'Ang Bayanihan ay ang diwa ng pagkakaisa at pagtutulungan ng mga Pilipino — ang pagtutulungan bilang isang komunidad, hindi bilang mga indibidwal lamang.'
      },
      bonusEffects: { trust: 2 }
    }
  },
  {
    id: 'market-musicians',
    hotspotId: 'market',
    location: {
      en: 'Hillside Market',
      tl: 'Pamilihan sa Dalisdis'
    },
    title: {
      en: 'Rhythm at the Market',
      tl: 'Tugtugan sa Pamilihan'
    },
    body: {
      en: 'A group of young musicians invite you to join their song before the evening trade begins. A small crowd gathers and waits for your answer.',
      tl: 'Inaanyayahan ka ng mga kabataang musikero na sumabay sa kanilang awit bago magsimula ang bentahan sa hapon. Napapalibutan kayo ng mga taong naghihintay sa sagot mo.'
    },
    choices: [
      {
        id: 'join-song',
        text: {
          en: 'Sing with them and clap to the beat.',
          tl: 'Makisabay sa kanta at pumalakpak sa kumpas.'
        },
        result: {
          en: 'Your confidence grows, and the market vendors greet you warmly.',
          tl: 'Lumakas ang loob mo at magiliw kang binati ng mga tindera at tindero.'
        },
        effects: { courage: 2, trust: 1 }
      },
      {
        id: 'trade-snacks',
        text: {
          en: 'Offer some of your trail snacks to the musicians instead.',
          tl: 'Ibahagi na lang ang baon mong pagkain sa mga musikero.'
        },
        result: {
          en: 'They laugh, share stories from the next village, and give you useful directions.',
          tl: 'Natawa sila, nagbahagi ng kuwento mula sa kabilang baryo, at binigyan ka ng kapaki-pakinabang na direksiyon.'
        },
        effects: { supplies: -1, trust: 2 }
      }
    ],
    quiz: {
      question: {
        en: 'Which traditional Filipino stringed instrument is commonly played at village festivities in the Cordillera and Visayas regions?',
        tl: 'Aling tradisyonal na Pilipinong instrumento ang karaniwang tumutugtog sa mga pagdiriwang ng baryo sa Cordillera at Visayas?'
      },
      choices: [
        {
          id: 'kudyapi',
          text: { en: 'Kudyapi (boat lute)', tl: 'Kudyapi (lute na hugis bangka)' },
          isCorrect: true
        },
        {
          id: 'guitar',
          text: { en: 'Classical guitar', tl: 'Klasikal na gitara' },
          isCorrect: false
        },
        {
          id: 'violin',
          text: { en: 'Violin', tl: 'Violin' },
          isCorrect: false
        }
      ],
      explanation: {
        en: 'The Kudyapi is a two-stringed Philippine lute carved from a single piece of wood. It is one of the oldest indigenous instruments in the Philippines.',
        tl: 'Ang Kudyapi ay isang dalawang-kuwerdas na luteng Pilipino na inukit mula sa isang piraso ng kahoy. Isa ito sa pinakamatandang katutubong instrumento sa Pilipinas.'
      },
      bonusEffects: { courage: 1, trust: 1 }
    }
  },
  {
    id: 'ridge-storm',
    hotspotId: 'ridge',
    location: {
      en: 'Foggy Ridge',
      tl: 'Maulap na Gulod'
    },
    title: {
      en: 'Rain Over the Rice Terraces',
      tl: 'Ulan sa Palayan'
    },
    body: {
      en: 'Dark clouds roll over the terraces. A child hurries after a loose goat near the cliff trail and looks frightened.',
      tl: 'Dumidilim ang langit sa ibabaw ng hagdang-hagdang palayan. Isang bata ang humahabol sa nakawalang kambing malapit sa bangin at halatang natatakot.'
    },
    choices: [
      {
        id: 'shield-child',
        text: {
          en: 'Guide the child back first, then circle around for the goat.',
          tl: 'Ihatid muna sa ligtas ang bata bago balikan ang kambing.'
        },
        result: {
          en: 'The family is relieved. They offer you dried fruit for the road.',
          tl: 'Napanatag ang pamilya. Binigyan ka nila ng pinatuyong prutas para sa paglalakbay.'
        },
        effects: { trust: 2, supplies: 1 }
      },
      {
        id: 'chase-goat',
        text: {
          en: 'Sprint after the goat before it slips farther down the trail.',
          tl: 'Takbuhin agad ang kambing bago ito tuluyang mapalayo sa daan.'
        },
        result: {
          en: 'You catch it just in time and return muddy but triumphant.',
          tl: 'Naabutan mo ito sa tamang oras at nakabalik kang maputik pero matagumpay.'
        },
        effects: { courage: 2, trust: 1 }
      }
    ],
    quiz: {
      question: {
        en: 'The famous rice terraces of the Cordillera were carved into the mountains by the Ifugao people. How long ago are they estimated to have been built?',
        tl: 'Ang mga tanyag na hagdang-hagdang palayan ng Cordillera ay inukit ng mga Ifugao. Gaano na katagal ang tinatayang pagtayo nito?'
      },
      choices: [
        {
          id: 'rice-100',
          text: { en: 'About 100 years ago', tl: 'Mga 100 taon na ang nakalipas' },
          isCorrect: false
        },
        {
          id: 'rice-2000',
          text: { en: 'About 2,000 years ago', tl: 'Mga 2,000 taon na ang nakalipas' },
          isCorrect: true
        },
        {
          id: 'rice-500',
          text: { en: 'About 500 years ago', tl: 'Mga 500 taon na ang nakalipas' },
          isCorrect: false
        }
      ],
      explanation: {
        en: 'The Ifugao Rice Terraces are estimated to be about 2,000 years old and are a UNESCO World Heritage Site.',
        tl: 'Ang mga Hagdang-Palayan ng Ifugao ay tinatayang humigit 2,000 taong gulang na at isang UNESCO World Heritage Site.'
      },
      bonusEffects: { courage: 1, supplies: 1 }
    }
  }
];

export function localizeText(text: LocalizedText, language: Language): string {
  return text[language];
}
