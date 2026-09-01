"use client";

import { useAppState } from "@/lib/AppStateContext";
import type { Role } from "@/lib/types";

const OPTIONS: { role: Role; label: string; emoji: string }[] = [
  { role: "grandchild", label: "孫", emoji: "🧒" },
  { role: "grandparent", label: "祖父母", emoji: "👴" },
];

export function RoleSwitcher() {
  const { state, setRole } = useAppState();

  return (
    <div
      role="group"
      aria-label="今の役割を選ぶ"
      className="flex gap-1 rounded-full bg-[var(--accent-weak)] p-1 ring-1 ring-[var(--accent-border)]"
    >
      {OPTIONS.map((option) => {
        const active = state.currentRole === option.role;
        return (
          <button
            key={option.role}
            type="button"
            onClick={() => setRole(option.role)}
            aria-pressed={active}
            className={`flex min-h-[var(--tap-min)] items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-extrabold transition-all ${
              active
                ? "scale-105 bg-[var(--accent)] text-white shadow-md"
                : "text-zinc-500 hover:bg-white"
            }`}
          >
            <span className="text-lg" aria-hidden>
              {option.emoji}
            </span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
