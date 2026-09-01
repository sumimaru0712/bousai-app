"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "ホーム", emoji: "🏠" },
  { href: "/anpi", label: "安否確認", emoji: "🙋" },
  { href: "/checklist", label: "チェックリスト", emoji: "🎒" },
  { href: "/room-check", label: "お部屋診断", emoji: "📷" },
  { href: "/health", label: "体調", emoji: "😊" },
  { href: "/growth", label: "そだてる", emoji: "🥚" },
  { href: "/voice", label: "ボイス", emoji: "🎙️" },
  { href: "/minigames", label: "ゲーム", emoji: "🎮" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-10 border-t border-[var(--accent-border)] bg-white/95 backdrop-blur">
      <ul className="mx-auto flex max-w-3xl">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="min-w-0 flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 px-0.5 py-4 text-[10px] font-bold leading-tight transition-colors ${
                  active
                    ? "text-[var(--accent-dark)]"
                    : "text-zinc-500 hover:text-[var(--accent)]"
                }`}
              >
                <span className="text-xl" aria-hidden>
                  {item.emoji}
                </span>
                <span className="w-full truncate text-center">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
