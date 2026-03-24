import type { Language, LocalizedText } from './localization';

export type StatKey = 'trust' | 'courage' | 'supplies';

export type MissionObjectiveType = 'questions' | 'reach' | 'survive' | 'timer';

export type MissionObjective = {
  id: string;
  label: LocalizedText;
  type: MissionObjectiveType;
  /** Cumulative question count target (used when type === 'questions'). */
  target?: number;
};

export type LevelMission = {
  level: number;
  /** The encounter that, when completed, fulfils this level's mission. */
  encounterId: string;
  name: LocalizedText;
  objectives: MissionObjective[];
  /** Countdown duration in seconds for timed levels. */
  timerSeconds?: number;
};

export const levelMissions: LevelMission[] = [
  {
    level: 1,
    encounterId: 'bridge-puzzle',
    name: { en: 'Level 1 – Beginner Bridge', tl: 'Antas 1 – Tulay ng Baguhan' },
    objectives: [
      {
        id: 'l1-questions',
        label: { en: 'Answer 3 questions', tl: 'Sagutin ang 3 tanong' },
        type: 'questions',
        target: 3
      },
      {
        id: 'l1-reach',
        label: { en: 'Reach the end', tl: 'Abutin ang dulo' },
        type: 'reach'
      }
    ]
  },
  {
    level: 2,
    encounterId: 'market-puzzle',
    name: { en: 'Level 2 – Narrow Bridge', tl: 'Antas 2 – Makitid na Tulay' },
    objectives: [
      {
        id: 'l2-questions',
        label: { en: 'Answer 6 questions', tl: 'Sagutin ang 6 na tanong' },
        type: 'questions',
        target: 6
      },
      {
        id: 'l2-survive',
        label: { en: "Don't fall", tl: 'Huwag mahulog' },
        type: 'survive'
      }
    ]
  },
  {
    level: 3,
    encounterId: 'ridge-puzzle',
    name: { en: 'Level 3 – Broken Bridge 😱', tl: 'Antas 3 – Sirang Tulay 😱' },
    timerSeconds: 90,
    objectives: [
      {
        id: 'l3-questions',
        label: { en: 'Answer 9 questions', tl: 'Sagutin ang 9 na tanong' },
        type: 'questions',
        target: 9
      },
      {
        id: 'l3-timer',
        label: { en: 'Finish under time', tl: 'Tapusin bago maubos ang oras' },
        type: 'timer'
      }
    ]
  }
];

export type QuizChoice = {
  id: string;
  text: LocalizedText;
  result: LocalizedText;
  isCorrect: boolean;
  effects: Partial<Record<StatKey, number>>;
};

export type QuizQuestion = {
  id: string;
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

export const encounters: Encounter[] = [
  {
    id: 'bridge-puzzle',
    hotspotId: 'bridge',
    level: 1,
    location: { en: 'Bamboo Bridge', tl: 'Tulayang Kawayan' },
    questions: [
      {
        id: 'bridge-q1',
        title: { en: 'The Number Pattern', tl: 'Ang Pattern ng Bilang' },
        body: {
          en: 'A section of planks is marked: 2, 4, 6, ?, 10. Step on the correct plank to cross safely. What is the missing number?',
          tl: 'Ang mga tabla ay may marka: 2, 4, 6, ?, 10. Tumuntong sa tamang tabla para makatawid nang ligtas. Ano ang nawawalang numero?'
        },
        choices: [
          {
            id: 'bridge-q1-correct',
            text: { en: '8 — the pattern increases by 2 each time.', tl: '8 — ang pattern ay nagdaragdag ng 2 sa bawat pagkakataon.' },
            result: { en: 'Correct! You step confidently onto the safe plank.', tl: 'Tama! Tiwala kang tumuntong sa ligtas na tabla.' },
            isCorrect: true,
            effects: { courage: 1 }
          },
          {
            id: 'bridge-q1-wrong',
            text: { en: '7 — roughly midway between 6 and 10.', tl: '7 — halos nasa gitna ng 6 at 10.' },
            result: { en: 'Wrong! The plank cracks and you fall into the river!', tl: 'Mali! Sumibak ang tabla at nahulog ka sa ilog!' },
            isCorrect: false,
            effects: { supplies: -1 }
          }
        ]
      },
      {
        id: 'bridge-q2',
        title: { en: 'The Weight Riddle', tl: 'Ang Palaisipan ng Bigat' },
        body: {
          en: 'The bridge keeper asks: "Which is heavier — 1 kg of bamboo or 1 kg of stone?"',
          tl: 'Tinanong ng tagabantay ng tulay: "Alin ang mas mabigat — 1 kg na kawayan o 1 kg na bato?"'
        },
        choices: [
          {
            id: 'bridge-q2-correct',
            text: { en: 'They weigh the same — both are 1 kg.', tl: 'Magkapantay ang bigat — parehong 1 kg.' },
            result: { en: 'Correct! The keeper nods and lets you pass.', tl: 'Tama! Tumango ang tagabantay at pinayagan ka niyang makaraan.' },
            isCorrect: true,
            effects: { trust: 1 }
          },
          {
            id: 'bridge-q2-wrong',
            text: { en: 'Stone is heavier — it is denser.', tl: 'Mas mabigat ang bato — mas siksik ito.' },
            result: { en: 'Wrong! The keeper shakes his head. You lose your footing!', tl: 'Mali! Umiling ang tagabantay. Natisod ka!' },
            isCorrect: false,
            effects: { supplies: -1 }
          }
        ]
      },
      {
        id: 'bridge-q3',
        title: { en: 'The Banana Trick', tl: 'Ang Trick ng Saging' },
        body: {
          en: 'You see 5 bananas on the bridge. You take away 3. How many bananas do YOU now have?',
          tl: 'Nakakita ka ng 5 saging sa tulay. Kinuha mo ang 3. Ilan na saging ang MAYROON KA ngayon?'
        },
        choices: [
          {
            id: 'bridge-q3-correct',
            text: { en: '3 — I took 3, so I have 3.', tl: '3 — kinuha ko ang 3, kaya mayroon akong 3.' },
            result: { en: 'Correct! You cross the first section of the bamboo bridge!', tl: 'Tama! Natawid mo ang unang bahagi ng tulayang kawayan!' },
            isCorrect: true,
            effects: { courage: 1, trust: 1 }
          },
          {
            id: 'bridge-q3-wrong',
            text: { en: '2 — 5 minus 3 equals 2.', tl: '2 — 5 minus 3 ay katumbas ng 2.' },
            result: { en: 'Wrong! The trick was about what YOU have, not what remains on the bridge!', tl: 'Mali! Ang trick ay tungkol sa kung ano ang MAYROON KA, hindi kung ano ang naiwan sa tulay!' },
            isCorrect: false,
            effects: { supplies: -1 }
          }
        ]
      }
    ]
  },
  {
    id: 'market-puzzle',
    hotspotId: 'market',
    level: 2,
    location: { en: 'Forest Clearing', tl: 'Kaparangan sa Kagubatan' },
    questions: [
      {
        id: 'market-q1',
        title: { en: "The Merchant's Riddle", tl: 'Palaisipan ng Mangangalakal' },
        body: {
          en: '"I am thinking of a number. Double it, then add 4, and you get 14. What is my number?" the merchant asks, blocking the path.',
          tl: '"Nag-iisip ako ng numero. I-doble ito, pagkatapos ay dagdag ng 4, at makukuha mo ang 14. Ano ang aking numero?" tanong ng mangangalakal, hinahadlangan ang daan.'
        },
        choices: [
          {
            id: 'market-q1-correct',
            text: { en: '5 — if 2x + 4 = 14, then x = 5.', tl: '5 — kung 2x + 4 = 14, kung gayon x = 5.' },
            result: { en: 'Correct! The merchant steps aside, impressed by your quick thinking.', tl: 'Tama! Lumayo ang mangangalakal, humanga sa iyong mabilis na pag-iisip.' },
            isCorrect: true,
            effects: { trust: 1 }
          },
          {
            id: 'market-q1-wrong',
            text: { en: '9 — half of 14 rounded up.', tl: '9 — kalahati ng 14 na pinataas.' },
            result: { en: 'Wrong! You stumble on the crossing!', tl: 'Mali! Natisod ka sa tawiran!' },
            isCorrect: false,
            effects: { supplies: -1 }
          }
        ]
      },
      {
        id: 'market-q2',
        title: { en: 'The Bamboo Pole', tl: 'Ang Kawayan' },
        body: {
          en: 'A bamboo pole is cut in half. Then each half is cut in half again. How many pieces are there in total?',
          tl: 'Ang isang kawayan ay pinutol sa kalahati. Pagkatapos, ang bawat kalahati ay pinutol muli sa kalahati. Ilan na piraso sa kabuuan?'
        },
        choices: [
          {
            id: 'market-q2-correct',
            text: { en: '4 pieces — each cut doubles the count.', tl: '4 piraso — ang bawat putol ay nagdodoble ng bilang.' },
            result: { en: 'Correct! You count the pieces and move forward.', tl: 'Tama! Binilang mo ang mga piraso at sumusulong ka.' },
            isCorrect: true,
            effects: { courage: 1 }
          },
          {
            id: 'market-q2-wrong',
            text: { en: '2 pieces — cut in half means 2.', tl: '2 piraso — ang pagputol sa kalahati ay nangangahulugang 2.' },
            result: { en: 'Wrong! You miscounted and lost your balance!', tl: 'Mali! Nagkamali ka sa pagbilang at nawala ang iyong balanse!' },
            isCorrect: false,
            effects: { supplies: -1 }
          }
        ]
      },
      {
        id: 'market-q3',
        title: { en: 'The Day Puzzle', tl: 'Palaisipan ng Araw' },
        body: {
          en: 'Today is Wednesday. Your village celebration is in exactly 3 days. What day is it?',
          tl: 'Ngayon ay Miyerkules. Ang selebrasyon ng iyong nayon ay sa loob ng eksaktong 3 araw. Anong araw iyon?'
        },
        choices: [
          {
            id: 'market-q3-correct',
            text: { en: 'Saturday — Wednesday + 3 days.', tl: 'Sabado — Miyerkules + 3 araw.' },
            result: { en: 'Correct! You mark the day and push forward across the clearing.', tl: 'Tama! Minarkahan mo ang araw at sumusulong sa kaparangan.' },
            isCorrect: true,
            effects: { trust: 1, courage: 1 }
          },
          {
            id: 'market-q3-wrong',
            text: { en: 'Friday — Wednesday + 2 days.', tl: 'Biyernes — Miyerkules + 2 araw.' },
            result: { en: 'Wrong! You confused the days and stumbled!', tl: 'Mali! Nalito ka sa mga araw at natisod!' },
            isCorrect: false,
            effects: { supplies: -1 }
          }
        ]
      }
    ]
  },
  {
    id: 'ridge-puzzle',
    hotspotId: 'ridge',
    level: 3,
    location: { en: 'Final Crossing', tl: 'Huling Tawiran' },
    questions: [
      {
        id: 'ridge-q1',
        title: { en: "The Elder's Logic Test", tl: 'Pagsubok ng Lohika ng Matanda' },
        body: {
          en: '"If it rains, the river rises. The river has risen. Did it necessarily rain?" the elder asks, hand on the final plank.',
          tl: '"Kung umulan, ang ilog ay tataas. Ang ilog ay tumaas na. Kailangan bang umulan?" tanong ng matanda, kamay sa huling tabla.'
        },
        choices: [
          {
            id: 'ridge-q1-correct',
            text: { en: 'Not necessarily — something else could have raised the river.', tl: 'Hindi kinakailangan — may iba pang bagay na maaaring nagtaas ng ilog.' },
            result: { en: 'Correct! The elder smiles and lifts the first plank for you.', tl: 'Tama! Ngumiti ang matanda at itinaas ang unang tabla para sa iyo.' },
            isCorrect: true,
            effects: { trust: 1 }
          },
          {
            id: 'ridge-q1-wrong',
            text: { en: 'Yes — if the river rose, it must have rained.', tl: 'Oo — kung tumaas ang ilog, dapat ay umulan.' },
            result: { en: 'Wrong! That is a logical fallacy. You stumble on the final crossing!', tl: 'Mali! Iyon ay isang lohikal na kamalian. Natisod ka sa huling tawiran!' },
            isCorrect: false,
            effects: { supplies: -1 }
          }
        ]
      },
      {
        id: 'ridge-q2',
        title: { en: 'The Animal Syllogism', tl: 'Ang Syllogism ng Hayop' },
        body: {
          en: '"All tigers are animals. All animals need food. Do all tigers need food?" the elder asks with a knowing smile.',
          tl: '"Lahat ng tigre ay hayop. Lahat ng hayop ay nangangailangan ng pagkain. Kailangan ba ng pagkain ng lahat ng tigre?" tanong ng matanda nang may ngiting pamilyar.'
        },
        choices: [
          {
            id: 'ridge-q2-correct',
            text: { en: 'Yes — this follows logically from both statements.', tl: 'Oo — ito ay lohikal na sumusunod sa parehong pahayag.' },
            result: { en: 'Correct! The elder nods. A valid syllogism — well done!', tl: 'Tama! Tumango ang matanda. Isang wastong syllogism — magaling!' },
            isCorrect: true,
            effects: { courage: 1 }
          },
          {
            id: 'ridge-q2-wrong',
            text: { en: 'Not necessarily — tigers might be exceptions.', tl: 'Hindi kinakailangan — maaaring may eksepsyon ang mga tigre.' },
            result: { en: 'Wrong! Tigers cannot escape logic — or the plank!', tl: 'Mali! Hindi makakatakas ang mga tigre sa lohika — o sa tabla!' },
            isCorrect: false,
            effects: { supplies: -1 }
          }
        ]
      },
      {
        id: 'ridge-q3',
        title: { en: 'The Final Riddle', tl: 'Ang Huling Palaisipan' },
        body: {
          en: 'The elder smiles mischievously: "A rooster sits at the peak of a roof and lays an egg. Which side does the egg roll down?"',
          tl: 'Nakangiti ang matanda nang may kalokohan: "Ang isang tandang ay nakaupo sa tuktok ng bubong at nagitlog. Saan bahagi ng bubong naggugulong ang itlog?"'
        },
        choices: [
          {
            id: 'ridge-q3-correct',
            text: { en: 'Roosters do not lay eggs!', tl: 'Hindi nagitlog ang mga tandang!' },
            result: { en: 'Correct! The elder laughs. "You have crossed the bridge!" 🎉', tl: 'Tama! Malakas na natawa ang matanda. "Natawid mo na ang tulay!" 🎉' },
            isCorrect: true,
            effects: { trust: 2, supplies: 1 }
          },
          {
            id: 'ridge-q3-wrong',
            text: { en: 'The left side — it is the windward side.', tl: 'Ang kaliwang bahagi — iyon ang gawi ng hangin.' },
            result: { en: 'Wrong! A rooster cannot lay eggs. You stumble at the last hurdle!', tl: 'Mali! Hindi magagawa ng tandang na magitlog. Natisod ka sa huling sagabal!' },
            isCorrect: false,
            effects: { supplies: -1 }
          }
        ]
      }
    ]
  },
  {
    id: 'bamboo-bridge-logic',
    hotspotId: 'bridge',
    level: 4,
    location: { en: 'Bamboo Bridge', tl: 'Tulayang Kawayan' },
    questions: [
      {
        id: 'bbl-q1',
        title: { en: 'The Crossing Order', tl: 'Ang Pagkakasunod ng Pagtawid' },
        body: {
          en: 'Three neighbors must cross: a vendor with heavy sacks, a weak-kneed elder, and a mother with an infant. The bridge holds only two people. The cracked center plank worsens with each crossing. Who should go first to keep everyone safe?',
          tl: 'Tatlong kapitbahay ang kailangang tumawid: isang tindera na may mabibigat na sako, isang matandang mahina ang tuhod, at isang ina na may sanggol. Dalawang tao lamang ang kaya ng tulay. Lumalala ang bitak sa gitna sa bawat pagtawid. Sino ang dapat mauna para mapanatiling ligtas ang lahat?'
        },
        choices: [
          {
            id: 'bbl-q1-correct',
            text: {
              en: 'Elder first (lightest load), then mother and infant, then vendor alone with the heavy sacks.',
              tl: 'Matanda muna (pinakamababa ang bigat), saka ina at sanggol, pagkatapos tindera nang mag-isa kasama ang mabibigat na sako.'
            },
            result: {
              en: 'Correct! Everyone crosses safely and the vendor praises your clear thinking.',
              tl: 'Tama! Ligtas na nakatawid ang lahat at pinuri ng tindera ang iyong malinaw na pag-iisip.'
            },
            isCorrect: true,
            effects: { trust: 2, courage: 1 }
          },
          {
            id: 'bbl-q1-wrong',
            text: {
              en: 'Vendor first to clear the heavy load quickly, then the others together.',
              tl: 'Tindera muna para mabilis na malis ang mabigat na kargamento, saka ang iba nang sabay.'
            },
            result: {
              en: 'Wrong! The heavy load widens the crack and the remaining two cannot cross safely.',
              tl: 'Mali! Pinalawak ng mabigat na kargamento ang bitak at hindi na ligtas na makatawid ang dalawa pang natira.'
            },
            isCorrect: false,
            effects: { supplies: -1 }
          }
        ]
      },
      {
        id: 'bbl-q2',
        title: { en: 'One Torch, Four People', tl: 'Isang Sulo, Apat na Tao' },
        body: {
          en: 'It is night. Four people must cross the bridge with one torch. The bridge holds two at a time. Crossing times: 1 min, 2 min, 5 min, 10 min. A pair moves at the slower person\'s pace. What is the fastest total time to get everyone across?',
          tl: 'Gabi na. Apat na tao ang kailangang tumawid sa tulay na may isang sulo. Dalawa lang ang kasya sa tulay nang sabay. Oras ng pagtawid: 1 min, 2 min, 5 min, 10 min. Ang bilis ng magkasamang nagtawid ay ayon sa mas mabagal. Ano ang pinakamabilis na kabuuang oras para makatawid ang lahat?'
        },
        choices: [
          {
            id: 'bbl-q2-correct',
            text: {
              en: '17 minutes — send 1+2 across (2 min), return 1 (1 min), send 5+10 (10 min), return 2 (2 min), send 1+2 (2 min).',
              tl: '17 minuto — ipadala ang 1+2 (2 min), ibalik ang 1 (1 min), ipadala ang 5+10 (10 min), ibalik ang 2 (2 min), ipadala ang 1+2 (2 min).'
            },
            result: {
              en: 'Correct! Your logical sequence gets everyone across in the shortest time.',
              tl: 'Tama! Ang iyong lohikal na pagkakasunod ay nagpakatawid sa lahat sa pinakamaikling oras.'
            },
            isCorrect: true,
            effects: { courage: 2, trust: 1 }
          },
          {
            id: 'bbl-q2-wrong',
            text: {
              en: '19 minutes — always send the fastest person back with the torch.',
              tl: '19 minuto — palaging ibalik ang pinakamabilis na tao kasama ang sulo.'
            },
            result: {
              en: 'Wrong! That greedy approach wastes two extra minutes — the smarter pairing saves time.',
              tl: 'Mali! Ang pamamaraang iyon ay nasasayang ng dalawang minuto — ang mas matalinong pagpapares ay nakakatipid ng oras.'
            },
            isCorrect: false,
            effects: { supplies: -1 }
          }
        ]
      },
      {
        id: 'bbl-q3',
        title: { en: 'The Plank and the Goat', tl: 'Ang Tabla at ang Kambing' },
        body: {
          en: 'A farmer must cross the bridge with a goat, a bundle of rice stalks, and a dog. The bridge holds only the farmer and one item at a time. Left alone: the dog chases the goat, the goat eats the rice. How does the farmer get everything across?',
          tl: 'Isang magsasaka ang kailangang tumawid kasama ang isang kambing, isang bigkis ng palay, at isang aso. Ang tulay ay kaya lamang ng magsasaka at isang bagay nang sabay. Kapag nag-iisa: hinahabol ng aso ang kambing, kinakain ng kambing ang palay. Paano makakakuha ng lahat ang magsasaka sa kabilang ibayo?'
        },
        choices: [
          {
            id: 'bbl-q3-correct',
            text: {
              en: 'Take the goat over first, return alone, take the rice over, bring the goat back, take the dog over, return alone, take the goat over.',
              tl: 'Isawid muna ang kambing, bumalik nang mag-isa, isawid ang palay, ibalik ang kambing, isawid ang aso, bumalik nang mag-isa, isawid ang kambing.'
            },
            result: {
              en: 'Correct! The classic river-crossing solution — the farmer arrives with everything intact.',
              tl: 'Tama! Ang klasikong solusyon sa pagtawid sa ilog — dumating ang magsasaka nang buo ang lahat.'
            },
            isCorrect: true,
            effects: { trust: 2, supplies: 1 }
          },
          {
            id: 'bbl-q3-wrong',
            text: {
              en: 'Take the dog first, then the rice, then return for the goat.',
              tl: 'Isawid muna ang aso, saka ang palay, pagkatapos ay bumalik para sa kambing.'
            },
            result: {
              en: 'Wrong! The goat eats all the rice while you are gone with the dog.',
              tl: 'Mali! Kinain ng kambing ang lahat ng palay habang wala ka kasama ang aso.'
            },
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
