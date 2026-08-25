"use client";

import Link from "next/link";
import { useAppState } from "@/lib/AppStateContext";
import { getGrowthStage } from "@/lib/growth";
import {
  getTodayWeekday,
  HEALTH_STATUS_EMOJI,
  HEALTH_STATUS_LABEL,
  ROLE_LABEL,
  WEEKDAY_LABEL,
} from "@/lib/types";

const GRANDCHILD_CARD_ORDER = [
  "minigames",
  "checklist",
  "room",
  "anpi",
  "health",
  "voice",
];

const GRANDPARENT_CARD_ORDER = [
  "anpi",
  "health",
  "voice",
  "checklist",
  "room",
  "minigames",
];

export default function Home() {
  const { state } = useAppState();
  const isGrandparent = state.currentRole === "grandparent";

  const checkedCount = state.checklist.filter((item) => item.checked).length;
  const totalCount = state.checklist.length;
  const checklistPercent =
    totalCount === 0 ? 0 : Math.round((checkedCount / totalCount) * 100);

  const safeCount = Object.values(state.anpi).filter(
    (record) => record.status === "safe"
  ).length;

  const { enabled: growthEnabled, species: growthSpecies, points: growthPoints } =
    state.growth;
  const growthStage = growthSpecies
    ? getGrowthStage(growthSpecies, growthPoints)
    : null;

  const today = getTodayWeekday();

  const cards: Record<string, React.ReactNode> = {
    anpi: (
      <FeatureCard
        key="anpi"
        href="/anpi"
        emoji="🙋"
        title="安否確認"
        description="ワンタップで「無事です」を家族に伝えます"
        large={isGrandparent}
      >
        <p className="text-sm font-bold text-zinc-700">
          いま無事が確認できているのは {safeCount} / 2 人です
        </p>
      </FeatureCard>
    ),
    checklist: (
      <FeatureCard
        key="checklist"
        href="/checklist"
        emoji="🎒"
        title="防災チェックリスト"
        description="非常持ち出し袋などを、ふたりで確認しながら進めます"
        large={isGrandparent}
      >
        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-orange-100">
            <div
              className="h-full rounded-full bg-orange-500"
              style={{ width: `${checklistPercent}%` }}
            />
          </div>
          <span className="text-sm font-bold text-zinc-700">
            {checkedCount} / {totalCount}
          </span>
        </div>
      </FeatureCard>
    ),
    room: (
      <FeatureCard
        key="room"
        href="/room-check"
        emoji="📷"
        title="お部屋防災診断"
        description="お部屋の写真をとって、危ないところを一緒にチェックします"
        large={isGrandparent}
      >
        <p className="text-sm font-bold text-zinc-700">
          これまでに {state.roomPhotos.length} 枚の写真を診断中です
        </p>
      </FeatureCard>
    ),
    health: (
      <FeatureCard
        key="health"
        href="/health"
        emoji="😊"
        title="毎日の体調共有"
        description="今日の体調を3段階（元気・普通・元気がない）でつたえます"
        large={isGrandparent}
      >
        <p className="text-sm font-bold text-zinc-700">
          {state.health.latest
            ? `さいきんの体調：${HEALTH_STATUS_EMOJI[state.health.latest.status]} ${HEALTH_STATUS_LABEL[state.health.latest.status]}`
            : "まだ体調が伝えられていません"}
        </p>
      </FeatureCard>
    ),
    voice: (
      <FeatureCard
        key="voice"
        href="/voice"
        emoji="🎙️"
        title="曜日ごとの孫からのボイス"
        description="曜日ごとに、孫からの声のメッセージがきけます"
        large={isGrandparent}
      >
        <p className="text-sm font-bold text-zinc-700">
          {WEEKDAY_LABEL[today]}のメッセージ：
          {state.voice.messages[today] ? "とどいています" : "まだです"}
        </p>
      </FeatureCard>
    ),
    minigames: state.minigames.enabled ? (
      <FeatureCard
        key="minigames"
        href="/minigames"
        emoji="🎮"
        title="防災ミニゲーム"
        description="クイズや持ち出し袋あてゲームで、遊びながら防災を学びます"
        large={isGrandparent}
      >
        <p className="text-sm font-bold text-zinc-700">
          クイズ・持ち出し袋あて・危険さがしの3種類
        </p>
      </FeatureCard>
    ) : null,
  };

  const order = isGrandparent ? GRANDPARENT_CARD_ORDER : GRANDCHILD_CARD_ORDER;

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
        <p className="text-sm font-bold text-orange-600">
          いま：{ROLE_LABEL[state.currentRole]} として見ています
        </p>
        <h1
          className={`mt-2 font-extrabold text-zinc-900 ${
            isGrandparent ? "text-3xl" : "text-2xl"
          }`}
        >
          はなれていても、いっしょに防災。
        </h1>
        <p
          className={`mt-2 text-zinc-600 ${isGrandparent ? "text-lg" : ""}`}
        >
          {isGrandparent
            ? "むずかしい操作はありません。大きなボタンから、ひとつずつ確認できます。"
            : "たのしく学んで、防災をつづけよう。ゲームやキャラクターの成長で、飽きずに取り組めます。"}
        </p>
      </section>

      {isGrandparent && <ActivityFeed state={state} large />}

      {growthEnabled && !isGrandparent && (
        <GrowthBanner emoji={growthStage?.emoji} stage={growthStage} points={growthPoints} />
      )}

      <section className="grid gap-4">
        {order.map((id) => cards[id])}
      </section>

      {growthEnabled && isGrandparent && (
        <GrowthBanner emoji={growthStage?.emoji} stage={growthStage} points={growthPoints} />
      )}

      {!isGrandparent && <ActivityFeed state={state} />}
    </div>
  );
}

function GrowthBanner({
  emoji,
  stage,
  points,
}: {
  emoji?: string;
  stage: ReturnType<typeof getGrowthStage> | null;
  points: number;
}) {
  return (
    <Link
      href="/growth"
      className="flex items-center gap-4 rounded-3xl bg-orange-600 p-5 text-white shadow-sm transition-colors hover:bg-orange-700"
    >
      <span className="text-5xl" aria-hidden>
        {emoji ?? "🥚"}
      </span>
      <div className="flex-1">
        <p className="text-xs font-bold text-orange-100">
          そだてる・ぼうさいキャラクター
        </p>
        {stage ? (
          <>
            <p className="text-lg font-extrabold">
              Lv.{stage.level} {stage.name}
            </p>
            <p className="text-xs text-orange-100">
              {points}pt ・ みんなの行動で育っています
            </p>
          </>
        ) : (
          <p className="text-sm font-extrabold">なにを育てるか選びましょう →</p>
        )}
      </div>
    </Link>
  );
}

function ActivityFeed({
  state,
  large,
}: {
  state: ReturnType<typeof useAppState>["state"];
  large?: boolean;
}) {
  const entries = state.activity.entries.slice(0, 3);

  return (
    <section
      className={`rounded-3xl bg-white shadow-sm ring-1 ring-orange-100 ${
        large ? "p-6" : "p-5"
      }`}
    >
      <h2
        className={`font-extrabold text-zinc-900 ${
          large ? "text-xl" : "text-base"
        }`}
      >
        🔔 さいきんのできごと
      </h2>
      {entries.length === 0 ? (
        <p
          className={`mt-2 text-zinc-500 ${large ? "text-base" : "text-sm"}`}
        >
          まだ何もありません。防災の取り組みをすると、ここに表示されます。
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="rounded-2xl bg-orange-50 px-4 py-2.5"
            >
              <p
                className={`font-bold text-zinc-800 ${
                  large ? "text-base" : "text-sm"
                }`}
              >
                {ROLE_LABEL[entry.actor]}が{entry.message}
              </p>
              <p className="mt-0.5 text-xs text-zinc-400">
                {new Date(entry.createdAt).toLocaleString("ja-JP", {
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function FeatureCard({
  href,
  emoji,
  title,
  description,
  children,
  large,
}: {
  href: string;
  emoji: string;
  title: string;
  description: string;
  children: React.ReactNode;
  large?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-3xl bg-white shadow-sm ring-1 ring-orange-100 transition-shadow hover:shadow-md ${
        large ? "p-6" : "p-5"
      }`}
    >
      <div className="flex items-start gap-4">
        <span className={large ? "text-5xl" : "text-4xl"} aria-hidden>
          {emoji}
        </span>
        <div className="flex-1">
          <h2
            className={`font-extrabold text-zinc-900 ${
              large ? "text-2xl" : "text-lg"
            }`}
          >
            {title}
          </h2>
          <p
            className={`mt-0.5 text-zinc-500 ${
              large ? "text-base" : "text-sm"
            }`}
          >
            {description}
          </p>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </Link>
  );
}
