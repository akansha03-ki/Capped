"use client";

import { useState } from "react";
import { useGlobalContext, SplitPerson } from "@/context/GlobalContext";
import Header from "@/components/layout/Header";
import { CheckCircle2, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const SPLIT_CATEGORIES = ["Others", "Project", "Rent", "Restaurant", "Transport", "Utilities"];

export default function SplitBillPage() {
  const { addSplitBill } = useGlobalContext();
  const router = useRouter();

  const [method, setMethod] = useState<"Equally" | "Unequally">("Equally");
  const [category, setCategory] = useState(SPLIT_CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [personName, setPersonName] = useState("");
  const [people, setPeople] = useState<SplitPerson[]>([]);

  const handleAddPerson = () => {
    if (!personName.trim()) return;
    const newPerson: SplitPerson = {
      id: Math.random().toString(36).substr(2, 9),
      name: personName,
      amount: 0
    };
    setPeople([...people, newPerson]);
    setPersonName("");
  };

  const handleRemovePerson = (id: string) => {
    setPeople(people.filter(p => p.id !== id));
  };

  const handleManualAmount = (id: string, val: string) => {
    setPeople(people.map(p => p.id === id ? { ...p, amount: Number(val) } : p));
  };

  const totalAmount = Number(amount) || 0;
  const splitAmount = people.length > 0 ? (totalAmount / people.length) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || people.length === 0) {
      alert("Please fill in all details and add at least one person.");
      return;
    }

    const finalPeople = people.map(p => ({
      ...p,
      amount: method === "Equally" ? splitAmount : p.amount
    }));

    if (method === "Unequally") {
      const sum = finalPeople.reduce((acc, curr) => acc + curr.amount, 0);
      if (sum !== totalAmount) {
        alert(`The total of individual amounts (${sum}) must equal the Total Amount (${totalAmount}).`);
        return;
      }
    }

    addSplitBill({
      date: new Date().toISOString(),
      title,
      category,
      totalAmount,
      people: finalPeople,
      method
    });

    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] transition-colors duration-300 pb-24">
      <Header />
      
      <main className="flex-1 px-6 pt-2 max-w-lg mx-auto w-full animate-in slide-in-from-bottom-6 duration-300">
        <h1 className="text-3xl font-extrabold text-center text-[var(--fg)] mb-8 tracking-tight">Split Bill</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">How to Split?</label>
            <div className="flex bg-gray-100 dark:bg-[#1a1a1a] p-1 rounded-2xl shadow-inner">
              <button 
                type="button"
                onClick={() => setMethod("Equally")}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  method === "Equally" ? "bg-white dark:bg-[#2a2a2a] text-[var(--p1)] shadow-sm" : "text-gray-500 hover:text-[var(--fg)]"
                }`}
              >
                Equally
              </button>
              <button 
                type="button"
                onClick={() => setMethod("Unequally")}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  method === "Unequally" ? "bg-white dark:bg-[#2a2a2a] text-[var(--p2)] shadow-sm" : "text-gray-500 hover:text-[var(--fg)]"
                }`}
              >
                Unequally
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">Category</label>
            <div className="relative">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3.5 appearance-none rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-[var(--p1)] text-[var(--fg)] font-medium shadow-sm"
              >
                {SPLIT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Title</label>
              <button 
                type="button" 
                onClick={() => setTitle(category)}
                className="text-xs font-bold text-[var(--p2)] flex items-center hover:opacity-80"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Category as Title
              </button>
            </div>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Dinner at Mcdonalds"
              className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-[var(--p1)] text-[var(--fg)] font-medium shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">Total Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rs.</span>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-[var(--p1)] text-[var(--fg)] font-bold text-xl shadow-sm"
              />
            </div>
          </div>

          {/* Add People */}
          <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <input 
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="Add Person (e.g., John)"
                className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-[var(--p1)] text-sm text-[var(--fg)] shadow-sm"
              />
              <button 
                type="button"
                onClick={handleAddPerson}
                className="p-3 bg-[var(--p1)] text-white rounded-xl shadow-md hover:opacity-90 transition-opacity"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {people.length > 0 && (
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {format(new Date(), "dd MMM yyyy")}
                </div>
                {people.map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => handleRemovePerson(p.id)} className="text-red-400 hover:text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                      <span className="font-semibold text-[var(--fg)]">{p.name}</span>
                    </div>
                    
                    {method === "Equally" ? (
                      <span className="font-bold text-[var(--p2)]">Rs. {splitAmount.toFixed(2)}</span>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-xs text-gray-400 mr-2">Rs.</span>
                        <input 
                          type="number"
                          value={p.amount || ""}
                          onChange={(e) => handleManualAmount(p.id, e.target.value)}
                          className="w-20 px-2 py-1 text-right rounded-md bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 text-sm font-bold focus:outline-none focus:border-[var(--p1)]"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              className="w-full py-4 rounded-2xl bg-[var(--fg)] text-[var(--bg)] font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-transform"
            >
              Split
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
