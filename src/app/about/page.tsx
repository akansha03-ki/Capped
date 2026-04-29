"use client";

import Header from "@/components/layout/Header";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] transition-colors duration-300">
      <Header title="About Us" />
      
      <main className="flex-1 px-8 pt-10 max-w-xl mx-auto w-full animate-in fade-in duration-700 text-center space-y-8">
        
        <div className="w-24 h-24 bg-[var(--p1)] mx-auto rounded-3xl flex items-center justify-center shadow-xl rotate-6">
          <span className="text-4xl">🧢</span>
        </div>
        
        <h1 className="text-4xl font-black text-[var(--fg)] tracking-tight">Capped.</h1>
        
        <div className="space-y-6 text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
          <p>
            Capped was born out of a simple problem: students are broke, and tracking expenses shouldn't feel like doing taxes.
          </p>
          <p>
            We built this app to give you a clean, aesthetic, and slightly sarcastic overview of where your money goes. Whether it's splitting a restaurant bill, or getting roasted for buying iced coffee again, Capped is your digital financial advisor.
          </p>
          <p className="pt-4 text-sm text-gray-400">
            Designed & Developed with ♥<br/>
            v1.0.0
          </p>
        </div>

      </main>
    </div>
  );
}
