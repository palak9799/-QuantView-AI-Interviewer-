import React, { useState } from "react";
import { UserProfile } from "../types";
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock, HelpingHand, Info } from "lucide-react";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please fill out all credential spaces.");
      return;
    }

    if (password.length < 5) {
      setErrorMessage("Security restriction: Password must contain at least 5 characters.");
      return;
    }

    // Capture name from the email
    const emailPrefix = email.split("@")[0] || "Candidate";
    const beautifiedName = emailPrefix.split(".")
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    // Initialize clean UserProfile
    const defaultProfile: UserProfile = {
      name: beautifiedName,
      email: email.trim(),
      targetRole: "Software Engineer",
      experienceLevel: "Junior",
      targetIndustry: "Digital Technology",
      joinedDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" }),
      currentLevel: 1,
      xpPoints: 0,
      completedLevels: [],
      badges: [],
      streakCount: 1
    };

    // Save profile locally
    onComplete(defaultProfile);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Subtle modern background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-60" />
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[140px] pointer-events-none opacity-40" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-sky-100 rounded-full blur-[120px] pointer-events-none opacity-40" />

      {/* Spacer to push everything to center */}
      <div className="flex-grow flex flex-col items-center justify-center relative z-20 px-6 py-12">
        <div className="w-full max-w-md text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          
          {/* Logo/title at the top */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="font-extrabold text-white tracking-tighter text-2xl">Q</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight text-slate-900">QuantView</h1>
              <p className="text-xs font-semibold text-slate-500">AI Placement Assessment Coach</p>
            </div>
          </div>

          {/* Clean Standalone Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-8 shadow-xl shadow-slate-100 text-left">

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-105 rounded-xl text-xs text-red-650 font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {/* Email Input */}
              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@university.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Action Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-blue-500/10"
                >
                  <span>{isSignUpMode ? "Sign Up" : "Login"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>

            {/* Account toggle link below */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => setIsSignUpMode(!isSignUpMode)}
                className="text-xs text-blue-600 hover:text-blue-700 font-extrabold cursor-pointer"
              >
                {isSignUpMode 
                  ? "Already have an account? Sign In" 
                  : "Don't have an account? Sign Up"}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Absolute simple footer */}
      <footer className="py-4 text-center text-[10px] text-slate-400 relative z-10 font-mono tracking-wider">
        <span>QUANTVIEW • PROFESSIONAL STUDENT PORTAL</span>
      </footer>
    </div>
  );
}
