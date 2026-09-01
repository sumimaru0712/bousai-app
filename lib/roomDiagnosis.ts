import { createId } from "./id";
import type { DangerMark } from "./types";

const DANGER_CATALOG: Omit<
  DangerMark,
  "id" | "x" | "y" | "checkedBy" | "resolvedAt"
>[] = [
  {
    category: "furniture",
    title: "家具の転倒",
    description:
      "背の高い家具が固定されていないと、地震のゆれで倒れてくるおそれがあります。",
    advice: "突っ張り棒や金具で、天井や壁にしっかり固定しましょう。",
    detail:
      "本棚やタンス、食器棚など背の高い家具が壁や天井に固定されていないと、大きな地震のゆれで手前に倒れてくることがあります。特に、寝る場所やよく座る場所の近くにある家具は注意が必要です。倒れた家具の下じきになると、逃げ遅れの原因にもなります。",
    fixes: [
      {
        name: "突っ張り棒（つっぱり棒）",
        note: "家具と天井のあいだに取り付けて、たおれるのをふせぎます。",
      },
      {
        name: "L字金具",
        note: "家具を壁にネジで固定します。もっとも効果が高い方法です。",
      },
      {
        name: "耐震マット・ジェル",
        note: "家具の下に貼るだけで、すべりにくくなります。",
      },
    ],
  },
  {
    category: "glass",
    title: "ガラスの飛散",
    description:
      "窓や食器棚のガラスが割れると、破片が飛び散ってケガのおそれがあります。",
    advice: "飛散防止フィルムを貼っておくと安心です。",
    detail:
      "窓ガラスや食器棚のガラス戸は、地震のゆれで割れてしまうことがあります。割れたガラスの破片は鋭く、素足で歩くとケガをしてしまいます。夜間の地震では暗くて破片に気づきにくいため、特に注意が必要です。",
    fixes: [
      {
        name: "飛散防止フィルム",
        note: "窓やガラス戸に貼るだけで、割れても破片が飛び散りにくくなります。",
      },
      {
        name: "厚手のカーテン",
        note: "しめておくと、破片が部屋の中に飛び散るのをやわらげます。",
      },
      {
        name: "スリッパを近くに置く",
        note: "万が一割れても、足のケガをふせげます。",
      },
    ],
  },
  {
    category: "escape-route",
    title: "避難経路をふさぐ物",
    description:
      "出入口の前に物があると、逃げるときにつまずいたり、通れなくなったりします。",
    advice: "出入口の前は、いつも物を置かないようにしましょう。",
    detail:
      "玄関やドアの前、廊下などに物が置かれていると、地震のゆれで倒れてきて通り道をふさいでしまうことがあります。暗い中であわてて逃げるときにつまずくと、大きなケガにつながるおそれがあります。",
    fixes: [
      {
        name: "通り道には物を置かない",
        note: "出入口や廊下は、いつもあけておく習慣をつけましょう。",
      },
      {
        name: "足元灯（フットライト）",
        note: "停電しても足元が見えるように、電池式のライトを置いておきます。",
      },
      {
        name: "スリッパ・靴を玄関に用意",
        note: "割れた物の上を歩いても足を守れます。",
      },
    ],
  },
  {
    category: "fall-object",
    title: "落ちてきそうな物",
    description:
      "高いところに置かれた物は、ゆれで落ちてきてケガの原因になります。",
    advice: "重い物や割れやすい物は、なるべく低いところに置きましょう。",
    detail:
      "棚の上や高い場所に置かれた本、置物、家電などは、地震のゆれで落下することがあります。寝ている場所の近くや、よく通る場所の上に物があると、落下してきたときに大きなケガをするおそれがあります。",
    fixes: [
      {
        name: "重い物は下の段へ",
        note: "本や置物は、できるだけ低い場所にしまいましょう。",
      },
      {
        name: "滑り止めシート",
        note: "棚の上に敷くと、物がすべり落ちにくくなります。",
      },
      {
        name: "収納扉に耐震ラッチ",
        note: "ゆれで扉が開いて中身が飛び出すのをふせぎます。",
      },
    ],
  },
];

function randomPosition(): number {
  return 15 + Math.random() * 70;
}

export function generateDiagnosis(): DangerMark[] {
  const shuffled = [...DANGER_CATALOG].sort(() => Math.random() - 0.5);
  const count = 2 + Math.floor(Math.random() * 2);
  return shuffled.slice(0, count).map((item) => ({
    ...item,
    id: createId(),
    x: randomPosition(),
    y: randomPosition(),
    checkedBy: { grandchild: false, grandparent: false },
    resolvedAt: null,
  }));
}
