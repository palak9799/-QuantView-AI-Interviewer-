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
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [currentInterviewField, setCurrentInterviewField] = useState<string>("Computer Science");
  const [currentTotalQuestions, setCurrentTotalQuestions] = useState<number>(5);
  const [activeSession, setActiveSession] = useState<MockSession | null>(null);

  // 1. Initialise local cache values at start without bypassing the login screen
  useEffect(() => {
    try {
      const cachedHistory = localStorage.getItem("quantview_history");
      if (cachedHistory) {
        setSessionHistory(JSON.parse(cachedHistory));
      }
    } catch (e) {
      console.warn("Failed to load QuantView history settings:", e);
    }
  }, []);

  // 2. Synchronise profile completion / validation upon manual login event
  const handleOnboardingComplete = (newProfile: UserProfile) => {
    try {
      // Restore cached progress of this specific email if present to preserve level unlocks
      const cachedProfileStr = localStorage.getItem("quantview_profile");
      if (cachedProfileStr) {
        const cachedProfile = JSON.parse(cachedProfileStr);
        if (cachedProfile.email.toLowerCase() === newProfile.email.toLowerCase()) {
          // Sync existing progress
          const syncedProfile = {
            ...newProfile,
            currentLevel: cachedProfile.currentLevel || 1,
            xpPoints: cachedProfile.xpPoints || 0,
            completedLevels: cachedProfile.completedLevels || [],
            badges: cachedProfile.badges || [],
            streakCount: cachedProfile.streakCount || 1,
            targetRole: cachedProfile.targetRole || newProfile.targetRole,
            experienceLevel: cachedProfile.experienceLevel || newProfile.experienceLevel,
            targetIndustry: cachedProfile.targetIndustry || newProfile.targetIndustry,
          };
          localStorage.setItem("quantview_profile", JSON.stringify(syncedProfile));
          setProfile(syncedProfile);
          setActivePage("dashboard");
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to sync cached user profile:", e);
    }

    localStorage.setItem("quantview_profile", JSON.stringify(newProfile));
    setProfile(newProfile);
    setActivePage("dashboard");
  };

  // 3. Initiate Mock Assessment
  const handleStartInterview = (
    type: InterviewType,
    level: number = 1,
    selectedField: string = "Computer Science",
    totalQuestions: number = 5
  ) => {
    setCurrentInterviewType(type);
    setCurrentLevel(level);
    setCurrentInterviewField(selectedField);
    setCurrentTotalQuestions(totalQuestions);
    setActivePage("interview");
  };

  // 4. Save Completed Evaluation Report with dynamic gamification awards
  const handleCompleteSession = (completed: MockSession) => {
    if (!profile) return;

    const sessionWithLevel: MockSession = {
      ...completed,
      level: currentLevel,
      selectedField: currentInterviewField,
      totalQuestions: currentTotalQuestions
    };

    const overall = sessionWithLevel.evaluation?.overallScore || 70;
    const voiceScore = sessionWithLevel.evaluation?.voiceAnalysisScore || 70;
    const eyeScore = sessionWithLevel.evaluation?.eyeContactScore || 70;
    const bodyScore = sessionWithLevel.evaluation?.bodyLanguageScore || 70;

    const earnedXp = Math.round(overall * 15);
    const newXP = (profile.xpPoints || 0) + earnedXp;

    let updatedCompleted = [...(profile.completedLevels || [])];
    const scoreThresholdMet = overall >= 60;

    if (scoreThresholdMet && !updatedCompleted.includes(currentLevel)) {
      updatedCompleted.push(currentLevel);
    }

    let nextCalculatedHighestLevel = profile.currentLevel || 1;
    if (scoreThresholdMet) {
      const maxCompleted = updatedCompleted.length > 0 ? Math.max(...updatedCompleted) : 0;
      nextCalculatedHighestLevel = Math.min(5, Math.ceil(maxCompleted + 1));
    }

    let updatedBadges = [...(profile.badges || [])];
    if (scoreThresholdMet) {
      const levelBadgesMap: Record<number, string> = {
        1: "Beginner Bronze",
        2: "Basic Silver",
        3: "Intermediate Gold",
        4: "Advanced Platinum",
        5: "Expert Master"
      };
      const badgeToEarn = levelBadgesMap[currentLevel];
      if (badgeToEarn && !updatedBadges.includes(badgeToEarn)) {
        updatedBadges.push(badgeToEarn);
      }
    }

    if (overall >= 85 && !updatedBadges.includes("Elite High Scorer")) {
      updatedBadges.push("Elite High Scorer");
    }
    if (voiceScore >= 82 && !updatedBadges.includes("Silver Voice")) {
      updatedBadges.push("Silver Voice");
    }
    if (eyeScore >= 82 && !updatedBadges.includes("Flawless Focus")) {
      updatedBadges.push("Flawless Focus");
    }
    if (bodyScore >= 82 && !updatedBadges.includes("Perfect Posture")) {
      updatedBadges.push("Perfect Posture");
    }

    const updatedProfile: UserProfile = {
      ...profile,
      xpPoints: newXP,
      completedLevels: updatedCompleted,
      currentLevel: Math.max(1, nextCalculatedHighestLevel),
      badges: updatedBadges,
      streakCount: (profile.streakCount || 1) + 1
    };

    localStorage.setItem("quantview_profile", JSON.stringify(updatedProfile));
    setProfile(updatedProfile);

    const updatedHistory = [sessionWithLevel, ...sessionHistory];
    setSessionHistory(updatedHistory);
    localStorage.setItem("quantview_history", JSON.stringify(updatedHistory));
    
    setActiveSession(sessionWithLevel);
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
            interviewLevel={currentLevel}
            selectedField={currentInterviewField}
            totalQuestions={currentTotalQuestions}
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
