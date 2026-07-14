import { createId } from "./id";
import type { DangerMark } from "./types";

const DANGER_CATALOG: Omit<DangerMark, "id" | "x" | "y">[] = [
  {
    category: "furniture",
    title: "家具の転倒",
    description:
      "背の高い家具が固定されていないと、地震のゆれで倒れてくるおそれがあります。",
    advice: "突っ張り棒や金具で、天井や壁にしっかり固定しましょう。",
  },
  {
    category: "glass",
    title: "ガラスの飛散",
    description:
      "窓や食器棚のガラスが割れると、破片が飛び散ってケガのおそれがあります。",
    advice: "飛散防止フィルムを貼っておくと安心です。",
  },
  {
    category: "escape-route",
    title: "避難経路をふさぐ物",
    description:
      "出入口の前に物があると、逃げるときにつまずいたり、通れなくなったりします。",
    advice: "出入口の前は、いつも物を置かないようにしましょう。",
  },
  {
    category: "fall-object",
    title: "落ちてきそうな物",
    description:
      "高いところに置かれた物は、ゆれで落ちてきてケガの原因になります。",
    advice: "重い物や割れやすい物は、なるべく低いところに置きましょう。",
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
  }));
}
