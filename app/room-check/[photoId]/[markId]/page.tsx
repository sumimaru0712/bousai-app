"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { useAppState } from "@/lib/AppStateContext";
import { t } from "@/lib/copy";
import { isMarkResolved } from "@/lib/markStatus";
import { ROLE_LABEL, type DangerCategory, type Role } from "@/lib/types";

const CATEGORY_ICON: Record<DangerCategory, string> = {
  furniture: "🪑",
  glass: "🪟",
  "escape-route": "🚪",
  "fall-object": "📦",
};

const CHECK_ROWS: Role[] = ["grandparent", "grandchild"];

export default function DangerMarkDetailPage({
  params,
}: {
  params: Promise<{ photoId: string; markId: string }>;
}) {
  const { photoId, markId } = use(params);
  const { state, setMarkChecked } = useAppState();

  const photo = state.roomPhotos.find((item) => item.id === photoId);
  const mark = photo?.marks.find((item) => item.id === markId);

  if (!photo || !mark) {
    return (
      <div className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-orange-100">
        <p className="text-zinc-600">
          この危険ポイントは見つかりませんでした。
        </p>
        <Link
          href="/room-check"
          className="mt-4 inline-block font-bold text-orange-600"
        >
          ← お部屋防災診断にもどる
        </Link>
      </div>
    );
  }

  const index = photo.marks.findIndex((item) => item.id === markId);
  const resolved = isMarkResolved(mark);

  return (
    <div className="flex flex-col gap-4">
      <Link href="/room-check" className="text-sm font-bold text-orange-600">
        ← お部屋防災診断にもどる
      </Link>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-orange-100">
        <div className="relative aspect-video w-full bg-zinc-100">
          <Image
            src={photo.dataUrl}
            alt="お部屋の写真"
            fill
            unoptimized
            className="object-cover"
          />
          {photo.marks.map((item, i) => (
            <span
              key={item.id}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-extrabold text-white shadow-lg ring-4 transition-transform ${
                item.id === markId
                  ? isMarkResolved(item)
                    ? "scale-125 bg-green-600 ring-green-300"
                    : "scale-125 bg-red-600 ring-red-300"
                  : "bg-zinc-400 opacity-50 ring-zinc-200"
              }`}
            >
              {isMarkResolved(item) ? "✓" : i + 1}
            </span>
          ))}
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden>
              {CATEGORY_ICON[mark.category]}
            </span>
            <div>
              <p className="text-xs font-bold text-zinc-400">
                危険ポイント {index + 1}
              </p>
              <h1 className="text-xl font-extrabold text-zinc-900">
                {t(mark.title, state.currentRole)}
              </h1>
            </div>
          </div>

          <section className="mt-5">
            <h2 className="text-sm font-extrabold text-red-700">
              🔍 ここが危ない
            </h2>
            <p className="mt-2 text-base leading-relaxed text-zinc-700">
              {t(mark.detail, state.currentRole)}
            </p>
          </section>

          <section className="mt-5">
            <h2 className="text-sm font-extrabold text-green-700">
              🛠️ どうすれば直せる？
            </h2>
            <ul className="mt-2 flex flex-col gap-2">
              {mark.fixes.map((fix) => (
                <li
                  key={fix.name.grandparent}
                  className="rounded-2xl bg-green-50 p-3"
                >
                  <p className="font-bold text-zinc-900">
                    {t(fix.name, state.currentRole)}
                  </p>
                  <p className="mt-0.5 text-sm text-zinc-600">
                    {t(fix.note, state.currentRole)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-5">
            <h2 className="text-sm font-extrabold text-zinc-700">
              ✅ 二人でチェック
            </h2>
            <div className="mt-2 flex flex-col divide-y divide-orange-100 overflow-hidden rounded-2xl border border-orange-100">
              {CHECK_ROWS.map((role) => {
                const checked = mark.checkedBy[role];
                const isMe = role === state.currentRole;

                if (isMe) {
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setMarkChecked(photo.id, mark.id, !checked)}
                      className={`flex min-h-[var(--tap-min)] items-center justify-between px-4 py-3 text-left transition-colors ${
                        checked
                          ? "bg-green-50 hover:bg-green-100"
                          : "bg-white hover:bg-orange-50"
                      }`}
                    >
                      <span className="font-bold text-zinc-900">
                        {ROLE_LABEL[role]}（自分）
                      </span>
                      <span
                        className={`font-extrabold ${
                          checked ? "text-green-700" : "text-orange-600"
                        }`}
                      >
                        {checked ? "✅ できた（もどす）" : "できた！"}
                      </span>
                    </button>
                  );
                }

                return (
                  <div
                    key={role}
                    className="flex min-h-[var(--tap-min)] items-center justify-between bg-zinc-50 px-4 py-3"
                  >
                    <span className="font-bold text-zinc-500">
                      {ROLE_LABEL[role]}
                    </span>
                    <span className="font-bold text-zinc-400">
                      {checked ? "✅ できた" : "⏳ まちのなか"}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {resolved && (
            <div className="mt-4 animate-bounce rounded-2xl bg-green-100 py-4 text-center font-extrabold text-green-700">
              🎉 二人で対策できました！
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
