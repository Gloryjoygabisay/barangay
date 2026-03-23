import type { Language, LocalizedText } from './localization';

export type StatKey = 'trust' | 'courage' | 'supplies';

export type EncounterChoice = {
  id: string;
  text: LocalizedText;
  result: LocalizedText;
  effects: Partial<Record<StatKey, number>>;
  isCorrect?: boolean;
};

export type Encounter = {
  id: string;
  hotspotId: string;
  location: LocalizedText;
  title: LocalizedText;
  body: LocalizedText;
  choices: EncounterChoice[];
  isQuiz?: boolean;
  points?: number;
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
    ]
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
    ]
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
    ]
  },
  {
    id: 'sari-sari-quiz',
    hotspotId: 'sari-sari',
    isQuiz: true,
    points: 10,
    location: {
      en: 'Sari-Sari Store',
      tl: 'Tindahang Sari-Sari'
    },
    title: {
      en: 'At the Corner Store',
      tl: 'Sa Tindahang Pangsulok'
    },
    body: {
      en: 'The store owner smiles and asks you a question. What is the main purpose of a sari-sari store in the barangay?',
      tl: 'Ngumiti ang may-ari ng tindahan at nagtanong sa iyo. Ano ang pangunahing layunin ng isang tindahang sari-sari sa barangay?'
    },
    choices: [
      {
        id: 'sari-correct',
        isCorrect: true,
        text: {
          en: 'To sell small everyday items to neighbors nearby.',
          tl: 'Ibenta ang maliliit na pang-araw-araw na gamit sa mga kapitbahay.'
        },
        result: {
          en: 'Correct! Sari-sari stores are neighborhood convenience stores that stock small everyday essentials.',
          tl: 'Tama! Ang mga tindahang sari-sari ay nagbebenta ng maliliit na pangunahing pangangailangan para sa mga kapitbahay.'
        },
        effects: { trust: 1 }
      },
      {
        id: 'sari-wrong-1',
        text: {
          en: 'To serve as the barangay office for meetings.',
          tl: 'Gamitin bilang opisina ng barangay para sa mga pulong.'
        },
        result: {
          en: 'Not quite. Sari-sari stores are small neighborhood shops, not official offices.',
          tl: 'Hindi tama. Ang tindahang sari-sari ay isang maliit na tindahan, hindi opisyal na opisina.'
        },
        effects: {}
      },
      {
        id: 'sari-wrong-2',
        text: {
          en: 'To host community sports events.',
          tl: 'Mag-organisa ng mga sports event para sa komunidad.'
        },
        result: {
          en: 'Not quite. Sports events are held at the court, not the sari-sari store.',
          tl: 'Hindi tama. Ang mga sports event ay ginaganap sa court, hindi sa tindahan.'
        },
        effects: {}
      }
    ]
  },
  {
    id: 'barangay-hall-quiz',
    hotspotId: 'barangay-hall',
    isQuiz: true,
    points: 10,
    location: {
      en: 'Barangay Hall',
      tl: 'Barangay Hall'
    },
    title: {
      en: 'Civic Knowledge Check',
      tl: 'Pagsubok sa Kaalaman Sibiko'
    },
    body: {
      en: 'An official greets you at the door and asks: Who leads the barangay and serves the community?',
      tl: 'Binati ka ng isang opisyal sa pintuan at nagtanong: Sino ang nangunguna sa barangay at naglilingkod sa komunidad?'
    },
    choices: [
      {
        id: 'hall-wrong-1',
        text: {
          en: 'The Mayor of the city.',
          tl: 'Ang Alkalde ng lungsod.'
        },
        result: {
          en: 'Not quite. The Mayor leads the city, but each barangay has its own leader.',
          tl: 'Hindi tama. Ang Alkalde ang nangunguna sa lungsod, ngunit ang bawat barangay ay may sariling lider.'
        },
        effects: {}
      },
      {
        id: 'hall-correct',
        isCorrect: true,
        text: {
          en: 'The Barangay Captain (Punong Barangay).',
          tl: 'Ang Kapitan ng Barangay (Punong Barangay).'
        },
        result: {
          en: 'Correct! The Punong Barangay is elected by the community to govern and serve the barangay.',
          tl: 'Tama! Ang Punong Barangay ay inihahalal ng komunidad para pamunuan at paglingkuran ang barangay.'
        },
        effects: { trust: 1, courage: 1 }
      },
      {
        id: 'hall-wrong-2',
        text: {
          en: 'The school principal.',
          tl: 'Ang punong-guro ng paaralan.'
        },
        result: {
          en: 'Not quite. The school principal leads the school, not the barangay.',
          tl: 'Hindi tama. Ang punong-guro ang nangunguna sa paaralan, hindi sa barangay.'
        },
        effects: {}
      }
    ]
  },
  {
    id: 'basketball-court-quiz',
    hotspotId: 'basketball-court',
    isQuiz: true,
    points: 10,
    location: {
      en: 'Basketball Court',
      tl: 'Laruan ng Basketball'
    },
    title: {
      en: 'Lessons from the Court',
      tl: 'Aral mula sa Laruan'
    },
    body: {
      en: 'The players take a break and ask you: What is the most important value when playing team sports like basketball?',
      tl: 'Nagpahinga ang mga manlalaro at nagtanong sa iyo: Ano ang pinakamahalagang halaga sa paglalaro ng team sports tulad ng basketball?'
    },
    choices: [
      {
        id: 'court-wrong-1',
        text: {
          en: 'Competing alone is the best way to win.',
          tl: 'Ang pakikipagtalo nang mag-isa ang pinakamabuting paraan para manalo.'
        },
        result: {
          en: 'Not quite. Basketball is a team sport — solo play rarely wins games.',
          tl: 'Hindi tama. Ang basketball ay isang team sport — ang paglalaro nang mag-isa ay bihirang magtagumpay.'
        },
        effects: {}
      },
      {
        id: 'court-wrong-2',
        text: {
          en: 'Only the strongest player matters.',
          tl: 'Ang pinakamalakas na manlalaro lamang ang mahalaga.'
        },
        result: {
          en: 'Not quite. Every player contributes to the team\'s success.',
          tl: 'Hindi tama. Ang bawat manlalaro ay nag-aambag sa tagumpay ng koponan.'
        },
        effects: {}
      },
      {
        id: 'court-correct',
        isCorrect: true,
        text: {
          en: 'Working together and respecting teammates leads to success.',
          tl: 'Ang pagtutulungan at paggalang sa mga katrabaho ay nagdadala ng tagumpay.'
        },
        result: {
          en: 'Correct! Teamwork and respect are at the heart of every great barangay team.',
          tl: 'Tama! Ang pagtutulungan at paggalang ay nasa puso ng bawat mahusay na koponan ng barangay.'
        },
        effects: { courage: 2, trust: 1 }
      }
    ]
  },
  {
    id: 'market-quiz',
    hotspotId: 'market-stall',
    isQuiz: true,
    points: 10,
    location: {
      en: 'Market',
      tl: 'Palengke'
    },
    title: {
      en: 'Market Day Knowledge',
      tl: 'Kaalaman sa Araw ng Palengke'
    },
    body: {
      en: 'A vendor tests your community knowledge: What is the Filipino term for the practice of helping one another in the community?',
      tl: 'Sinubukan ng isang tindera ang iyong kaalaman sa komunidad: Ano ang salitang Pilipino para sa gawi ng pagtutulungan sa komunidad?'
    },
    choices: [
      {
        id: 'market-quiz-wrong-1',
        text: {
          en: 'Utang na loob',
          tl: 'Utang na loob'
        },
        result: {
          en: 'Not quite. Utang na loob means debt of gratitude, not community cooperation.',
          tl: 'Hindi tama. Ang utang na loob ay nagpapahiwatig ng pagkakautang ng pasasalamat, hindi kooperasyon ng komunidad.'
        },
        effects: {}
      },
      {
        id: 'market-quiz-correct',
        isCorrect: true,
        text: {
          en: 'Bayanihan',
          tl: 'Bayanihan'
        },
        result: {
          en: 'Correct! Bayanihan is the Filipino spirit of communal unity, work, and cooperation.',
          tl: 'Tama! Ang Bayanihan ay ang diwa ng Pilipinong pagkakaisa, pagtutulungan, at kooperasyon.'
        },
        effects: { trust: 2, courage: 1 }
      },
      {
        id: 'market-quiz-wrong-2',
        text: {
          en: 'Pakikisama',
          tl: 'Pakikisama'
        },
        result: {
          en: 'Close, but Pakikisama means getting along with others, while Bayanihan specifically means communal cooperation.',
          tl: 'Malapit, ngunit ang Pakikisama ay nangangahulugang pakikiisa sa iba, habang ang Bayanihan ay partikular na nangangahulugang kooperasyon ng komunidad.'
        },
        effects: {}
      }
    ]
  }
];

export function localizeText(text: LocalizedText, language: Language): string {
  return text[language];
}
