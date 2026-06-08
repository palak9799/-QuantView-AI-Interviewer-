import React, { useState, useEffect } from "react";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import InterviewRoom from "./components/InterviewRoom";
import FeedbackRoom from "./components/FeedbackRoom";
import { UserProfile, MockSession, InterviewType } from "./types";
import { Sparkles, Power, Github, LayoutGrid, Award, LogOut } from "lucide-react";

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessionHistory, setSessionHistory] = useState<MockSession[]>([]);
  const [activePage, setActivePage] = useState<"onboarding" | "dashboard" | "interview" | "feedback">("onboarding");
  const [currentInterviewType, setCurrentInterviewType] = useState<InterviewType>("hr");
  const [activeSession, setActiveSession] = useState<MockSession | null>(null);

  // 1. Initialise local cache values
  useEffect(() => {
    try {
      const cachedProfile = localStorage.getItem("quantview_profile");
      const cachedHistory = localStorage.getItem("quantview_history");

      if (cachedProfile) {
        const parsedProfile = JSON.parse(cachedProfile);
        setProfile(parsedProfile);
        setActivePage("dashboard");
      }

      if (cachedHistory) {
        setSessionHistory(JSON.parse(cachedHistory));
      }
    } catch (e) {
      console.warn("Failed to load QuantView local storage settings:", e);
    }
  }, []);

  // 2. Synchronise profile completion
  const handleOnboardingComplete = (newProfile: UserProfile) => {
    localStorage.setItem("quantview_profile", JSON.stringify(newProfile));
    setProfile(newProfile);
    setActivePage("dashboard");
  };

  // 3. Initiate Mock Assessment
  const handleStartInterview = (type: InterviewType) => {
    setCurrentInterviewType(type);
    setActivePage("interview");
  };

  // 4. Save Completed Evaluation Report
  const handleCompleteSession = (completed: MockSession) => {
    const updatedHistory = [completed, ...sessionHistory];
    setSessionHistory(updatedHistory);
    localStorage.setItem("quantview_history", JSON.stringify(updatedHistory));
    
    setActiveSession(completed);
    setActivePage("feedback");
  };

  const handleViewFeedback = (session: MockSession) => {
    setActiveSession(session);
    setActivePage("feedback");
  };

  const handleCleanSignOut = () => {
    if (confirm("Sign out of QuantView? History records are stored strictly in this browser space.")) {
      localStorage.removeItem("quantview_profile");
      localStorage.removeItem("quantview_history");
      setProfile(null);
      setSessionHistory([]);
      setActivePage("onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      
      {/* Dynamic Global Top Header Navigation (Dashboard, Feedback Screens) */}
      {profile && activePage !== "interview" && (
        <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="font-bold text-slate-950 tracking-tighter text-lg text-white">Q</span>
              </div>
              <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                QuantView <span className="text-xs font-mono px-1.5 py-0.5 ml-1.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">AI Coach</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-400 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg">
                <LayoutGrid className="w-3.5 h-3.5 text-cyan-500" />
                <span className="font-semibold text-slate-300">Diagnostic Suite Active</span>
              </div>

              <button
                onClick={handleCleanSignOut}
                className="text-slate-500 hover:text-red-400 text-xs font-medium font-mono px-3 py-1.5 rounded-lg border border-slate-800/80 hover:border-red-500/20 hover:bg-red-500/5 transition-all text-center flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Primary Page Router Render Router Box */}
      <div className="flex-grow">
        {activePage === "onboarding" && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}

        {activePage === "dashboard" && profile && (
          <Dashboard
            userProfile={profile}
            sessionHistory={sessionHistory}
            onStartInterview={handleStartInterview}
            onViewFeedback={handleViewFeedback}
          />
        )}

        {activePage === "interview" && profile && (
          <InterviewRoom
            userProfile={profile}
            interviewType={currentInterviewType}
            onCompleteSession={handleCompleteSession}
            onCancel={() => setActivePage("dashboard")}
          />
        )}

        {activePage === "feedback" && activeSession && (
          <FeedbackRoom
            session={activeSession}
            onBackToDashboard={() => {
              setActiveSession(null);
              setActivePage("dashboard");
            }}
          />
        )}
      </div>

    </div>
  );
}
