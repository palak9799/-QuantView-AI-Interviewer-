import React, { useState } from "react";
import { UserProfile, MockSession, InterviewType } from "../types";
import { 
  User, Calendar, Play, FileText, ChevronRight, BarChart3, TrendingUp, Clock, 
  Search, Shield, Compass, BookOpen, Award, CheckCircle2, History, AlertCircle
} from "lucide-react";

interface DashboardProps {
  userProfile: UserProfile;
  sessionHistory: MockSession[];
  onStartInterview: (type: InterviewType) => void;
  onViewFeedback: (session: MockSession) => void;
}

export default function Dashboard({ userProfile, sessionHistory, onStartInterview, onViewFeedback }: DashboardProps) {
  const [activeSessionTab, setActiveSessionTab] = useState<InterviewType>("hr");
  const [searchTerm, setSearchTerm] = useState("");

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

  // Track descriptions for launch buttons
  const tracksInfo = {
    hr: {
      title: "HR Recruiters Track",
      desc: "Designed to prepare you for critical screenings regarding company alignment, core values, culture fitness, salary inquiries, and long-term targets.",
      duration: "approx. 10 mins",
      difficulty: "Intermediate",
      topics: ["Culture fit", "Conflict resolution", "Carrier goals"]
    },
    technical: {
      title: "Technical Architects Track",
      desc: "Engineered for engineering, technical, and analytical roles. Covers algorithmic structures, systems design, architecture choices, and problem-solving.",
      duration: "approx. 15 mins",
      difficulty: "Advanced",
      topics: ["System Design", "APIs", "Data Structures"]
    },
    behavioral: {
      title: "Behavioral Situations Track",
      desc: "Prepares you for the popular STAR framework (Situation, Task, Action, Result) questioning used by top tier tech, banking, and consulting companies.",
      duration: "approx. 12 mins",
      difficulty: "Intermediate",
      topics: ["Leadership", "STAR Framework", "Dealing with failure"]
    },
    aptitude: {
      title: "Aptitude & Critical Logic",
      desc: "Fast paced quantitative analysis, mathematical problem solving, reasoning riddles, and logical workflow descriptions to verify mental speed.",
      duration: "approx. 8 mins",
      difficulty: "Intermediate",
      topics: ["Logical reasoning", "Guesstimations", "Math logic"]
    },
    placement: {
      title: "Campus Placement Preparation",
      desc: "Complete campus placement and mock training preparation track designed alongside major academy directives to maximize hiring rates.",
      duration: "approx. 15 mins",
      difficulty: "Beginner-friendly",
      topics: ["Self introduction", "Skill highlights", "Project reviews"]
    }
  };

  // Recommended Practice Resources based on scores
  const getPracticeRecommendations = () => {
    const list = [
      {
        title: "The 3-Second Breath Technique",
        cat: "Confidence Drill",
        desc: "A rhythmic vocal exercise designed by QuantView to lower voice frequency pitch, steady the pulse, and eliminate rapid vocal start spikes.",
        time: "5 mins"
      },
      {
        title: "STAR Structural Response Blueprint",
        cat: "HR/Behavioral",
        desc: "Interactive guide on parsing prompts instantly to lay out Situation, Task, Action, and Quantitative Outcomes clearly.",
        time: "10 mins"
      },
      {
        title: "Eye-Lock Lens Focus Stabilisation",
        cat: "Sensory Habits",
        desc: "Interactive visual exercises on adjusting head tilt and maintaining steady center-gaze alignment to maximize camera sensory metrics.",
        time: "6 mins"
      }
    ];
    if (avgTech > 0 && avgTech < 80) {
      list.unshift({
        title: "Whiteboard Architectural Synthesiser",
        cat: "Technical Mastery",
        desc: "Technique to outline microservice abstractions and cache patterns concurrently while keeping vocal speech fluent.",
        time: "15 mins"
      });
    }
    return list;
  };

  // Filter history
  const filteredHistory = sessionHistory.filter(session => {
    if (!searchTerm) return true;
    return session.interviewType.toLowerCase().includes(searchTerm.toLowerCase()) || 
           session.status.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 sm:p-10 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Profile / Greeting Bar */}
        <div id="dashboard_onboard_header" className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-slate-950 font-bold border-2 border-slate-800 shadow-lg shadow-blue-500/15">
              <span className="text-xl inline-block uppercase text-white">{userProfile.name.charAt(0)}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-white mb-0.5">{userProfile.name}</h2>
                <span className="text-[10px] font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">QUANTVIEW CERTIFIED</span>
              </div>
              <p className="text-sm text-slate-400 flex items-center gap-2.5">
                <span>{userProfile.targetRole}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span>{userProfile.experienceLevel} Level</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span>Onboarded: {userProfile.joinedDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 divide-x divide-slate-800 border-t md:border-t-0 pt-4 md:pt-0 border-slate-800 bg-slate-950/20 px-4 py-3 rounded-lg">
            <div className="text-center px-4">
              <span className="block text-xs font-mono text-slate-500 uppercase tracking-widest">Total Sessions</span>
              <span className="text-2xl font-extrabold font-mono text-white mt-1 block">{totalSessions}</span>
            </div>
            <div className="text-center px-6">
              <span className="block text-xs font-mono text-slate-500 uppercase tracking-widest">Overall Score</span>
              <span className="text-2xl font-extrabold font-mono text-blue-400 mt-1 block">
                {overallAverage > 0 ? `${overallAverage}/100` : "No Scores"}
              </span>
            </div>
          </div>
        </div>

        {/* Major Analytics Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Launch Tracks - 7 cols */}
          <div id="interview_launchpad" className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-lg bg-blue-500 shadow-sm shadow-blue-500" />
                  AI Interviewer Rooms
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Select a category track below; configured with natural voice interaction prompts.</p>
              </div>
            </div>

            {/* Track Selector Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              {(["hr", "technical", "behavioral", "aptitude", "placement"] as InterviewType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSessionTab(tab)}
                  className={`flex-grow capitalize text-xs font-semibold py-2 px-3 rounded-lg transition-all cursor-pointer ${
                    activeSessionTab === tab 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab === "hr" ? "HR screening" : tab}
                </button>
              ))}
            </div>

            {/* Selected Track Details Panel */}
            <div className="flex-grow flex flex-col justify-between bg-slate-900/60 p-6 rounded-xl border border-slate-800/60 relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                    {tracksInfo[activeSessionTab].title}
                  </h4>
                  <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20">
                    {tracksInfo[activeSessionTab].difficulty}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {tracksInfo[activeSessionTab].desc}
                </p>

                {/* Sub-Topics badges */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs font-mono text-slate-500">Parameters:</span>
                  {tracksInfo[activeSessionTab].topics.map((t) => (
                    <span key={t} className="text-xs font-mono bg-slate-950 text-slate-400 border border-slate-800 px-2.5 py-1 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-800/60 mt-6 md:mt-2">
                <div className="flex items-center gap-2.5 text-xs font-mono text-slate-400">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Length: {tracksInfo[activeSessionTab].duration}</span>
                </div>
                
                <button
                  onClick={() => onStartInterview(activeSessionTab)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-blue-500/10 flex items-center gap-2 cursor-pointer group transition-all"
                >
                  <Play className="w-4 h-4 text-slate-900 fill-slate-900" />
                  <span>Launch Live Scanner</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Core Analytics Visual - 5 cols */}
          <div id="performance_metrics" className="lg:col-span-5 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Sensory Analytics Radar
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Average scoring metrics calculated based on multi-modal evaluations.</p>
            </div>

            {evaluatedSessions.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 rounded-xl text-center bg-slate-950/20">
                <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
                <h4 className="text-xs font-semibold text-slate-400">No Assessment Data Yet</h4>
                <p className="text-[11px] text-slate-500 max-w-[240px] mt-1">
                  Launch and complete any mock evaluation session. Your voice levels and eye-gaze tracking metrics will populate this chart instantly.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Metric Bars */}
                {[
                  { name: "Verbal Command", val: avgComm, color: "from-blue-600 to-blue-400" },
                  { name: "Sustained Confidence", val: avgConf, color: "from-teal-500 to-cyan-400" },
                  { name: "Postural Stability (Gaze & Form)", val: avgBody, color: "from-purple-600 to-indigo-400" },
                  { name: "Technical Depth", val: avgTech, color: "from-amber-500 to-orange-400" }
                ].map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{item.name}</span>
                      <span className="font-mono text-white font-bold">{item.val}%</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                      <div 
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all`} 
                        style={{ width: `${item.val}%` }} 
                      />
                    </div>
                  </div>
                ))}

                {/* Score Progression Custom SVG Chart */}
                <div className="pt-4 border-t border-slate-800/60 mt-4">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <sup className="text-[10px] uppercase font-mono text-slate-500">Performance Trend</sup>
                    <span className="text-cyan-400 font-mono text-[11px] flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Steady Slope
                    </span>
                  </div>
                  <div className="h-20 flex items-end gap-1.5 bg-slate-950/50 p-2 border border-slate-900 rounded-lg relative">
                    {/* Background faint lines */}
                    <div className="absolute inset-x-0 top-1/4 border-t border-slate-900" />
                    <div className="absolute inset-x-0 top-1/2 border-t border-slate-900" />
                    <div className="absolute inset-x-0 top-3/4 border-t border-slate-900" />
                    
                    {evaluatedSessions.map((sess, idx) => {
                      const heightPct = sess.evaluation?.overallScore || 50;
                      return (
                        <div key={sess.id} className="flex-grow h-full flex flex-col justify-end group relative cursor-pointer" onClick={() => onViewFeedback(sess)}>
                          <div 
                            className="bg-blue-500 hover:bg-blue-400 rounded-t-sm transition-all" 
                            style={{ height: `${heightPct}%` }}
                          />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-900 text-[9px] font-mono p-1 rounded border border-slate-800 hidden group-hover:block z-10 text-white">
                            S{idx+1}: {heightPct}%
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                    <span>First Session</span>
                    <span>Most Recent</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bento Section: History Tables (8 col) & Learning Hub (4 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* History Panel - 8 col */}
          <div id="historic_evaluations" className="lg:col-span-8 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-400" />
                  Assessment Records & Reports
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-sans">Full trace summaries of conducted mock sessions.</p>
              </div>

              {/* Simple Local Filter search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="text"
                  placeholder="Filter track..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 w-full sm:w-44"
                />
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-950/10 border border-slate-900 rounded-xl">
                <FileText className="w-10 h-10 mx-auto text-slate-700 mb-2.5" />
                <p className="text-xs font-mono">No matching sessions logged in QuantView registry.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/50 text-slate-400 font-medium bg-slate-950/20 header-row">
                      <th className="py-3 px-4 font-mono select-none uppercase tracking-wider text-[10px]">Assessment ID</th>
                      <th className="py-3 px-4 font-mono select-none uppercase tracking-wider text-[10px]">Interview Track</th>
                      <th className="py-3 px-4 font-mono select-none uppercase tracking-wider text-[10px]">Date Conducted</th>
                      <th className="py-3 px-4 font-mono select-none uppercase tracking-wider text-[10px]">Questions</th>
                      <th className="py-3 px-4 font-mono select-none uppercase tracking-wider text-[10px]">Overall Score</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {filteredHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-400 group-hover:text-white">#{item.id.slice(0, 5)}</td>
                        <td className="py-3 px-4 capitalize font-semibold text-white flex items-center space-x-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.interviewType === "technical" ? "bg-amber-400" :
                            item.interviewType === "hr" ? "bg-teal-400" : "bg-blue-400"
                          }`} />
                          <span>{item.interviewType === "hr" ? "HR Screening" : item.interviewType}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">
                          {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="py-3 px-4 text-slate-400">{item.questions.length} Sessions</td>
                        <td className="py-3 px-4 font-mono font-bold">
                          {item.evaluation ? (
                            <span className={`text-sm ${
                              item.evaluation.overallScore >= 80 ? "text-green-400" :
                              item.evaluation.overallScore >= 70 ? "text-blue-400" : "text-amber-400"
                            }`}>
                              {item.evaluation.overallScore}%
                            </span>
                          ) : (
                            <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded text-[10px]">Evaluation Pending</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onViewFeedback(item)}
                            className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center space-x-1.5 transition-all cursor-pointer"
                          >
                            <span>Open Coach Report</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Learning Recommendations Hub - 4 col */}
          <div id="learning_coaching_hub" className="lg:col-span-4 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-400" />
                QuantView Advisor
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Custom placement resources targeted to optimize your weak metric thresholds.</p>
            </div>

            <div className="space-y-4 flex-grow">
              {getPracticeRecommendations().map((resrc) => (
                <div key={resrc.title} className="bg-slate-950 p-3.5 border border-slate-800 rounded-xl hover:border-slate-700 transition-all flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-teal-500/10 border border-teal-500/20 text-teal-400 px-1.5 py-0.5 rounded">
                      {resrc.cat}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">{resrc.time} module</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{resrc.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {resrc.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800/60 mt-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-cyan-500" /> Secure Sandbox System
                </span>
                <span className="font-mono text-[10px] text-slate-500">Locked to User Profile</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
