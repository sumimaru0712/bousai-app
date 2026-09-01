import { createId } from "./id";
import type { DangerCategory, DangerMark } from "./types";

type CatalogEntry = Omit<
  DangerMark,
  "id" | "x" | "y" | "category" | "checkedBy" | "resolvedAt"
>;

const DANGER_CATALOG: Record<DangerCategory, CatalogEntry> = {
  furniture: {
    title: {
      grandparent: "家具の転倒",
      grandchild: "たおれる かぐ",
    },
    description: {
      grandparent:
        "背の高い家具が固定されていないと、地震のゆれで倒れてくるおそれがあります。",
      grandchild:
        "せの たかい かぐが とめて いないと、じしんの ゆれで たおれてくるかも しれません。",
    },
    advice: {
      grandparent: "突っ張り棒や金具で、天井や壁にしっかり固定しましょう。",
      grandchild: "つっぱりぼうや かなぐで、てんじょうや かべに しっかり とめましょう。",
    },
    detail: {
      grandparent:
        "本棚やタンス、食器棚など背の高い家具が壁や天井に固定されていないと、大きな地震のゆれで手前に倒れてくることがあります。特に、寝る場所やよく座る場所の近くにある家具は注意が必要です。倒れた家具の下じきになると、逃げ遅れの原因にもなります。",
      grandchild:
        "ほんだなや たんす、しょっきだななど せの たかい かぐが かべや てんじょうに とめて いないと、おおきな じしんの ゆれで てまえに たおれてくることが あります。とくに、ねる ばしょや よく すわる ばしょの ちかくに ある かぐは きを つけましょう。たおれた かぐの したじきに なると、にげおくれる げんいんにも なります。",
    },
    points: [
      {
        grandparent: "背の高い家具は壁や天井に固定する",
        grandchild: "せの たかい かぐは かべや てんじょうに とめる",
      },
      {
        grandparent: "寝る場所の近くには倒れやすい家具を置かない",
        grandchild: "ねる ばしょの ちかくには たおれやすい かぐを おかない",
      },
      {
        grandparent: "重い物ほど下に、軽い物ほど上に収納する",
        grandchild: "おもい ものほど した、かるい ものほど うえに しまう",
      },
    ],
    fixes: [
      {
        name: {
          grandparent: "突っ張り棒（つっぱり棒）",
          grandchild: "つっぱりぼう",
        },
        note: {
          grandparent: "家具と天井のあいだに取り付けて、たおれるのをふせぎます。",
          grandchild: "かぐと てんじょうの あいだに つけて、たおれるのを ふせぎます。",
        },
      },
      {
        name: {
          grandparent: "L字金具",
          grandchild: "かべに とめる きんぐ",
        },
        note: {
          grandparent: "家具を壁にネジで固定します。もっとも効果が高い方法です。",
          grandchild: "かぐを かべに ねじで とめます。いちばん つよい ほうほうです。",
        },
      },
      {
        name: {
          grandparent: "耐震マット・ジェル",
          grandchild: "すべりどめ マット",
        },
        note: {
          grandparent: "家具の下に貼るだけで、すべりにくくなります。",
          grandchild: "かぐの したに はるだけで、すべりにくく なります。",
        },
      },
    ],
  },
  glass: {
    title: {
      grandparent: "ガラスの飛散",
      grandchild: "われる ガラス",
    },
    description: {
      grandparent:
        "窓や食器棚のガラスが割れると、破片が飛び散ってケガのおそれがあります。",
      grandchild:
        "まどや しょっきだなの ガラスが われると、かけらが とびちって けがを するかも しれません。",
    },
    advice: {
      grandparent: "飛散防止フィルムを貼っておくと安心です。",
      grandchild: "われても とびちらない フィルムを はっておくと あんしんです。",
    },
    detail: {
      grandparent:
        "窓ガラスや食器棚のガラス戸は、地震のゆれで割れてしまうことがあります。割れたガラスの破片は鋭く、素足で歩くとケガをしてしまいます。夜間の地震では暗くて破片に気づきにくいため、特に注意が必要です。",
      grandchild:
        "まどガラスや しょっきだなの ガラスとびらは、じしんの ゆれで われてしまうことが あります。われた ガラスの かけらは するどく、はだしで あるくと けがを してしまいます。よるの じしんでは くらくて かけらに きづきにくいので、とくに きを つけましょう。",
    },
    points: [
      {
        grandparent: "窓や食器棚に飛散防止フィルムを貼る",
        grandchild: "まどや しょっきだなに われても とびちらない フィルムを はる",
      },
      {
        grandparent: "割れやすい戸には厚手のカーテンをかける",
        grandchild: "われやすい とびらには あつい カーテンを かける",
      },
      {
        grandparent: "夜でも安全に歩けるよう、スリッパを近くに置く",
        grandchild: "よるでも あんぜんに あるけるように、スリッパを ちかくに おく",
      },
    ],
    fixes: [
      {
        name: {
          grandparent: "飛散防止フィルム",
          grandchild: "われても とびちらない フィルム",
        },
        note: {
          grandparent:
            "窓やガラス戸に貼るだけで、割れても破片が飛び散りにくくなります。",
          grandchild:
            "まどや ガラスとびらに はるだけで、われても かけらが とびちりにくく なります。",
        },
      },
      {
        name: {
          grandparent: "厚手のカーテン",
          grandchild: "あつい カーテン",
        },
        note: {
          grandparent: "しめておくと、破片が部屋の中に飛び散るのをやわらげます。",
          grandchild: "しめておくと、かけらが おへやの なかに とびちるのを やわらげます。",
        },
      },
      {
        name: {
          grandparent: "スリッパを近くに置く",
          grandchild: "スリッパを ちかくに おく",
        },
        note: {
          grandparent: "万が一割れても、足のケガをふせげます。",
          grandchild: "われても、あしの けがを ふせげます。",
        },
      },
    ],
  },
  "escape-route": {
    title: {
      grandparent: "避難経路をふさぐ物",
      grandchild: "にげみちを ふさぐ もの",
    },
    description: {
      grandparent:
        "出入口の前に物があると、逃げるときにつまずいたり、通れなくなったりします。",
      grandchild:
        "でいりぐちの まえに ものが あると、にげるときに つまずいたり、とおれなく なったりします。",
    },
    advice: {
      grandparent: "出入口の前は、いつも物を置かないようにしましょう。",
      grandchild: "でいりぐちの まえには、いつも ものを おかないように しましょう。",
    },
    detail: {
      grandparent:
        "玄関やドアの前、廊下などに物が置かれていると、地震のゆれで倒れてきて通り道をふさいでしまうことがあります。暗い中であわてて逃げるときにつまずくと、大きなケガにつながるおそれがあります。",
      grandchild:
        "げんかんや ドアの まえ、ろうかなどに ものが おかれていると、じしんの ゆれで たおれてきて とおりみちを ふさいでしまうことが あります。くらい なかで あわてて にげるときに つまずくと、おおきな けがに つながるかも しれません。",
    },
    points: [
      {
        grandparent: "出入口や廊下には物を置かない",
        grandchild: "でいりぐちや ろうかには ものを おかない",
      },
      {
        grandparent: "停電にそなえて足元灯を用意する",
        grandchild: "でんきが きえたときの ために あしもとの ライトを よういする",
      },
      {
        grandparent: "すぐ履けるように靴を玄関に置いておく",
        grandchild: "すぐ はけるように くつを げんかんに おいておく",
      },
    ],
    fixes: [
      {
        name: {
          grandparent: "通り道には物を置かない",
          grandchild: "とおりみちには ものを おかない",
        },
        note: {
          grandparent: "出入口や廊下は、いつもあけておく習慣をつけましょう。",
          grandchild: "でいりぐちや ろうかは、いつも あけておく くせを つけましょう。",
        },
      },
      {
        name: {
          grandparent: "足元灯（フットライト）",
          grandchild: "あしもとを てらす ライト",
        },
        note: {
          grandparent:
            "停電しても足元が見えるように、電池式のライトを置いておきます。",
          grandchild:
            "でんきが きえても あしもとが みえるように、でんちの ライトを おいておきます。",
        },
      },
      {
        name: {
          grandparent: "スリッパ・靴を玄関に用意",
          grandchild: "スリッパや くつを げんかんに よういする",
        },
        note: {
          grandparent: "割れた物の上を歩いても足を守れます。",
          grandchild: "われた ものの うえを あるいても あしを まもれます。",
        },
      },
    ],
  },
  "fall-object": {
    title: {
      grandparent: "落ちてきそうな物",
      grandchild: "おちてきそうな もの",
    },
    description: {
      grandparent:
        "高いところに置かれた物は、ゆれで落ちてきてケガの原因になります。",
      grandchild:
        "たかい ところに おかれた ものは、ゆれで おちてきて けがの げんいんに なります。",
    },
    advice: {
      grandparent: "重い物や割れやすい物は、なるべく低いところに置きましょう。",
      grandchild: "おもい ものや われやすい ものは、なるべく ひくい ところに おきましょう。",
    },
    detail: {
      grandparent:
        "棚の上や高い場所に置かれた本、置物、家電などは、地震のゆれで落下することがあります。寝ている場所の近くや、よく通る場所の上に物があると、落下してきたときに大きなケガをするおそれがあります。",
      grandchild:
        "たなの うえや たかい ばしょに おかれた ほん、おきもの、かでんなどは、じしんの ゆれで おちてくることが あります。ねている ばしょの ちかくや、よく とおる ばしょの うえに ものが あると、おちてきたときに おおきな けがを するかも しれません。",
    },
    points: [
      {
        grandparent: "高い場所には重い物を置かない",
        grandchild: "たかい ばしょには おもい ものを おかない",
      },
      {
        grandparent: "棚には滑り止めシートを敷く",
        grandchild: "たなには すべりどめ シートを しく",
      },
      {
        grandparent: "収納扉が開かないようストッパーをつける",
        grandchild: "とびらが あかないように ストッパーを つける",
      },
    ],
    fixes: [
      {
        name: {
          grandparent: "重い物は下の段へ",
          grandchild: "おもい ものは したの だんへ",
        },
        note: {
          grandparent: "本や置物は、できるだけ低い場所にしまいましょう。",
          grandchild: "ほんや おきものは、できるだけ ひくい ばしょに しまいましょう。",
        },
      },
      {
        name: {
          grandparent: "滑り止めシート",
          grandchild: "すべりどめ シート",
        },
        note: {
          grandparent: "棚の上に敷くと、物がすべり落ちにくくなります。",
          grandchild: "たなの うえに しくと、ものが すべりおちにくく なります。",
        },
      },
      {
        name: {
          grandparent: "収納扉に耐震ラッチ",
          grandchild: "とびらに つける ストッパー",
        },
        note: {
          grandparent: "ゆれで扉が開いて中身が飛び出すのをふせぎます。",
          grandchild: "ゆれで とびらが あいて なかみが とびだすのを ふせぎます。",
        },
      },
    ],
  },
};

const DANGER_CATEGORIES = Object.keys(DANGER_CATALOG) as DangerCategory[];

function randomPosition(): number {
  return 15 + Math.random() * 70;
}

export function generateDiagnosis(): DangerMark[] {
  const shuffled = [...DANGER_CATEGORIES].sort(() => Math.random() - 0.5);
  const count = 2 + Math.floor(Math.random() * 2);
  return shuffled.slice(0, count).map((category) => ({
    ...DANGER_CATALOG[category],
    id: createId(),
    category,
    x: randomPosition(),
    y: randomPosition(),
    checkedBy: { grandchild: false, grandparent: false },
    resolvedAt: null,
  }));
}
