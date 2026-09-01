import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { RoleThemeProvider } from "@/components/RoleThemeProvider";
import { STORAGE_KEY } from "@/lib/defaultState";

const ROLE_INIT_SCRIPT = `
(function () {
  try {
    var raw = localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
    var role = raw ? JSON.parse(raw).currentRole : null;
    document.documentElement.dataset.role = role === "grandparent" ? "grandparent" : "grandchild";
  } catch (e) {
    document.documentElement.dataset.role = "grandchild";
  }
})();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ぼうさいアプリ",
  description: "離れて暮らす家族と、一緒にすすめる防災対策アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: ROLE_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--accent-weak)]">
        <RoleThemeProvider />
        <AppHeader />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
