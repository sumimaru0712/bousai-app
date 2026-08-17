"use client";

import { useAppState } from "@/lib/AppStateContext";
import {
  HEALTH_STATUS_EMOJI,
  HEALTH_STATUS_LABEL,
  type HealthStatus,
} from "@/lib/types";

const STATUS_OPTIONS: HealthStatus[] = ["genki", "futsuu", "genki-nai"];

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function countRecentGenkiNai(history: { status: HealthStatus }[]): number {
  let count = 0;
  for (const log of history) {
    if (log.status !== "genki-nai") break;
    count += 1;
  }
  return count;
}

export default function HealthPage() {
  const { state, reportHealth } = useAppState();
  const { latest, history } = state.health;
  const isGrandparent = state.currentRole === "grandparent";
  const consecutiveGenkiNai = countRecentGenkiNai(history);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
        <h1 className="text-xl font-extrabold text-zinc-900">
          毎日の体調共有
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          今日の体調を3段階でつたえます
        </p>

        {isGrandparent ? (
          <div className="mt-5 grid grid-cols-3 gap-3">
            {STATUS_OPTIONS.map((status) => {
              const selectedToday =
                latest?.status === status && isToday(latest.createdAt);
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => reportHealth(status)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 py-5 text-sm font-extrabold transition-colors ${
                    selectedToday
                      ? "border-orange-600 bg-orange-50 text-orange-700"
                      : "border-orange-100 text-zinc-600 hover:border-orange-300"
                  }`}
                >
                  <span className="text-3xl" aria-hidden>
                    {HEALTH_STATUS_EMOJI[status]}
                  </span>
                  {HEALTH_STATUS_LABEL[status]}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl bg-orange-50 p-5 text-center">
            {latest ? (
              <>
                <span className="text-4xl" aria-hidden>
                  {HEALTH_STATUS_EMOJI[latest.status]}
                </span>
                <p className="mt-2 text-lg font-extrabold text-zinc-900">
                  {HEALTH_STATUS_LABEL[latest.status]}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {formatTime(latest.createdAt)}
                </p>
              </>
            ) : (
              <p className="text-sm text-zinc-500">
                まだ今日の体調が伝えられていません
              </p>
            )}
          </div>
        )}
      </section>

      {!isGrandparent && consecutiveGenkiNai >= 2 && (
        <section className="rounded-3xl bg-red-50 p-5 shadow-sm ring-1 ring-red-200">
          <p className="font-extrabold text-red-700">
            ⚠️「元気がない」が{consecutiveGenkiNai}回つづいています
          </p>
          <p className="mt-1 text-sm text-red-600">
            電話などで、ようすを聞いてみましょう
          </p>
        </section>
      )}

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
        <h2 className="text-lg font-extrabold text-zinc-900">これまでの記録</h2>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">まだ記録がありません</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {history.slice(0, 14).map((log) => (
              <li
                key={log.id}
                className="flex items-center justify-between rounded-2xl border border-orange-100 px-4 py-2.5"
              >
                <span className="flex items-center gap-2 font-bold text-zinc-800">
                  <span aria-hidden>{HEALTH_STATUS_EMOJI[log.status]}</span>
                  {HEALTH_STATUS_LABEL[log.status]}
                </span>
                <span className="text-xs text-zinc-500">
                  {formatTime(log.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
