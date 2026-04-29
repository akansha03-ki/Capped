"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/GlobalContext";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  "Clothing", "Decor", "Hygiene", "Impulse", "Makeup", "Other", 
  "Parcel", "Project", "Rent", "Restaurant", "Snacks and Bevs", 
  "Stationary", "Transport", "Utilities"
];

export default function AddTransactionPage() {
  const router = useRouter();
  const { addTransaction } = useGlobalContext();

  const [type, setType] = useState<"expense" | "income">("expense");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const handleCategoryAsTitle = () => {
    setTitle(category);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) {
      alert("Please enter title and amount.");
      return;
    }

    addTransaction({
      date: new Date().toISOString(),
      title,
      category: type === "income" ? "Income" : category,
      amount: Number(amount),
      type
    });

    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] transition-colors duration-300">
      
      <header className="sticky top-0 z-30 w-full flex items-center px-6 py-4 bg-[var(--bg)]/80 backdrop-blur-md">
        <Link href="/dashboard" className="p-2 -ml-2 rounded-full text-[var(--fg)] hover:bg-gray-100 dark:hover:bg-[#1f1f1f]">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-[var(--fg)] ml-2">Transaction</h1>
      </header>

      <main className="flex-1 px-6 pt-6 animate-in slide-in-from-right-8 duration-300 max-w-lg mx-auto w-full">
        
        {/* Type Toggle */}
        <div className="flex bg-gray-100 dark:bg-[#1a1a1a] p-1 rounded-2xl mb-8 shadow-inner">
          <button 
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              type === "expense" ? "bg-white dark:bg-[#2a2a2a] text-red-500 shadow-sm" : "text-gray-500 hover:text-[var(--fg)]"
            }`}
          >
            Expense
          </button>
          <button 
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              type === "income" ? "bg-white dark:bg-[#2a2a2a] text-green-500 shadow-sm" : "text-gray-500 hover:text-[var(--fg)]"
            }`}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {type === "expense" && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">Category</label>
              <div className="relative">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-4 appearance-none rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-[var(--p1)] text-[var(--fg)] font-medium shadow-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ArrowLeft className="w-5 h-5 text-gray-400 -rotate-90" />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Title</label>
              {type === "expense" && (
                <button 
                  type="button" 
                  onClick={handleCategoryAsTitle}
                  className="text-xs font-bold text-[var(--p2)] flex items-center hover:opacity-80"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Category as Title
                </button>
              )}
            </div>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Iced Latte"
              className="w-full px-4 py-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-[var(--p1)] text-[var(--fg)] font-medium shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rs.</span>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-[var(--p1)] text-[var(--fg)] font-bold text-lg shadow-sm"
              />
            </div>
          </div>

          <div className="pt-8">
            <button 
              type="submit"
              className="w-full py-4 rounded-2xl bg-[var(--fg)] text-[var(--bg)] font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-transform"
            >
              Enter
            </button>
          </div>

        </form>
      </main>

    </div>
  );
}
