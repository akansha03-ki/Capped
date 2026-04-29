import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { GlobalProvider } from "@/context/GlobalContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Capped - Student Expense Tracker",
  description: "A smart expense tracker designed for students to manage budgets and split bills.",
};

export const viewport: Viewport = {
  themeColor: "#DDB892",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="font-sans min-h-full flex flex-col bg-[var(--bg)] text-[var(--fg)]">
        <GlobalProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
