import Link from "next/link";
import { RoleSwitcher } from "./RoleSwitcher";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-orange-200 bg-orange-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            🏡
          </span>
          <span className="text-lg font-extrabold text-orange-900">
            ぼうさいアプリ
          </span>
        </Link>
        <RoleSwitcher />
      </div>
    </header>
  );
}
