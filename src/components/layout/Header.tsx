"use client";

import Sidebar from "./Sidebar";
import ThemeSelector from "../ui/ThemeSelector";

export default function Header({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-30 w-full flex items-center justify-between px-6 py-4 bg-[var(--bg)]/80 backdrop-blur-md">
      <div className="flex items-center space-x-4">
        <Sidebar />
        {title && <h1 className="text-xl font-bold text-[var(--fg)]">{title}</h1>}
      </div>
      <ThemeSelector />
    </header>
  );
}
