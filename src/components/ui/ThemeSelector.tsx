"use client";

import { useTheme } from "@/context/ThemeContext";
import { Palette, Moon, Sun, X } from "lucide-react";
import { useState } from "react";

const PALETTES = [
  { id: 1, name: "Default", color: "#DDB892" },
  { id: 2, name: "Ocean", color: "#3B82F6" },
  { id: 3, name: "Sunset", color: "#F97316" },
  { id: 4, name: "Forest", color: "#166534" },
  { id: 5, name: "Berry", color: "#9333EA" },
  { id: 6, name: "Monochrome", color: "#4B5563" },
  { id: 7, name: "Pastel", color: "#FDBA74" },
  { id: 8, name: "Neon", color: "#39FF14" },
  { id: 9, name: "Autumn", color: "#7C2D12" },
  { id: 10, name: "Cyber", color: "#06B6D4" },
] as const;

export default function ThemeSelector() {
  const { mode, palette, toggleMode, setPalette } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full bg-[var(--bg)] shadow-sm border border-gray-200 dark:border-gray-800 text-[var(--fg)] hover:text-[var(--p1)] transition-colors"
      >
        <Palette className="w-6 h-6" />
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white dark:bg-[#1f1f1f] rounded-3xl w-full max-w-sm p-6 shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute -top-3 -right-3 bg-white dark:bg-[#3a3a3a] rounded-full p-1.5 shadow-md text-gray-500 hover:text-[var(--p1)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              <h2 className="text-xl font-bold text-[var(--fg)]">Appearance</h2>
            </div>

            {/* Palette Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[var(--fg)]">Color Palette</span>
                <button 
                  onClick={toggleMode}
                  className="p-2 rounded-full bg-gray-100 dark:bg-[#3a3a3a] shadow-sm hover:scale-110 transition-transform border border-gray-200 dark:border-gray-700"
                  title="Toggle Light/Dark Mode"
                >
                  {mode === "light" ? <Sun className="w-5 h-5 text-orange-500" /> : <Moon className="w-5 h-5 text-blue-400" />}
                </button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {PALETTES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPalette(p.id as any)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                      palette === p.id ? "ring-4 ring-offset-2 ring-offset-white dark:ring-offset-[#1f1f1f] ring-gray-400" : ""
                    }`}
                    style={{ backgroundColor: p.color }}
                    title={p.name}
                  >
                    {palette === p.id && <div className="w-4 h-4 bg-white rounded-full opacity-80" />}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
