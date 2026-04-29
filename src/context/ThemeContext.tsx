"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark";
type PaletteType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface ThemeContextType {
  mode: ThemeMode;
  palette: PaletteType;
  toggleMode: () => void;
  setPalette: (palette: PaletteType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [palette, setPaletteState] = useState<PaletteType>(1);

  useEffect(() => {
    const savedMode = localStorage.getItem("theme-mode") as ThemeMode;
    const savedPalette = localStorage.getItem("theme-palette") as unknown as PaletteType;
    if (savedMode) setMode(savedMode);
    if (savedPalette) setPaletteState(Number(savedPalette) as PaletteType);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Remove all theme-X classes
    for (let i = 1; i <= 10; i++) {
      root.classList.remove(`theme-${i}`);
    }
    root.classList.add(`theme-${palette}`);
    
    localStorage.setItem("theme-mode", mode);
    localStorage.setItem("theme-palette", palette.toString());
  }, [mode, palette]);

  const toggleMode = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ mode, palette, toggleMode, setPalette: setPaletteState }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
