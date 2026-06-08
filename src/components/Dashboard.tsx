import React, { useState } from "react";
import { UserProfile, MockSession, InterviewType } from "../types";
import { 
  User, Calendar, Play, FileText, ChevronRight, BarChart3, TrendingUp, Clock, 
  Search, Shield, Compass, BookOpen, Award, CheckCircle2, History, AlertCircle,
  Lock, Flame, Dumbbell, Zap, Star, Sparkles, Download, CircleDot, RefreshCw
} from "lucide-react";

interface DashboardProps {
  userProfile: UserProfile;
  sessionHistory: MockSession[];
  onStartInterview: (type: InterviewType, level: number, selectedField: string, totalQuestions: number) => void;
  onViewFeedback: (session: MockSession) => void;
}

const interviewFields = [
  "Computer Science",
  "IT",
  "Software Engineering",
  "Civil Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Electronics Engineering",
  "MBA",
  "Finance",
  "Marketing",
  "HR",
  "Healthcare",
  "Teaching",
  "Government Jobs",
  "Banking",
  "Law",
  "Pharmacy",
  "Agriculture",
  "Architecture",
  "Hotel Management",
  "General Interview"
];

export default function Dashboard({ userProfile, sessionHistory, onStartInterview, onViewFeedback }: DashboardProps) {
  const [activeSessionTab, setActiveSessionTab] = useState<InterviewType>("hr");
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState<string>("Computer Science");
  const [questionsCountValue, setQuestionsCountValue] = useState<number | "custom">(5);
  const [customQuestionsCount, setCustomQuestionsCount] = useState<number>(8);

  const totalSessions = sessionHistory.length;
  const evaluatedSessions = sessionHistory.filter(s => s.status === "evaluated");
  
  // Calculate analytics averages
  const overallAverage = evaluatedSessions.length > 0 
    ? Math.round(evaluatedSessions.reduce((acc, s) => acc + (s.evaluation?.overallScore || 0), 0) / evaluatedSessions.length)
    : 0;

  const avgComm = evaluatedSessions.length > 0 
    ? Math.round(evaluatedSessions.reduce((acc, s) => acc + (s.evaluation?.communicationScore || 0), 0) / evaluatedSessions.length)
    : 0;

  const avgConf = evaluatedSessions.length > 0 
    ? Math.round(evaluatedSessions.reduce((acc, s) => acc + (s.evaluation?.confidenceScore || 0), 0) / evaluatedSessions.length)
    : 0;

  const avgBody = evaluatedSessions.length > 0 
    ? Math.round(evaluatedSessions.reduce((acc, s) => acc + (s.evaluation?.bodyLanguageScore || 0), 0) / evaluatedSessions.length)
    : 0;

  const avgTech = evaluatedSessions.length > 0 
    ? Math.round(evaluatedSessions.reduce((acc, s) => acc + (s.evaluation?.technicalPerformanceScore || 0), 0) / evaluatedSessions.length)
    : 0;

  // Levels metadata
  const levelsInfo = [
    { num: 1, name: "Beginner", desc: "Foundational, simple structured screening inquiries to set candidate footing." },
    { num: 2, name: "Basic", desc: "Standard recruiter metrics, fundamental knowledge, standard behavioral STAR questions." },
    { num: 3, name: "Intermediate", desc: "Cross-functional systems design, complex logic puzzles, situational scenario-mapping." },
    { num: 4, name: "Advanced", desc: "Stress testing, algorithmic bottleneck optimization, leadership-conflict resolutions." },
    { num: 5, name: "Expert", desc: "High architectural abstractions, enterprise-level scale plans, tricky aptitude traps." },
  ];

  // Track descriptions for launch buttons
  const tracksInfo = {
    hr: {
      title: "HR Screening Track",
      desc: "Designed to prepare you for critical screenings regarding company alignment, culture fitness, salary expectations, and long-term targets.",
      topics: ["Culture fit", "Conflict resolution", "Career goals"]
    },
    technical: {
      title: "Technical Engineering Track",
      desc: "Engineered for deep-dive technical and engineering roles. Covers system constraints, code patterns, optimization plans, and logic frameworks.",
      topics: ["System Design", "Cloud scaling", "Performance loops"]
    },
    behavioral: {
      title: "Behavioral situations Track",
      desc: "Prepares you for the STAR framework (Situation, Task, Action, Result) questions common with major enterprise recruiters.",
      topics: ["Leadership", "STAR Framework", "Mistake responses"]
    },
    aptitude: {
      title: "Aptitude & Logic",
      desc: "Fast paced quantitative analysis, mathematical riddles, and logical workflow descriptions to test raw cognitive reflexes.",
      topics: ["Logical reasoning", "Estimation logs", "Math logic"]
    },
    placement: {
      title: "Campus Placement Preparation",
      desc: "Comprehensive college mock track designed alongside academy guidance to maximize hiring and success statistics.",
      topics: ["Self introductions", "Skill highlights", "Project deep dive"]
    }
  };

  // Achievements library with description and icons
  const badgesLibrary = [
    { name: "Beginner Bronze", desc: "Master Level 1 of QuantView Mock prep.", icon: "🥉" },
    { name: "Basic Silver", desc: "Unlocks Level 2 with standard core reviews.", icon: "🥈" },
    { name: "Intermediate Gold", desc: "Completed Level 3 showing high comprehension.", icon: "🥇" },
    { name: "Advanced Platinum", desc: "Completed Level 4 challenging system questions.", icon: "💎" },
    { name: "Expert Master", desc: "Completed Level 5 with ultimate high-fidelity results.", icon: "👑" },
    { name: "Silver Voice", desc: "Maintained WPM pacing correctness and clean clarity.", icon: "🎙️" },
    { name: "Flawless Focus", desc: "Achieved >= 82% camera gaze stability.", icon: "👁️" },
    { name: "Perfect Posture", desc: "Maintained accurate forward chest alignment tracking.", icon: "🧘" },
    { name: "Elite High Scorer", desc: "Scored an exceptional overall score rating of >= 85%.", icon: "🏆" }
  ];

  // Game tracking state
  const completedCount = userProfile.completedLevels?.length || 0;
  const progressPercent = Math.round((completedCount / 5) * 100);
  const currentXP = userProfile.xpPoints || 0;
  const streak = userProfile.streakCount || 1;
  const currentLvlName = levelsInfo.find(l => l.num === userProfile.currentLevel)?.name || "Beginner";

  // Check if level is unlocked (Level 1 is unlocked by default, others unlocked when level-1 is completed)
  const isLevelUnlocked = (lvlNum: number) => {
    if (lvlNum === 1) return true;
    return userProfile.completedLevels?.includes(lvlNum - 1);
  };

  const activeLevelDetails = levelsInfo.find(l => l.num === selectedLevel) || levelsInfo[0];

  // Recommended Practice Resources based on scores
  const getPracticeRecommendations = () => {
    const list = [
      {
        title: "The 3-Second Breath Technique",
        cat: "Confidence Drill",
        desc: "Rhythmic breathing exercises programmed to lower voice pitch, steady heart pace, and eliminate rapid vocal start spikes.",
        time: "5 mins"
      },
      {
        title: "STAR Structural Response Blueprint",
        cat: "Recruiting STAR",
        desc: "Interactive guide on parsing prompts instantly to lay out Situation, Task, Action, and Quantitative Outcomes.",
        time: "10 mins"
      },
      {
        title: "Eye-Lock Lens Focus Stabilisation",
        cat: "Sensory Gaze",
        desc: "Aesthetic vision adjustment drill to stabilize camera focus tracking metrics.",
        time: "6 mins"
      }
    ];
    return list;
  };

  // Filter session records
  const filteredHistory = sessionHistory.filter(session => {
    if (!searchTerm) return true;
    return session.interviewType.toLowerCase().includes(searchTerm.toLowerCase()) || 
           `level ${session.level}`.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 sm:p-10 relative overflow-hidden">
      {/* Decorative Light Aesthetic Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[140px] pointer-events-none opacity-40" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-sky-100 rounded-full blur-[120px] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Profile Grid Header */}
        <div id="dashboard_summary" className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-top-4 duration-300">
          
          {/* User info left */}
          <div className="lg:col-span-5 flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-blue-500/20 shrink-0">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{userProfile.name}</h2>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase">QuantView Pro User</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-none">
                {userProfile.email}
              </p>
              <p className="text-xs text-slate-400 font-medium mt-2 flex items-center gap-2">
                <span>Joined QuantView: {userProfile.joinedDate}</span>
              </p>
            </div>
          </div>

          {/* Gamified metric pillars center-right */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 lg:divide-x divide-slate-100">
            
            {/* Level progression */}
            <div className="px-3 text-center sm:text-left">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Level</span>
              <div className="flex items-baseline justify-center sm:justify-start gap-1 mt-1.5">
                <span className="text-2xl font-black text-blue-600">{userProfile.currentLevel}</span>
                <span className="text-xs font-semibold text-slate-400">/ 5</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 block mt-0.5">Level {userProfile.currentLevel} – {currentLvlName}</span>
            </div>

            {/* Streak count */}
            <div className="px-3 text-center sm:text-left">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider text-amber-500 flex items-center justify-center sm:justify-start gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" /> Active Streak
              </span>
              <span className="text-2xl font-black text-slate-800 mt-1.5 block leading-none">{streak} Days</span>
              <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">Consecutive Mock Drills</span>
            </div>

            {/* XP Points */}
            <div className="px-3 text-center sm:text-left">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider text-emerald-500 flex items-center justify-center sm:justify-start gap-1">
                <Star className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" /> Total Balance
              </span>
              <span className="text-2xl font-black text-emerald-600 mt-1.5 block leading-none">{currentXP} XP</span>
              <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">Earning x15 on Scores</span>
            </div>

            {/* Badges Count */}
            <div className="px-3 text-center sm:text-left">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trophies Earned</span>
              <span className="text-2xl font-black text-slate-800 mt-1.5 block leading-none">{(userProfile.badges || []).length} Trophies</span>
              <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">Across Level Pathways</span>
            </div>

          </div>

        </div>

        {/* Level Progression Road & Launch Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Timeline Pathway Left: 5 levels selector */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600" />
                Level Progression Path
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Complete assessments at each tier with score &gt;= 60% to unlock the subsequent level. Difficulty ramps with progression.
              </p>
            </div>

            {/* Micro progress gauge */}
            <div className="bg-blue-50/50 rounded-xl p-3 bg-gradient-to-r from-blue-50/40 to-sky-50/40 border border-blue-50 flex items-center justify-between gap-4">
              <div className="flex-grow space-y-1">
                <div className="flex justify-between text-[10px] font-bold uppercase text-blue-800">
                  <span>Pathway Complete</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-blue-100 text-center shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Completed</span>
                <span className="text-base font-black text-slate-950 mt-1 inline-block leading-none">{completedCount} / 5</span>
              </div>
            </div>

            {/* Dynamic Interactive Timeline List */}
            <div className="space-y-3">
              {levelsInfo.map((lvl) => {
                const unlocked = isLevelUnlocked(lvl.num);
                const completed = userProfile.completedLevels?.includes(lvl.num);
                const isActive = selectedLevel === lvl.num;

                return (
                  <button
                    key={lvl.num}
                    onClick={() => {
                      if (unlocked) {
                        setSelectedLevel(lvl.num);
                      }
                    }}
                    disabled={!unlocked}
                    className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all relative ${
                      isActive 
                        ? "bg-blue-50/50 border-blue-600/80 shadow-md shadow-blue-500/5 ring-1 ring-blue-600/20" 
                        : unlocked
                          ? "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
                          : "bg-slate-100/60 border-slate-100 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      {/* Circle indicator state */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border transition-all ${
                        completed 
                          ? "bg-slate-100 text-emerald-600 border-slate-300" 
                          : isActive
                            ? "bg-blue-600 text-white border-blue-600"
                            : unlocked
                              ? "bg-blue-50 text-blue-600 border-blue-200"
                              : "bg-slate-200 text-slate-400 border-slate-300"
                      }`}>
                        {completed ? "✓" : `L${lvl.num}`}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">Level {lvl.num} – {lvl.name}</span>
                          {completed && (
                            <span className="text-[9px] font-bold text-emerald-600 uppercase bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug line-clamp-1">
                          {lvl.desc}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 leading-none">
                      {!unlocked ? (
                        <Lock className="w-4 h-4 text-slate-400" />
                      ) : (
                        <CircleDot className={`w-4 h-4 ${isActive ? 'text-blue-600 animate-pulse' : 'text-slate-300 hover:text-slate-400'}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Setup / Category Room details Right: 7 columns */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                QuantView AI Interviewer Launcher
              </h3>
              <p className="text-xs text-slate-500">
                Configure your target interviewer category, professional field, and question list size.
              </p>
            </div>

            {/* Target Select Track Grid */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">1. Select Interview Category Track</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {(["hr", "technical", "behavioral", "aptitude", "placement"] as InterviewType[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveSessionTab(tab)}
                    className={`capitalize text-xs font-bold py-2.5 px-2.5 rounded-xl border transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      activeSessionTab === tab 
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-base">
                      {tab === "hr" ? "👤" : tab === "technical" ? "💻" : tab === "behavioral" ? "🤝" : tab === "aptitude" ? "🧠" : "🎓"}
                    </span>
                    <span className="truncate w-full block text-[11px] font-bold">
                      {tab === "hr" ? "HR Screening" : tab}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Choose Interview Professional Field */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <span>2. Select Professional Field</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Adaptive Generation</span>
              </label>
              <div className="relative">
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 text-xs sm:text-sm font-bold px-4 py-3 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                >
                  {interviewFields.map((field) => (
                    <option key={field} value={field} className="font-semibold text-slate-800 bg-white">
                      💼 {field}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            {/* Step 3: Choose Number of Questions */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <span>3. Select Number of Questions</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Rounds</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {([3, 5, 10, 15, "custom"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setQuestionsCountValue(opt)}
                    className={`font-bold py-2 rounded-xl border transition-all text-center flex flex-col items-center justify-center cursor-pointer text-xs ${
                      questionsCountValue === opt
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/15 font-extrabold"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <span>{opt === "custom" ? "Custom" : `${opt} Qs`}</span>
                  </button>
                ))}
              </div>

              {/* Custom question count input */}
              {questionsCountValue === "custom" && (
                <div className="flex items-center gap-2 mt-2 animate-in slide-in-from-top-1 duration-250">
                  <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Enter custom round count (1 to 25):</span>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={customQuestionsCount}
                    onChange={(e) => {
                      const parsed = parseInt(e.target.value);
                      if (!isNaN(parsed)) {
                        setCustomQuestionsCount(Math.min(25, Math.max(1, parsed)));
                      }
                    }}
                    className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-extrabold focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-center"
                  />
                </div>
              )}
            </div>

            {/* Launcher configuration context card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 flex-grow flex flex-col justify-between">
              
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-slate-900 capitalize">
                    {tracksInfo[activeSessionTab].title}
                  </h4>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    Difficulty: Level {selectedLevel} ({activeLevelDetails.name})
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {tracksInfo[activeSessionTab].desc} for candidate in <strong className="text-slate-800 font-extrabold">"{selectedField}"</strong> category.
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                  <span className="text-[11px] font-semibold text-slate-400">Parameters checked:</span>
                  {tracksInfo[activeSessionTab].topics.map((item) => (
                    <span key={item} className="text-[10px] font-bold font-mono bg-white text-slate-500 border border-slate-200 px-2.5 py-1 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Warnings and checklist before beginning */}
              <div className="border-t border-slate-200/80 pt-4 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>
                    Interactive Voice Mock Loop: {questionsCountValue === "custom" ? customQuestionsCount : questionsCountValue} Rounds
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const actualCount = questionsCountValue === "custom" ? customQuestionsCount : questionsCountValue;
                    onStartInterview(activeSessionTab, selectedLevel, selectedField, actualCount);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3.5 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <Play className="w-4 h-4 text-white fill-white" />
                  <span>Launch QuantView AI Interviewer</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* History Evaluations Panel & Achievements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          
          {/* Previous Reports (7 col) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/95 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-600" />
                  Interactive Mock Records & Reports
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Detailed lists of historic candidate assessments.</p>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter track or level..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white w-full sm:w-44"
                />
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="py-12 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2.5" />
                <p className="text-xs font-bold">No matching records registered.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Please run mocks at matching unlocked levels.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold bg-slate-50 text-[10px] uppercase tracking-wider">
                      <th className="py-3 px-4 rounded-l-xl">Track</th>
                      <th className="py-3 px-4">Level Tested</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Interactions</th>
                      <th className="py-3 px-4">Overall Score</th>
                      <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-3.5 px-4 capitalize font-extrabold text-slate-900 flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${
                            item.interviewType === "technical" ? "bg-amber-500" :
                            item.interviewType === "hr" ? "bg-blue-500" : "bg-sky-500"
                          }`} />
                          <span>{item.interviewType === "hr" ? "HR Screening" : item.interviewType}</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-600 font-mono">
                          Level {item.level || 1}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">3 Rounds Mock</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                          {item.evaluation ? (
                            <span className={`text-sm ${
                              item.evaluation.overallScore >= 80 ? "text-emerald-600" :
                              item.evaluation.overallScore >= 70 ? "text-blue-600" : "text-amber-600"
                            }`}>
                              {item.evaluation.overallScore}%
                            </span>
                          ) : (
                            <span className="text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded text-[9px] font-bold">Analysis Pending</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onViewFeedback(item)}
                            className="bg-blue-50 border border-blue-100 text-[11px] font-extrabold text-blue-700 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ml-auto cursor-pointer"
                          >
                            <span>Open Coach Report</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Achievement Chest & locked badges lists (5 col) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/95 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Achievements & Badges Chest
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Mock drills earn you permanent achievements based on score, verbal clarity, and facial postures.
              </p>
            </div>

            {/* Badge interactive visual grid list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-grow overflow-y-auto max-h-[300px] pr-1">
              {badgesLibrary.map((badge) => {
                const earned = userProfile.badges?.includes(badge.name);
                
                return (
                  <div 
                    key={badge.name} 
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                      earned 
                        ? "bg-blue-50/45 border-blue-200 text-slate-800"
                        : "bg-slate-50 border-slate-100 text-slate-400 opacity-60"
                    }`}
                  >
                    <div className="text-2xl filter drop-shadow-sm leading-none select-none">
                      {earned ? badge.icon : "🔒"}
                    </div>
                    <div>
                      <h4 className={`text-xs font-extrabold ${earned ? 'text-slate-900' : 'text-slate-400'}`}>{badge.name}</h4>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5 line-clamp-2">{badge.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-400 font-semibold font-mono">
              <span>Diagnostic Level Pathways</span>
              <span className="text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                Active Prep Loop
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
