export interface QuizQuestion {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "water",
    question: "非常用の飲料水は、1人あたり何日分そなえておくとよい？",
    choices: ["1日分", "3日分", "1週間分"],
    correctIndex: 1,
    explanation: "最低でも3日分（できれば1週間分）の水をそなえておくと安心です。",
  },
  {
    id: "shake",
    question: "地震のゆれを感じたら、まず何をする？",
    choices: [
      "すぐに外へ走って逃げる",
      "机の下などで頭を守る",
      "エレベーターで下の階へ行く",
    ],
    correctIndex: 1,
    explanation: "まずは机の下などにかくれて、頭と体を守ることが大切です。",
  },
  {
    id: "furniture",
    question: "家具の転倒をふせぐために、効果が高いのはどれ？",
    choices: ["L字金具で壁に固定する", "上に軽い物をのせる", "少し離して置く"],
    correctIndex: 0,
    explanation: "L字金具で壁や天井にしっかり固定するのが、もっとも効果的です。",
  },
  {
    id: "bag",
    question: "非常持ち出し袋は、どこに置いておくとよい？",
    choices: [
      "おし入れのおくの方",
      "玄関などすぐ持ち出せる場所",
      "2階の物置部屋"
    ],
    correctIndex: 1,
    explanation: "すぐに持ち出せるよう、玄関や寝室の近くに置いておきましょう。",
  },
  {
    id: "safety",
    question: "地震のあと、家族の安否を伝えるのに便利なのは？",
    choices: [
      "災害用伝言サービスやアプリでの安否確認",
      "全員で同じ電話に何度もかけ続ける",
      "とくに連絡はしなくてよい",
    ],
    correctIndex: 0,
    explanation:
      "電話がつながりにくいときも、災害用伝言サービスやアプリなら安否を伝えやすくなります。",
  },
];

export interface BagItem {
  id: string;
  label: string;
  emoji: string;
  correct: boolean;
  note: string;
}

export const BAG_ITEMS: BagItem[] = [
  {
    id: "water",
    label: "水",
    emoji: "💧",
    correct: true,
    note: "からだに欠かせないので、まず用意しましょう。",
  },
  {
    id: "food",
    label: "食料",
    emoji: "🍞",
    correct: true,
    note: "電気や水道が止まっても食べられる物を用意しましょう。",
  },
  {
    id: "flashlight",
    label: "懐中電灯",
    emoji: "🔦",
    correct: true,
    note: "停電したときに、足もとを照らせます。",
  },
  {
    id: "radio",
    label: "携帯ラジオ",
    emoji: "📻",
    correct: true,
    note: "電気が止まっても、災害の情報を聞けます。",
  },
  {
    id: "firstaid",
    label: "救急セット",
    emoji: "🩹",
    correct: true,
    note: "ケガをしたときの手当てに使います。",
  },
  {
    id: "battery",
    label: "モバイルバッテリー",
    emoji: "🔋",
    correct: true,
    note: "スマホや懐中電灯を充電できます。",
  },
  {
    id: "medicine",
    label: "常備薬",
    emoji: "💊",
    correct: true,
    note: "持病がある人は、切らさないようにしましょう。",
  },
  {
    id: "cash",
    label: "現金",
    emoji: "💰",
    correct: true,
    note: "停電するとカードや電子マネーが使えないことがあります。",
  },
  {
    id: "game",
    label: "ゲーム機",
    emoji: "🎮",
    correct: false,
    note: "遊び道具は、避難のときは持たなくて大丈夫です。",
  },
  {
    id: "toy",
    label: "ぬいぐるみ",
    emoji: "🧸",
    correct: false,
    note: "大切な物だけど、避難のときに必要な物ではありません。",
  },
  {
    id: "cake",
    label: "ケーキ",
    emoji: "🍰",
    correct: false,
    note: "日もちしないので、非常食には向きません。",
  },
  {
    id: "tv",
    label: "テレビ",
    emoji: "📺",
    correct: false,
    note: "大きくて重く、持ち出して逃げることができません。",
  },
];

export const BAG_GAME_SECONDS = 20;

export interface RoomHazardItem {
  id: string;
  label: string;
  emoji: string;
  hazard: boolean;
  note: string;
}

export const ROOM_ITEMS: RoomHazardItem[] = [
  {
    id: "bookshelf",
    label: "固定されていない本棚",
    emoji: "📚",
    hazard: true,
    note: "地震のゆれで倒れてくるおそれがあります。",
  },
  {
    id: "window",
    label: "フィルムのない窓ガラス",
    emoji: "🪟",
    hazard: true,
    note: "割れると、ガラスの破片が飛び散ります。",
  },
  {
    id: "boxes",
    label: "棚の上の重い箱",
    emoji: "📦",
    hazard: true,
    note: "ゆれで落ちてきて、ケガの原因になります。",
  },
  {
    id: "doorway",
    label: "出入口の前の物",
    emoji: "🚪",
    hazard: true,
    note: "逃げるときに、つまずいたり通れなくなったりします。",
  },
  {
    id: "cabinet",
    label: "ガラス扉の食器棚",
    emoji: "🗄️",
    hazard: true,
    note: "扉が開いて、食器が飛び出すことがあります。",
  },
  {
    id: "bed",
    label: "ベッド",
    emoji: "🛏️",
    hazard: false,
    note: "それ自体は倒れてくる心配が少ないです。",
  },
  {
    id: "plant",
    label: "観葉植物",
    emoji: "🪴",
    hazard: false,
    note: "軽いので、大きな危険にはなりにくいです。",
  },
  {
    id: "lamp",
    label: "電気スタンド",
    emoji: "💡",
    hazard: false,
    note: "低い位置にあれば、大きな危険にはなりにくいです。",
  },
  {
    id: "toy",
    label: "ぬいぐるみ",
    emoji: "🧸",
    hazard: false,
    note: "落ちてきても、ケガの心配はほぼありません。",
  },
  {
    id: "picture",
    label: "かべの絵",
    emoji: "🖼️",
    hazard: false,
    note: "しっかり固定されていれば、危険は少ないです。",
  },
];

export const ROOM_GAME_SECONDS = 20;
