"use client";

import { Menu, X, Receipt, PieChart, Bell, Calendar, Info, LogOut } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGlobalContext } from "@/context/GlobalContext";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: Receipt },
  { name: "Split Bill", href: "/split-bill", icon: Receipt },
  { name: "Expenditure", href: "/expenditure", icon: PieChart },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "About Us", href: "/about", icon: Info },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useGlobalContext();

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full bg-[var(--bg)] shadow-sm border border-gray-200 dark:border-gray-800 text-[var(--fg)] hover:text-[var(--p1)] transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[90] backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-screen w-80 bg-white dark:bg-[#1a1a1a] z-[100] transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} shadow-2xl flex flex-col`}>
        
        <div className="p-8 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-3xl font-extrabold text-[var(--fg)]">Capped.</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-[var(--p3)] transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-6 space-y-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-4 px-6 py-5 rounded-2xl transition-all ${
                  isActive 
                    ? "bg-[var(--p1)] text-white font-bold shadow-md" 
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] font-medium"
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xl">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
          <Link
            href="/"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="flex items-center space-x-4 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-semibold"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </Link>
        </div>

      </div>
    </>
  );
}
