"use client";

import Link from "next/link";
import { useAppState } from "@/lib/AppStateContext";
import { ROLE_LABEL } from "@/lib/types";

export default function Home() {
  const { state } = useAppState();

  const checkedCount = state.checklist.filter((item) => item.checked).length;
  const totalCount = state.checklist.length;
  const checklistPercent =
    totalCount === 0 ? 0 : Math.round((checkedCount / totalCount) * 100);

  const safeCount = Object.values(state.anpi).filter(
    (record) => record.status === "safe"
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
        <p className="text-sm font-bold text-orange-600">
          いま：{ROLE_LABEL[state.currentRole]} として見ています
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-zinc-900">
          はなれていても、いっしょに防災。
        </h1>
        <p className="mt-2 text-zinc-600">
          遠くに住むおじいちゃん・おばあちゃんと、孫がふたりで少しずつ
          防災対策をすすめるためのアプリです。
        </p>
      </section>

      <section className="grid gap-4">
        <FeatureCard
          href="/anpi"
          emoji="🙋"
          title="安否確認"
          description="ワンタップで「無事です」を家族に伝えます"
        >
          <p className="text-sm font-bold text-zinc-700">
            いま無事が確認できているのは {safeCount} / 2 人です
          </p>
        </FeatureCard>

        <FeatureCard
          href="/checklist"
          emoji="🎒"
          title="防災チェックリスト"
          description="非常持ち出し袋などを、ふたりで確認しながら進めます"
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

        <FeatureCard
          href="/room-check"
          emoji="📷"
          title="お部屋防災診断"
          description="お部屋の写真をとって、危ないところを一緒にチェックします"
        >
          <p className="text-sm font-bold text-zinc-700">
            これまでに {state.roomPhotos.length} 枚の写真を診断中です
          </p>
        </FeatureCard>
      </section>
    </div>
  );
}

function FeatureCard({
  href,
  emoji,
  title,
  description,
  children,
}: {
  href: string;
  emoji: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block rounded-3xl bg-white p-5 shadow-sm ring-1 ring-orange-100 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl" aria-hidden>
          {emoji}
        </span>
        <div className="flex-1">
          <h2 className="text-lg font-extrabold text-zinc-900">{title}</h2>
          <p className="mt-0.5 text-sm text-zinc-500">{description}</p>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </Link>
  );
}
