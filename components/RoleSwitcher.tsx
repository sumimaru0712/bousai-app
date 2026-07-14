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
      className="flex gap-1 rounded-full bg-orange-100 p-1"
    >
      {OPTIONS.map((option) => {
        const active = state.currentRole === option.role;
        return (
          <button
            key={option.role}
            type="button"
            onClick={() => setRole(option.role)}
            aria-pressed={active}
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold transition-colors ${
              active
                ? "bg-orange-600 text-white shadow"
                : "text-orange-800 hover:bg-orange-200"
            }`}
          >
            <span aria-hidden>{option.emoji}</span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
