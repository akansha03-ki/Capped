"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import Header from "@/components/layout/Header";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { format, subDays, isSameDay, startOfWeek, addDays, isAfter } from "date-fns";
import { useMemo } from "react";

export default function ExpenditurePage() {
  const { transactions } = useGlobalContext();

  const weeklyData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      const dayTx = transactions.filter(t => isSameDay(new Date(t.date), d));
      const expense = dayTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
      const income = dayTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
      data.push({
        date: format(d, "EEE"),
        expense,
        income
      });
    }
    return data;
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 3; i >= 0; i--) {
      const weekEnd = subDays(today, i * 7);
      const weekStart = subDays(today, i * 7 + 6);
      
      const weekTx = transactions.filter(t => {
        const d = new Date(t.date);
        return (isAfter(d, weekStart) || isSameDay(d, weekStart)) && (isAfter(weekEnd, d) || isSameDay(d, weekEnd));
      });
      
      const expense = weekTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
      const income = weekTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
      
      data.push({
        name: `Week ${4 - i}`,
        expense,
        income
      });
    }
    return data;
  }, [transactions]);

  const CustomXAxisTick = ({ x, y, payload }: any) => {
    const weekData = monthlyData.find(d => d.name === payload.value);
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="var(--fg)" fontSize={12} fontWeight="bold">
          {payload.value}
        </text>
        <text x={0} y={0} dy={32} textAnchor="middle" fill="#22c55e" fontSize={10} fontWeight="medium">
          {weekData ? `+${weekData.income}` : ""}
        </text>
        <text x={0} y={0} dy={44} textAnchor="middle" fill="#ef4444" fontSize={10} fontWeight="medium">
          {weekData ? `-${weekData.expense}` : ""}
        </text>
      </g>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] transition-colors duration-300 pb-24">
      <Header title="Expenditure" />
      
      <main className="flex-1 px-6 pt-6 max-w-2xl mx-auto w-full space-y-10 animate-in fade-in duration-500">
        
        {/* Weekly Stacked Bar Chart */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--fg)]">Weekly Overview</h2>
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.3} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--fg)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--fg)' }} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="expense" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="income" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4 space-x-6">
              <div className="flex items-center text-xs text-gray-500 font-medium">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div> Expense
              </div>
              <div className="flex items-center text-xs text-gray-500 font-medium">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div> Income
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Line Chart */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--fg)]">Monthly Trend</h2>
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={<CustomXAxisTick />}
                    height={60}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--fg)' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
