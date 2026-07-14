"use client";

import { useAppState } from "@/lib/AppStateContext";
import { ROLE_LABEL, type Role } from "@/lib/types";

const ROLES: Role[] = ["grandchild", "grandparent"];

function formatTime(iso: string | null): string {
  if (!iso) return "まだ確認されていません";
  return new Date(iso).toLocaleString("ja-JP", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AnpiPage() {
  const { state, markSafe } = useAppState();
  const myRecord = state.anpi[state.currentRole];

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-orange-100">
        <h1 className="text-xl font-extrabold text-zinc-900">安否確認</h1>
        <p className="mt-1 text-sm text-zinc-500">
          地震などがあったとき、ワンタップで家族に「無事です」を伝えられます
        </p>

        <button
          type="button"
          onClick={() => markSafe(state.currentRole)}
          className="mt-6 w-full rounded-full bg-orange-600 py-6 text-2xl font-extrabold text-white shadow-md transition-colors hover:bg-orange-700 active:bg-orange-800"
        >
          🙋 無事です！
        </button>

        <p className="mt-4 text-sm text-zinc-500">
          {ROLE_LABEL[state.currentRole]}として：{formatTime(myRecord.updatedAt)}
        </p>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
        <h2 className="text-lg font-extrabold text-zinc-900">みんなの状況</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {ROLES.map((role) => {
            const record = state.anpi[role];
            const safe = record.status === "safe";
            return (
              <li
                key={role}
                className="flex items-center justify-between rounded-2xl border border-orange-100 p-4"
              >
                <div>
                  <p className="font-bold text-zinc-900">{ROLE_LABEL[role]}</p>
                  <p className="text-sm text-zinc-500">
                    {formatTime(record.updatedAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-4 py-1.5 text-sm font-bold ${
                    safe
                      ? "bg-green-100 text-green-700"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {safe ? "無事です" : "未確認"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
