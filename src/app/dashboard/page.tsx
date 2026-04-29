"use client";

import { useGlobalContext, Transaction } from "@/context/GlobalContext";
import Header from "@/components/layout/Header";
import ChatbotBubble from "@/components/ui/ChatbotBubble";
import Link from "next/link";
import { Plus, ArrowRight, Calendar as CalendarIcon, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { format, isSameMonth } from "date-fns";

export default function DashboardPage() {
  const { transactions } = useGlobalContext();

  const now = new Date();
  
  // Calculate Monthly
  const monthlyTransactions = transactions.filter(t => isSameMonth(new Date(t.date), now));
  
  const monthlyExpense = monthlyTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate Net Balance (Total)
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const displayTransactions = transactions.slice(0, 3); // Show top 3 initially
  const hasMore = transactions.length > 3;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] pb-24 transition-colors duration-300">
      <Header title="Dashboard" />

      <main className="flex-1 px-6 pt-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full">
        
        {/* Floating Summary Box */}
        <div className="bg-[var(--p1)] text-white rounded-3xl p-6 shadow-xl shadow-[var(--p1)]/20 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/4"></div>

          <div className="relative z-10 flex flex-col space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Net Balance</p>
                <h2 className="text-4xl font-extrabold tracking-tight">
                  <span className="text-2xl mr-1">Rs.</span>
                  {netBalance.toLocaleString()}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-white/20">
              <div className="flex-1">
                <div className="flex items-center text-white/80 text-xs font-medium mb-1">
                  <ArrowDownRight className="w-3 h-3 mr-1 text-red-200" />
                  Monthly Expense
                </div>
                <p className="text-lg font-bold">Rs. {monthlyExpense.toLocaleString()}</p>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="flex-1">
                <div className="flex items-center text-white/80 text-xs font-medium mb-1">
                  <ArrowUpRight className="w-3 h-3 mr-1 text-green-200" />
                  Monthly Income
                </div>
                <p className="text-lg font-bold">Rs. {monthlyIncome.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[var(--fg)]">Recent Transactions</h3>
          
          {displayTransactions.length === 0 ? (
            <div className="bg-white dark:bg-[#1f1f1f] border border-gray-100 dark:border-gray-800 rounded-3xl p-8 text-center text-gray-500 shadow-sm">
              <p>No transactions yet.</p>
              <p className="text-sm mt-1">Click the + button to add one.</p>
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
              
              {hasMore && (
                <Link href="/transactions" className="w-full p-4 flex items-center justify-center text-sm font-semibold text-[var(--p1)] hover:bg-gray-50 dark:hover:bg-[#252525] border-t border-gray-100 dark:border-gray-800 transition-colors">
                  View past transactions <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              )}
            </div>
          )}

        </div>
      </main>

      {/* FAB */}
      <Link href="/transaction/new" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-bounce-short">
        <div className="bg-[var(--fg)] text-[var(--bg)] p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all">
          <Plus className="w-8 h-8" />
        </div>
      </Link>

      <ChatbotBubble />
    </div>
  );
}
