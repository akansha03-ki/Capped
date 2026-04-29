"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import Header from "@/components/layout/Header";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, subMonths, addMonths } from "date-fns";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  const { transactions } = useGlobalContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  // Calculate Averages
  const averages = useMemo(() => {
    const expenseTx = transactions.filter(t => t.type === "expense");
    const totalExpense = expenseTx.reduce((s, t) => s + t.amount, 0);
    
    // Simplistic averages based on a 30-day month assumption for display purposes
    const daily = totalExpense / 30;
    const weekly = daily * 7;
    const monthly = totalExpense;

    return { daily, weekly, monthly };
  }, [transactions]);

  const hasTransactionOnDay = (day: Date) => {
    return transactions.some(t => isSameDay(new Date(t.date), day));
  };

  const getTransactionsForDay = (day: Date) => {
    return transactions.filter(t => isSameDay(new Date(t.date), day));
  };

  const selectedTransactions = selectedDate ? getTransactionsForDay(selectedDate) : [];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] transition-colors duration-300 pb-24">
      <Header title="Calendar" />
      
      <main className="flex-1 px-6 pt-6 max-w-lg mx-auto w-full animate-in fade-in zoom-in-95 duration-500 space-y-8">
        
        {/* Calendar Header */}
        <div className="flex items-center justify-between bg-white dark:bg-[#1a1a1a] rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
          <h2 className="text-lg font-bold text-[var(--fg)]">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-full transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-xs font-bold text-gray-400">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-4 gap-x-2">
            {/* Offset first day */}
            {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10"></div>
            ))}
            
            {daysInMonth.map((day) => {
              const txExists = hasTransactionOnDay(day);
              const today = isToday(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              
              return (
                <div 
                  key={day.toISOString()} 
                  onClick={() => setSelectedDate(day)}
                  className="flex flex-col items-center justify-center h-10 relative cursor-pointer group"
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-all ${
                    isSelected ? "bg-[var(--p2)] text-white shadow-md ring-2 ring-[var(--p2)] ring-offset-2 ring-offset-white dark:ring-offset-[#1a1a1a] scale-110" : 
                    today ? "bg-[var(--p1)] text-white shadow-md" : "text-[var(--fg)] group-hover:bg-gray-100 dark:group-hover:bg-[#2a2a2a]"
                  }`}>
                    {format(day, "d")}
                  </div>
                  {txExists && (
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 absolute bottom-0 shadow-sm" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
          <h3 className="text-lg font-bold text-[var(--fg)] border-b border-gray-100 dark:border-gray-800 pb-2">Averages</h3>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Daily Expense</span>
            <span className="text-base font-bold text-[var(--fg)]">Rs. {averages.daily.toFixed(0)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Weekly Expense</span>
            <span className="text-base font-bold text-[var(--fg)]">Rs. {averages.weekly.toFixed(0)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Expense</span>
            <span className="text-base font-bold text-[var(--fg)]">Rs. {averages.monthly.toFixed(0)}</span>
          </div>
        </div>

        {/* Selected Date Transactions */}
        {selectedDate && (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 space-y-4 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-lg font-bold text-[var(--fg)] border-b border-gray-100 dark:border-gray-800 pb-2">
              Transactions on {format(selectedDate, "dd MMM yyyy")}
            </h3>
            
            {selectedTransactions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No transactions on this date.</p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {selectedTransactions.map((tx) => (
                  <div key={tx.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm text-[var(--fg)]">{tx.title}</p>
                      <p className="text-xs text-gray-500">{tx.category}</p>
                    </div>
                    <div className={`font-bold text-sm ${tx.type === 'income' ? 'text-[var(--p2)]' : 'text-[var(--fg)]'}`}>
                      {tx.type === 'income' ? '+' : '-'}Rs. {tx.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
