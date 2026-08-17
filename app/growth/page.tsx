"use client";

import { useAppState } from "@/lib/AppStateContext";
import {
  GROWTH_SPECIES_LIST,
  getGrowthStage,
  getNextGrowthStage,
  getSpeciesDef,
  type GrowthSpecies,
} from "@/lib/growth";

const EARN_POINTS = [
  { emoji: "🙆", label: "安否確認で「無事です」を伝える", points: "+2" },
  { emoji: "🎒", label: "チェックリストの項目をそろえる", points: "+5" },
  { emoji: "📷", label: "お部屋の写真をとる", points: "+3" },
  { emoji: "🛠️", label: "お部屋の危険ポイントを対策する", points: "+8" },
  { emoji: "😊", label: "毎日の体調をつたえる", points: "+2" },
];

export default function GrowthPage() {
  const { state, setGrowthEnabled, setGrowthSpecies } = useAppState();
  const { enabled, species, points } = state.growth;

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-zinc-900">
              育成ゲーム要素
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              防災の取り組みで、キャラクターを育てられます
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setGrowthEnabled(!enabled)}
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
            ? "育成ゲームは ON です"
            : "育成ゲームは OFF です。いつでもまたONにできます"}
        </p>
      </section>

      {enabled && (
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
          <h2 className="text-lg font-extrabold text-zinc-900">
            そだてるループ
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            あそぶ→防災がすすむ→キャラが育つ。この3つがぐるぐるまわります
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <LoopStep emoji="🎮" label="あそぶ" note="ミニゲーム" />
            <LoopArrow />
            <LoopStep
              emoji="🛠️"
              label="防災がすすむ"
              note="チェックリスト・お部屋診断"
            />
            <LoopArrow />
            <LoopStep emoji="🐣" label="キャラが育つ" note="🪙コインで成長" />
          </div>
        </section>
      )}

      {enabled && species === null && (
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
          <h2 className="text-lg font-extrabold text-zinc-900">
            なにを育てる？
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            育てたいキャラクターを選んでください
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {GROWTH_SPECIES_LIST.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setGrowthSpecies(option.id)}
                className="flex flex-col items-center gap-2 rounded-2xl border-2 border-orange-100 py-5 text-sm font-extrabold text-zinc-700 transition-colors hover:border-orange-400"
              >
                <span className="text-4xl" aria-hidden>
                  {option.icon}
                </span>
                {option.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {enabled && species !== null && (
        <>
          <GrowthMascot species={species} points={points} />

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
            <h2 className="text-lg font-extrabold text-zinc-900">
              育てるキャラクターを変える
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {GROWTH_SPECIES_LIST.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setGrowthSpecies(option.id)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 py-4 text-sm font-extrabold transition-colors ${
                    option.id === species
                      ? "border-orange-600 bg-orange-50 text-orange-700"
                      : "border-orange-100 text-zinc-600 hover:border-orange-300"
                  }`}
                >
                  <span className="text-3xl" aria-hidden>
                    {option.icon}
                  </span>
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
            <h2 className="text-lg font-extrabold text-zinc-900">
              🪙 コインのため方
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {EARN_POINTS.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl border border-orange-100 px-4 py-2.5"
                >
                  <span className="text-xl" aria-hidden>
                    {item.emoji}
                  </span>
                  <span className="flex-1 text-sm font-bold text-zinc-700">
                    {item.label}
                  </span>
                  <span className="text-sm font-extrabold text-orange-600">
                    {item.points}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
            <h2 className="text-lg font-extrabold text-zinc-900">
              せいちょうの記録
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {getSpeciesDef(species).stages.map((s) => (
                <li
                  key={s.level}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 ${
                    s.level === getGrowthStage(species, points).level
                      ? "bg-orange-50 ring-1 ring-orange-300"
                      : ""
                  }`}
                >
                  <span className="text-2xl" aria-hidden>
                    {s.emoji}
                  </span>
                  <span className="flex-1 text-sm font-bold text-zinc-700">
                    Lv.{s.level} {s.name}
                  </span>
                  <span className="text-xs text-zinc-400">
                    🪙{s.minPoints}〜
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

function GrowthMascot({
  species,
  points,
}: {
  species: GrowthSpecies;
  points: number;
}) {
  const stage = getGrowthStage(species, points);
  const nextStage = getNextGrowthStage(species, points);
  const progressPercent = nextStage
    ? Math.round(
        ((points - stage.minPoints) / (nextStage.minPoints - stage.minPoints)) *
          100
      )
    : 100;

  return (
    <section className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-orange-100">
      <div className="text-8xl" aria-hidden>
        {stage.emoji}
      </div>
      <p className="mt-3 text-lg font-extrabold text-zinc-900">
        Lv.{stage.level} {stage.name}
      </p>
      <p className="mt-1 text-sm text-zinc-500">🪙 ぼうさいコイン：{points}</p>

      <div className="mt-4">
        <div className="h-3 w-full overflow-hidden rounded-full bg-orange-100">
          <div
            className="h-full rounded-full bg-orange-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-bold text-zinc-500">
          {nextStage
            ? `つぎの「${nextStage.name}」まで、あと 🪙${nextStage.minPoints - points}`
            : "さいこうレベルです！"}
        </p>
      </div>
    </section>
  );
}

function LoopStep({
  emoji,
  label,
  note,
}: {
  emoji: string;
  label: string;
  note: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-orange-50 px-3 py-4 text-center">
      <span className="text-3xl" aria-hidden>
        {emoji}
      </span>
      <p className="text-sm font-extrabold text-zinc-900">{label}</p>
      <p className="text-xs text-zinc-500">{note}</p>
    </div>
  );
}

function LoopArrow() {
  return (
    <span
      className="self-center text-xl text-orange-400 sm:rotate-0"
      aria-hidden
    >
      <span className="block sm:hidden">↓</span>
      <span className="hidden sm:block">→</span>
    </span>
  );
}
