"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGlobalContext, UserProfile } from "@/context/GlobalContext";
import { Suspense } from "react";

const CATEGORIES = [
  "Clothing", "Decor", "Hygiene", "Impulse", "Makeup", "Other", 
  "Parcel", "Project", "Rent", "Restaurant", "Snacks and Bevs", 
  "Stationary", "Transport", "Utilities"
];

const HABITS = ["Weekday", "Weekend", "Holidays"];

function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "signup"; // "signup" or "guest"
  const { setProfile, seedDummyData } = useGlobalContext();

  const [destroyers, setDestroyers] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>("");
  const [habit, setHabit] = useState<string>("");

  const toggleCategory = (cat: string) => {
    setDestroyers((prev) => 
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget || !habit || destroyers.length === 0) {
      alert("Please answer all questions before proceeding.");
      return;
    }

    const newProfile: UserProfile = {
      budgetDestroyer: destroyers,
      monthlyBudget: Number(budget),
      spendHabit: habit,
    };

    // Save profile via Context API (which persists to localStorage)
    setProfile(newProfile);

    // If guest mode, seed dummy transaction/split bill data so charts are populated
    if (mode === "guest") {
      seedDummyData();
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-6 bg-[var(--bg)] transition-colors duration-300 pb-20">
      <div className="w-full max-w-md flex flex-col space-y-6 mt-10 animate-in slide-in-from-bottom-8 duration-500">
        
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-3xl font-extrabold text-[var(--fg)]">Spill Your Spend ☕</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {mode === "guest" 
              ? "Let's customize Capped for your lifestyle. Demo data will be loaded!" 
              : "Let's customize Capped for your lifestyle."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Question 1 */}
          <div className="space-y-4">
            <label className="text-lg font-semibold text-[var(--fg)]">
              1. What one thing destroys your budget every month?
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    destroyers.includes(cat) 
                    ? "bg-[var(--p2)] border-[var(--p2)] text-white" 
                    : "bg-transparent border-gray-300 dark:border-gray-700 text-[var(--fg)] hover:border-[var(--p2)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="space-y-4">
            <label className="text-lg font-semibold text-[var(--fg)] block">
              2. What's your monthly budget?
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rs.</span>
              <input 
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="0"
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--p1)] text-[var(--fg)] text-lg shadow-sm transition-shadow"
              />
            </div>
          </div>

          {/* Question 3 */}
          <div className="space-y-4">
            <label className="text-lg font-semibold text-[var(--fg)] block">
              3. When do you spend the most?
            </label>
            <div className="relative">
              <select 
                value={habit}
                onChange={(e) => setHabit(e.target.value)}
                className="w-full px-4 py-3 appearance-none rounded-2xl bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--p3)] text-[var(--fg)] text-lg shadow-sm transition-shadow"
              >
                <option value="" disabled>Select an option</option>
                {HABITS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              {/* Custom Dropdown Arrow */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6">
            <button 
              type="submit"
              className="w-full py-4 rounded-2xl bg-[var(--p1)] text-white font-bold text-lg shadow-lg shadow-[var(--p1)]/30 hover:shadow-[var(--p1)]/50 active:scale-95 transition-all"
            >
              Submit & View Dashboard
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[var(--bg)]"><p className="text-[var(--fg)]">Loading...</p></div>}>
      <OnboardingForm />
    </Suspense>
  );
}
