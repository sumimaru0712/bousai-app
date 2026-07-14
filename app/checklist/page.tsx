"use client";

import { useState } from "react";
import { useAppState } from "@/lib/AppStateContext";
import { ROLE_LABEL } from "@/lib/types";

export default function ChecklistPage() {
  const { state, toggleChecklistItem, addChecklistItem } = useAppState();
  const [newItem, setNewItem] = useState("");

  const checkedCount = state.checklist.filter((item) => item.checked).length;
  const totalCount = state.checklist.length;
  const percent =
    totalCount === 0 ? 0 : Math.round((checkedCount / totalCount) * 100);

  function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    const label = newItem.trim();
    if (!label) return;
    addChecklistItem(label);
    setNewItem("");
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
        <h1 className="text-xl font-extrabold text-zinc-900">
          防災チェックリスト
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          非常持ち出し袋の中身を、ふたりで確認しながらそろえましょう
        </p>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-orange-100">
            <div
              className="h-full rounded-full bg-orange-500 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-sm font-bold text-zinc-700">
            {checkedCount} / {totalCount}
          </span>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-orange-100">
        <ul className="flex flex-col divide-y divide-orange-100">
          {state.checklist.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-3">
              <label className="flex flex-1 cursor-pointer items-center gap-4">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleChecklistItem(item.id)}
                  className="h-7 w-7 shrink-0 accent-orange-600"
                />
                <span
                  className={`text-lg font-bold ${
                    item.checked
                      ? "text-zinc-400 line-through"
                      : "text-zinc-900"
                  }`}
                >
                  {item.label}
                </span>
              </label>
              <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                {ROLE_LABEL[item.addedBy]}が追加
              </span>
            </li>
          ))}
        </ul>

        <form onSubmit={handleAdd} className="mt-4 flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(event) => setNewItem(event.target.value)}
            placeholder="あたらしい項目を追加"
            className="flex-1 rounded-full border border-orange-200 px-4 py-2.5 text-base outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            className="rounded-full bg-orange-600 px-5 py-2.5 font-bold text-white hover:bg-orange-700"
          >
            追加
          </button>
        </form>
      </section>
    </div>
  );
}
