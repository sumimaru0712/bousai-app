"use client";

import Link from "next/link";
import { useAppState } from "@/lib/AppStateContext";

const GAMES = [
  {
    href: "/minigames/quiz",
    emoji: "❓",
    title: "防災クイズ",
    description: "3択クイズで、防災の知識をたしかめよう",
  },
  {
    href: "/minigames/bag",
    emoji: "🎒",
    title: "非常持ち出し袋あてゲーム",
    description: "制限時間内に、必要な物を選ぼう",
  },
  {
    href: "/minigames/room",
    emoji: "🔍",
    title: "お部屋の危険さがしゲーム",
    description: "制限時間内に、危ない場所を見つけよう",
  },
];

export default function MinigamesPage() {
  const { state, setMinigamesEnabled } = useAppState();
  const { enabled } = state.minigames;

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-zinc-900">
              防災ミニゲーム
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              遊びながら防災を学べます
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setMinigamesEnabled(!enabled)}
            className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
              enabled ? "bg-orange-600" : "bg-zinc-300"
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                enabled ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <p className="mt-3 text-xs font-bold text-zinc-500">
          {enabled
            ? "ミニゲームは ON です"
            : "ミニゲームは OFF です。いつでもまたONにできます"}
        </p>
      </section>

      {enabled ? (
        <section className="grid gap-4">
          {GAMES.map((game) => (
            <Link
              key={game.href}
              href={game.href}
              className="block rounded-3xl bg-white p-5 shadow-sm ring-1 ring-orange-100 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl" aria-hidden>
                  {game.emoji}
                </span>
                <div className="flex-1">
                  <h2 className="text-lg font-extrabold text-zinc-900">
                    {game.title}
                  </h2>
                  <p className="mt-0.5 text-sm text-zinc-500">
                    {game.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <section className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-orange-100">
          <p className="text-sm text-zinc-500">
            ミニゲームはOFFになっています。上のスイッチでONにすると遊べます。
          </p>
        </section>
      )}
    </div>
  );
}
