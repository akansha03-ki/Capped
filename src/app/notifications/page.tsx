"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import Header from "@/components/layout/Header";
import { Flame, Star, BellRing } from "lucide-react";
import { isSameDay, subDays } from "date-fns";
import { useMemo } from "react";

export default function NotificationsPage() {
  const { transactions, splitBills, profile } = useGlobalContext();

  const notifications = useMemo(() => {
    const notes: { id: string; type: "roast" | "motivation" | "reminder"; message: string; date: string }[] = [];
    const today = new Date();
    
    // 1. Motivations
    const expensesToday = transactions.filter(t => isSameDay(new Date(t.date), today) && t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const expensesYesterday = transactions.filter(t => isSameDay(new Date(t.date), subDays(today, 1)) && t.type === "expense").reduce((s, t) => s + t.amount, 0);
    
    if (expensesToday < expensesYesterday && expensesYesterday > 0) {
      notes.push({
        id: "mot-1",
        type: "motivation",
        message: "Great job! You spent less today than yesterday. Keep being mindful!",
        date: today.toISOString()
      });
    }

    // 2. Roasts
    if (profile?.budgetDestroyer) {
      const recentDestroyers = transactions.filter(t => 
        profile.budgetDestroyer.includes(t.category) && t.type === "expense"
      );
      if (recentDestroyers.length > 0) {
        notes.push({
          id: `roast-${recentDestroyers[0].id}`,
          type: "roast",
          message: `Spending on ${recentDestroyers[0].category.toLowerCase()} again? So much for that Rs. ${profile.monthlyBudget} budget.`,
          date: recentDestroyers[0].date
        });
      }
    }

    // 3. Reminders
    splitBills.slice(0, 5).forEach((bill) => {
      bill.people.forEach(p => {
        if (p.amount > 0) {
          notes.push({
            id: `rem-${bill.id}-${p.id}`,
            type: "reminder",
            message: `${p.name} still owes you Rs. ${p.amount.toFixed(2)} for ${bill.title}.`,
            date: bill.date
          });
        }
      });
    });

    // Sort by date descending
    return notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, splitBills, profile]);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] transition-colors duration-300 pb-24">
      <Header title="Notifications" />
      
      <main className="flex-1 px-6 pt-6 max-w-lg mx-auto w-full animate-in slide-in-from-right-8 duration-300">
        
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p>No notifications at the moment.</p>
              <p className="text-sm mt-2 opacity-70">Spend some money, I dare you.</p>
            </div>
          ) : (
            notifications.map((note) => (
              <div 
                key={note.id} 
                className={`p-5 rounded-3xl flex items-start space-x-4 shadow-sm border ${
                  note.type === "roast" 
                    ? "bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900" 
                    : note.type === "motivation" 
                    ? "bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900"
                    : "bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900"
                }`}
              >
                <div className={`p-3 rounded-full ${
                  note.type === "roast" ? "bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300" 
                  : note.type === "motivation" ? "bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300"
                  : "bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300"
                }`}>
                  {note.type === "roast" && <Flame className="w-6 h-6" />}
                  {note.type === "motivation" && <Star className="w-6 h-6" />}
                  {note.type === "reminder" && <BellRing className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${
                    note.type === "roast" ? "text-red-700 dark:text-red-400"
                    : note.type === "motivation" ? "text-green-700 dark:text-green-400"
                    : "text-blue-700 dark:text-blue-400"
                  }`}>
                    {note.type === "roast" ? "Roast Alert 🌶️" : note.type === "motivation" ? "Keep It Up 🌟" : "Reminder 🔔"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium text-sm mt-1 leading-relaxed">
                    {note.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}
