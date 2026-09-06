"use client";

import Link from "next/link";
import { useAppState } from "@/lib/AppStateContext";
import { RoleSwitcher } from "./RoleSwitcher";

const MODE_LABEL = {
  grandchild: "🧒 まごモード",
  grandparent: "👴 おじいちゃん・おばあちゃんモード",
};

export function AppHeader() {
  const { state } = useAppState();

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--accent-border)] bg-[var(--accent-weak)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-sky-500 text-sm shadow-sm"
            aria-hidden
          >
            🧒👴
          </span>
          <span className="text-lg font-extrabold text-[var(--accent-dark)]">
            まごチェック
          </span>
        </Link>
        <RoleSwitcher />
      </div>
      <div className="mx-auto max-w-3xl px-4 pb-2">
        <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-extrabold text-white">
          {MODE_LABEL[state.currentRole]}
        </span>
      </div>
    </header>
  );
}
