"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "ホーム", emoji: "🏠" },
  { href: "/anpi", label: "安否確認", emoji: "🙋" },
  { href: "/checklist", label: "チェックリスト", emoji: "🎒" },
  { href: "/room-check", label: "お部屋診断", emoji: "📷" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-10 border-t border-orange-200 bg-white/95 backdrop-blur">
      <ul className="mx-auto flex max-w-3xl">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-bold transition-colors ${
                  active ? "text-orange-700" : "text-zinc-500 hover:text-orange-600"
                }`}
              >
                <span className="text-2xl" aria-hidden>
                  {item.emoji}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
