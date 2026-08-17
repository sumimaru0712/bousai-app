"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppState } from "@/lib/AppStateContext";
import {
  ROOM_GAME_SECONDS,
  ROOM_ITEMS,
  type RoomHazardItem,
} from "@/lib/minigames";

type Phase = "intro" | "playing" | "result";

const POINTS_PER_HAZARD = 2;

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function RoomGamePage() {
  const { state, awardPoints, addActivity } = useAppState();
  const [phase, setPhase] = useState<Phase>("intro");
  const [items, setItems] = useState<RoomHazardItem[]>(() =>
    shuffle(ROOM_ITEMS)
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(ROOM_GAME_SECONDS);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      finishGame();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  if (!state.minigames.enabled) {
    return (
      <div className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-orange-100">
        <p className="text-zinc-600">ミニゲームはOFFになっています。</p>
        <Link href="/minigames" className="mt-4 inline-block font-bold text-orange-600">
          ← ミニゲームにもどる
        </Link>
      </div>
    );
  }

  function startGame() {
    setItems(shuffle(ROOM_ITEMS));
    setSelected(new Set());
    setTimeLeft(ROOM_GAME_SECONDS);
    setScore(null);
    setPhase("playing");
  }

  function toggleItem(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function finishGame() {
    const totalHazards = items.filter((item) => item.hazard).length;
    let raw = 0;
    for (const item of items) {
      const isSelected = selected.has(item.id);
      if (item.hazard && isSelected) raw += 1;
      if (!item.hazard && isSelected) raw -= 1;
    }
    const finalScore = Math.max(0, Math.min(totalHazards, raw));
    setScore(finalScore);
    awardPoints(finalScore * POINTS_PER_HAZARD);
    addActivity(
      `お部屋の危険さがしゲームで、危ない物を${finalScore}/${totalHazards}こ見つけたよ！`
    );
    setPhase("result");
  }

  if (phase === "intro") {
    return (
      <div className="flex flex-col gap-6">
        <Link href="/minigames" className="text-sm font-bold text-orange-600">
          ← ミニゲームにもどる
        </Link>
        <section className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-orange-100">
          <h1 className="text-xl font-extrabold text-zinc-900">
            🔍 お部屋の危険さがしゲーム
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {ROOM_GAME_SECONDS}秒のあいだに、地震のとき危ない物をタップしよう
          </p>
          <button
            type="button"
            onClick={startGame}
            className="mt-6 w-full rounded-full bg-orange-600 py-4 text-lg font-extrabold text-white shadow-md transition-colors hover:bg-orange-700"
          >
            スタート
          </button>
        </section>
      </div>
    );
  }

  if (phase === "playing") {
    return (
      <div className="flex flex-col gap-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-extrabold text-zinc-900">
              🔍 お部屋の危険さがしゲーム
            </h1>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-extrabold text-orange-700">
              ⏱ {timeLeft}秒
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            危ないと思う物をタップして選ぼう
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {items.map((item) => {
              const isSelected = selected.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-center gap-2 rounded-2xl border-2 px-3 py-4 text-left text-xs font-bold transition-colors ${
                    isSelected
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-orange-100 text-zinc-600 hover:border-orange-300"
                  }`}
                >
                  <span className="text-2xl" aria-hidden>
                    {item.emoji}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={finishGame}
            className="mt-5 w-full rounded-full bg-zinc-800 py-3 text-base font-extrabold text-white shadow-md transition-colors hover:bg-zinc-900"
          >
            けっかを見る
          </button>
        </section>
      </div>
    );
  }

  const totalHazards = items.filter((item) => item.hazard).length;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/minigames" className="text-sm font-bold text-orange-600">
        ← ミニゲームにもどる
      </Link>
      <section className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-orange-100">
        <h1 className="text-xl font-extrabold text-zinc-900">けっか発表！</h1>
        <p className="mt-4 text-5xl font-extrabold text-orange-600">
          {score} / {totalHazards}
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          +{(score ?? 0) * POINTS_PER_HAZARD}pt が育成キャラクターに入りました
        </p>
        <button
          type="button"
          onClick={startGame}
          className="mt-6 w-full rounded-full bg-orange-600 py-4 text-lg font-extrabold text-white shadow-md transition-colors hover:bg-orange-700"
        >
          もう一度あそぶ
        </button>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
        <h2 className="text-lg font-extrabold text-zinc-900">こたえ合わせ</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {items.map((item) => {
            const isSelected = selected.has(item.id);
            const good = item.hazard === isSelected;
            return (
              <li
                key={item.id}
                className={`rounded-2xl px-4 py-2.5 ${
                  good ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl" aria-hidden>
                    {item.emoji}
                  </span>
                  <span className="flex-1 text-sm font-bold text-zinc-700">
                    {item.label}
                  </span>
                  <span
                    className={`text-xs font-extrabold ${
                      good ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {item.hazard
                      ? isSelected
                        ? "見つけた！"
                        : "見のがした"
                      : isSelected
                        ? "危なくない"
                        : "正解！"}
                  </span>
                </div>
                <p className="mt-1 pl-9 text-xs text-zinc-500">{item.note}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
