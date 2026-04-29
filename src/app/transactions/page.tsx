"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export default function TransactionsPage() {
  const { transactions } = useGlobalContext();

  const displayTransactions = transactions.slice(0, 30); // Show up to 30

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] pb-24 transition-colors duration-300">
      <Header title="All Transactions" />

      <main className="flex-1 px-6 pt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full">
        
        <Link href="/dashboard" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[var(--fg)] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        <div className="space-y-4">
          {displayTransactions.length === 0 ? (
            <div className="bg-white dark:bg-[#1f1f1f] border border-gray-100 dark:border-gray-800 rounded-3xl p-8 text-center text-gray-500 shadow-sm">
              <p>No transactions found.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {displayTransactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm ${
                        tx.type === 'income' ? 'bg-[var(--p2)]' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {format(new Date(tx.date), "dd MMM")}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--fg)] text-base">{tx.title}</p>
                        <p className="text-xs text-gray-500 font-medium">{tx.category}</p>
                      </div>
                    </div>
                    <div className={`font-bold text-base ${tx.type === 'income' ? 'text-[var(--p2)]' : 'text-[var(--fg)]'}`}>
                      {tx.type === 'income' ? '+' : '-'}Rs. {tx.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Link href="/calendar" className="w-full mt-8 flex items-center justify-center space-x-2 py-4 rounded-2xl border-2 border-[var(--p2)] text-[var(--p2)] font-semibold hover:bg-[var(--p2)] hover:text-white transition-all shadow-sm">
            <CalendarIcon className="w-5 h-5" />
            <span>Go to Calendar</span>
          </Link>

        </div>
      </main>
    </div>
  );
}
