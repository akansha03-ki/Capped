"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type AuthMode = "guest" | "logged-in" | null;

export interface Transaction {
  id: string;
  date: string;
  title: string;
  category: string;
  amount: number;
  type: "expense" | "income";
}

export interface SplitPerson {
  id: string;
  name: string;
  amount: number;
}

export interface SplitBill {
  id: string;
  date: string;
  title: string;
  category: string;
  totalAmount: number;
  people: SplitPerson[];
  method: "Equally" | "Unequally";
}

export interface UserProfile {
  budgetDestroyer: string[];
  monthlyBudget: number;
  spendHabit: string;
  name?: string;
  email?: string;
}

interface GlobalContextType {
  authMode: AuthMode;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  splitBills: SplitBill[];
  addSplitBill: (bill: Omit<SplitBill, "id">) => void;
  logout: () => void;
  loginAsReturningUser: () => void;
  loginAsSignup: () => void;
  loginAsGuest: () => void;
  seedDummyData: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// ── localStorage helpers ──
const LS_KEYS = {
  AUTH: "capped_authMode",
  PROFILE: "capped_profile",
  TX: "capped_transactions",
  BILLS: "capped_splitBills",
};

function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function lsSet(key: string, value: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Dummy data generators ──
function generateDummyTransactions(): Transaction[] {
  const now = Date.now();
  const day = 86400000;
  return [
    { id: "tx-1", date: new Date(now).toISOString(), title: "Late Night Pizza", category: "Restaurant", amount: 450, type: "expense" },
    { id: "tx-2", date: new Date(now - day).toISOString(), title: "Freelance Gig", category: "Income", amount: 5000, type: "income" },
    { id: "tx-3", date: new Date(now - day * 2).toISOString(), title: "Netflix Subscription", category: "Utilities", amount: 199, type: "expense" },
    { id: "tx-4", date: new Date(now - day * 3).toISOString(), title: "Uber to College", category: "Transport", amount: 320, type: "expense" },
    { id: "tx-5", date: new Date(now - day * 3).toISOString(), title: "Stationery Haul", category: "Stationary", amount: 275, type: "expense" },
    { id: "tx-6", date: new Date(now - day * 4).toISOString(), title: "Iced Latte", category: "Snacks and Bevs", amount: 180, type: "expense" },
    { id: "tx-7", date: new Date(now - day * 5).toISOString(), title: "Mom Sent Money", category: "Income", amount: 10000, type: "income" },
    { id: "tx-8", date: new Date(now - day * 6).toISOString(), title: "Movie Night", category: "Impulse", amount: 600, type: "expense" },
    { id: "tx-9", date: new Date(now - day * 7).toISOString(), title: "Zara T-Shirt", category: "Clothing", amount: 1499, type: "expense" },
    { id: "tx-10", date: new Date(now - day * 8).toISOString(), title: "Group Project Supplies", category: "Project", amount: 350, type: "expense" },
    { id: "tx-11", date: new Date(now - day * 10).toISOString(), title: "Parcel – Phone Case", category: "Parcel", amount: 499, type: "expense" },
    { id: "tx-12", date: new Date(now - day * 12).toISOString(), title: "Salon Visit", category: "Hygiene", amount: 800, type: "expense" },
  ];
}

function generateDummySplitBills(): SplitBill[] {
  return [
    {
      id: "sb-1",
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      title: "Dinner at McDonald's",
      category: "Restaurant",
      totalAmount: 1200,
      people: [
        { id: "p1", name: "Arjun", amount: 400 },
        { id: "p2", name: "Priya", amount: 400 },
        { id: "p3", name: "Rohan", amount: 400 },
      ],
      method: "Equally",
    },
    {
      id: "sb-2",
      date: new Date(Date.now() - 86400000 * 7).toISOString(),
      title: "Uber Pool to Concert",
      category: "Transport",
      totalAmount: 800,
      people: [
        { id: "p4", name: "Sneha", amount: 400 },
        { id: "p5", name: "Karan", amount: 400 },
      ],
      method: "Equally",
    },
  ];
}

function generateReturningProfile(): UserProfile {
  return {
    name: "Returning User",
    email: "user@capped.app",
    budgetDestroyer: ["Restaurant", "Impulse", "Snacks and Bevs"],
    monthlyBudget: 15000,
    spendHabit: "Weekend",
  };
}

// ── Provider ──
export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [splitBills, setSplitBills] = useState<SplitBill[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setAuthMode(lsGet<AuthMode>(LS_KEYS.AUTH, null));
    setProfileState(lsGet<UserProfile | null>(LS_KEYS.PROFILE, null));
    setTransactions(lsGet<Transaction[]>(LS_KEYS.TX, []));
    setSplitBills(lsGet<SplitBill[]>(LS_KEYS.BILLS, []));
    setIsLoaded(true);
  }, []);

  // ── Setters that persist ──
  const setProfile = useCallback((newProfile: UserProfile) => {
    setProfileState(newProfile);
    lsSet(LS_KEYS.PROFILE, newProfile);
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, "id">) => {
    setTransactions((prev) => {
      const newTx: Transaction = { ...transaction, id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` };
      const updated = [newTx, ...prev];
      lsSet(LS_KEYS.TX, updated);
      return updated;
    });
  }, []);

  const addSplitBill = useCallback((bill: Omit<SplitBill, "id">) => {
    setSplitBills((prev) => {
      const newBill: SplitBill = { ...bill, id: `sb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` };
      const updated = [newBill, ...prev];
      lsSet(LS_KEYS.BILLS, updated);
      return updated;
    });
  }, []);

  // ── Seed dummy data (transactions + split bills) ──
  const seedDummyData = useCallback(() => {
    const dummyTx = generateDummyTransactions();
    const dummyBills = generateDummySplitBills();
    setTransactions(dummyTx);
    setSplitBills(dummyBills);
    lsSet(LS_KEYS.TX, dummyTx);
    lsSet(LS_KEYS.BILLS, dummyBills);
  }, []);

  // ── Auth modes ──
  const loginAsReturningUser = useCallback(() => {
    const mode: AuthMode = "logged-in";
    const prof = generateReturningProfile();
    const dummyTx = generateDummyTransactions();
    const dummyBills = generateDummySplitBills();
    setAuthMode(mode);
    setProfileState(prof);
    setTransactions(dummyTx);
    setSplitBills(dummyBills);
    lsSet(LS_KEYS.AUTH, mode);
    lsSet(LS_KEYS.PROFILE, prof);
    lsSet(LS_KEYS.TX, dummyTx);
    lsSet(LS_KEYS.BILLS, dummyBills);
  }, []);

  const loginAsSignup = useCallback(() => {
    const mode: AuthMode = "logged-in";
    setAuthMode(mode);
    setProfileState(null);
    setTransactions([]);
    setSplitBills([]);
    lsSet(LS_KEYS.AUTH, mode);
    lsSet(LS_KEYS.PROFILE, null);
    lsSet(LS_KEYS.TX, []);
    lsSet(LS_KEYS.BILLS, []);
  }, []);

  const loginAsGuest = useCallback(() => {
    const mode: AuthMode = "guest";
    setAuthMode(mode);
    setProfileState(null);
    setTransactions([]);
    setSplitBills([]);
    lsSet(LS_KEYS.AUTH, mode);
    lsSet(LS_KEYS.PROFILE, null);
    lsSet(LS_KEYS.TX, []);
    lsSet(LS_KEYS.BILLS, []);
  }, []);

  const logout = useCallback(() => {
    setAuthMode(null);
    setProfileState(null);
    setTransactions([]);
    setSplitBills([]);
    localStorage.removeItem(LS_KEYS.AUTH);
    localStorage.removeItem(LS_KEYS.PROFILE);
    localStorage.removeItem(LS_KEYS.TX);
    localStorage.removeItem(LS_KEYS.BILLS);
  }, []);

  if (!isLoaded) return null;

  return (
    <GlobalContext.Provider value={{
      authMode, profile, setProfile, transactions, addTransaction, splitBills, addSplitBill, logout,
      loginAsReturningUser, loginAsSignup, loginAsGuest, seedDummyData,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
