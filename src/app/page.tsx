"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";

export default function AuthPage() {
  const { authMode, profile, loginAsReturningUser, loginAsSignup, loginAsGuest } = useGlobalContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (authMode) {
      if (profile) router.push("/dashboard");
      else router.push("/onboarding");
    }
  }, [authMode, profile, router]);

  const handleLogin = () => {
    setLoading(true);
    loginAsReturningUser();
    router.push("/dashboard");
  };

  const handleSignup = () => {
    setLoading(true);
    loginAsSignup();
    router.push("/onboarding?mode=signup");
  };

  const handleSkip = () => {
    setLoading(true);
    loginAsGuest();
    router.push("/onboarding?mode=guest");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[var(--bg)] transition-colors duration-300">
      <div className="w-full max-w-sm flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Logo and Branding */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-20 h-20 bg-[var(--p1)] rounded-3xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--fg)]">Capped.</h1>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 font-medium">
            Smart expense tracking for students.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col space-y-4 mt-8">
          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center py-3.5 px-4 rounded-2xl bg-[var(--p1)] text-white font-semibold shadow-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Loading..." : "Log In"}
          </button>
          
          <button 
            onClick={handleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center py-3.5 px-4 rounded-2xl border-2 border-[var(--p2)] text-[var(--p2)] font-semibold hover:bg-[var(--p2)] hover:text-white active:scale-95 transition-all disabled:opacity-50"
          >
            Sign Up
          </button>
        </div>

        {/* Divider & Skip */}
        <div className="w-full flex items-center mt-6">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
          <span className="px-4 text-xs text-gray-400 font-medium uppercase tracking-wider">or</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
        </div>

        <button 
          onClick={handleSkip}
          disabled={loading}
          className="text-sm font-semibold text-gray-500 hover:text-[var(--p3)] transition-colors disabled:opacity-50"
        >
          Skip & Continue as Guest
        </button>

      </div>
    </div>
  );
}
