import React, { useState } from "react";
import { MockSession } from "../types";
import { 
  FileText, Award, Eye, VolumeX, Volume2, ArrowLeft, Download, CheckCircle2, 
  XCircle, ListPlus, Activity, Sparkles, BookOpen, UserCheck, HelpCircle, GraduationCap
} from "lucide-react";

interface FeedbackRoomProps {
  session: MockSession;
  onBackToDashboard: () => void;
}

export default function FeedbackRoom({ session, onBackToDashboard }: FeedbackRoomProps) {
  const { evaluation, interviewType } = session;
  const [playingVoiceFeedback, setPlayingVoiceFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "detailed" | "questions">("summary");

  if (!evaluation) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-8">
        <div className="text-center space-y-4 max-w-sm">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">Evaluation Pending</h2>
          <p className="text-sm text-slate-400">This mock interview session is missing quantitative diagnostic assessments.</p>
          <button onClick={onBackToDashboard} className="mt-4 bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // 1. Text-To-Speech Playback of Coach Detailed Analysis
  const togglePlayVoiceCoach = () => {
    if (!window.speechSynthesis) return;

    if (playingVoiceFeedback) {
      window.speechSynthesis.cancel();
      setPlayingVoiceFeedback(false);
    } else {
      setPlayingVoiceFeedback(true);
      const textToSpeak = evaluation.detailedAnalysisParagraph + 
        " Here are your custom practice recommendations: " + 
        evaluation.practiceRecommendations.join(". ") + 
        " Keep up the outstanding efforts.";
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const voices = window.speechSynthesis.getVoices();
      const friendlyVoice = voices.find(v => v.lang.startsWith("en-") && v.name.includes("Google")) ||
                            voices.find(v => v.lang.startsWith("en-")) || voices[0];
      if (friendlyVoice) utterance.voice = friendlyVoice;
      utterance.rate = 0.95; // Slightly slower mentor rate
      
      utterance.onend = () => {
        setPlayingVoiceFeedback(false);
      };
      utterance.onerror = () => {
        setPlayingVoiceFeedback(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // 2. Direct client-side Text-Dossier / Mock-PDF Downloader
  const downloadReportDossier = () => {
    const reportTemplate = `
======================================================================
                 QUANTVIEW AI ASSESSMENT REPORT
======================================================================
Candidate Name        : [Onboarded Candidate Profile]
Evaluation Date       : ${new Date(evaluation.date).toLocaleDateString()}
Interview Track       : ${interviewType.toUpperCase()} SCREENING
Overall Performance   : ${evaluation.overallScore} / 100
----------------------------------------------------------------------

=================== SENSORY CORE METRICS ===================
- Communication Skills Score   : ${evaluation.communicationScore}%
- Sustained Confidence Score   : ${evaluation.confidenceScore}%
- Voice Analysis Score         : ${evaluation.voiceAnalysisScore}%
- Facial Expression Score       : ${evaluation.facialExpressionScore}%
- Eye Contact Tracker Score    : ${evaluation.eyeContactScore}%
- Posture & Form Alignment     : ${evaluation.bodyLanguageScore}%
- Technical Depth Score        : ${evaluation.technicalPerformanceScore}%

=================== CANDIDATE STRENGTHS ===================
${evaluation.strengths.map((s, idx) => `[${idx + 1}] ${s}`).join("\n")}

=================== AREAS OF IMPROVEMENT ==================
${evaluation.weaknesses.map((w, idx) => `[${idx + 1}] ${w}`).join("\n")}

=================== CORE ERRORS MATCHED ===================
${evaluation.mistakesMade.map((m, idx) => `[${idx + 1}] ${m}`).join("\n")}

=================== CORE MENTOR FEEDS =====================
- Communication Feedback   : ${evaluation.communicationFeedback}
- Postural Feedback        : ${evaluation.bodyLanguageFeedback}
- Gaze Tracker Feedback    : ${evaluation.eyeContactFeedback}
- Vocal Tempo Feedback     : ${evaluation.voiceFeedback}

=================== QUANTVIEW ROADMAP ====================
${evaluation.practiceRecommendations.map((r, idx) => `[*] Module ${idx + 1}: ${r}`).join("\n")}

----------------------------------------------------------------------
QuantView assessment core. This is a certificate and placement review document.
======================================================================
`;

    // Initialize physical client browser file trigger
    const blob = new Blob([reportTemplate], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `QuantView_Report_${interviewType}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 sm:p-10 relative overflow-hidden">
      {/* Visual background elements */}
      <div className="absolute top-0 left-10 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-5 right-5 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Navigation Breadcrumb & Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <button
            onClick={onBackToDashboard}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Candidate Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayVoiceCoach}
              className={`text-xs px-4 py-2 rounded-xl font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                playingVoiceFeedback
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800"
              }`}
            >
              {playingVoiceFeedback ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{playingVoiceFeedback ? "Mute Advisor Voice Coach" : "Play Advisor Voice Explanation"}</span>
            </button>

            <button
              onClick={downloadReportDossier}
              className="bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/15"
            >
              <Download className="w-4 h-4" />
              <span>Download Performance Dossier</span>
            </button>
          </div>
        </div>

        {/* Major Top Info Summary Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-md relative overflow-hidden">
          {/* Ambient Glowing border */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />

          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Session Certified and Logged</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              QuantView AI Coach <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Assessment Dossier</span>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your biometric tracking, grammatical vocabulary correctness, postural tilt alignment, conversational pauses, and speech WPM speed records have been coordinated. Review your performance markers below.
            </p>
          </div>

          {/* Major Circle Progress overall Score */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center border-l border-slate-800 md:pl-10">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* SVG Background Circle */}
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="62" stroke="#0f172a" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="72" cy="72" r="62" stroke="#2563eb" strokeWidth="10" fill="transparent" 
                  strokeDasharray={`${2 * Math.PI * 62}`}
                  strokeDashoffset={`${2 * Math.PI * 62 * (1 - evaluation.overallScore / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center z-10 space-y-0.5">
                <span className="block text-4xl font-extrabold font-mono text-white tracking-tighter">
                  {evaluation.overallScore}
                </span>
                <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  OVERALL GRADE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Menu Options */}
        <div className="flex border-b border-slate-800 pt-2 gap-2">
          {(["summary", "detailed", "questions"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-bold py-2.5 px-4 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
                activeTab === tab 
                  ? "border-blue-500 text-blue-400 font-bold bg-slate-900/40"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab === "summary" ? "Sensory Scorecard" : tab === "detailed" ? "Mentor Explanations" : "Transcript Review"}
            </button>
          ))}
        </div>

        {/* Tab Body Contents */}
        {activeTab === "summary" && (
          <div className="space-y-8">
            {/* Bento Grid sensory category trackers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Verbal Grammar", val: evaluation.communicationScore, icon: FileText, color: "text-blue-400" },
                { label: "Stability / Confidence", val: evaluation.confidenceScore, icon: Award, color: "text-teal-400" },
                { label: "Voice Resonance", val: evaluation.voiceAnalysisScore, icon: Activity, color: "text-indigo-400 animate-pulse" },
                { label: "Gaze Concentration", val: evaluation.eyeContactScore, icon: Eye, color: "text-cyan-400" }
              ].map((m) => (
                <div key={m.label} className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{m.label}</span>
                    <m.icon className={`w-4 h-4 ${m.color}`} />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold font-mono text-white">{m.val}%</span>
                    <span className="text-[10px] text-slate-500 font-medium">INDEX</span>
                  </div>
                  <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${m.val}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Strengths VS Mistakes Column split layouts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Strengths - 6 cols */}
              <div className="lg:col-span-6 bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Sensory Strengths Logged
                </h3>
                <ul className="space-y-2.5">
                  {evaluation.strengths.map((str, idx) => (
                    <li key={idx} className="bg-slate-950 p-3 rounded-lg text-xs leading-relaxed text-slate-300 border border-slate-800/80 flex items-start space-x-3">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold mt-0.5 animate-bounce">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mistakes & Misalignments - 6 cols */}
              <div className="lg:col-span-6 bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-amber-500" />
                  Tactical Errors Registered
                </h3>
                <ul className="space-y-2.5">
                  {evaluation.mistakesMade.map((mist, idx) => (
                    <li key={idx} className="bg-slate-950 p-3 rounded-lg text-xs leading-relaxed text-slate-300 border border-slate-800/80 flex items-start space-x-3">
                      <span className="text-[10px] font-mono text-amber-500 font-light mt-0.5">✕</span>
                      <span>{mist}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        )}

        {activeTab === "detailed" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Extended paragraph commentary - 7 cols */}
            <div className="lg:col-span-7 bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-400" />
                  Coach Advisor Verbal Summary
                </h3>
                <blockquote className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 text-sm italic text-slate-300 leading-relaxed border-l-4 border-l-blue-500 relative shadow-inner">
                  <span className="absolute -top-3 left-4 text-6xl text-slate-800 tracking-tighter inline-block select-none pointer-events-none font-serif">“</span>
                  <p className="relative z-10 pt-2 pl-2">
                    {evaluation.detailedAnalysisParagraph}
                  </p>
                </blockquote>
              </div>

              {/* Specific Sensor breakdowns nested tags */}
              <div className="space-y-4 border-t border-slate-800/60 pt-4 mt-6">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">SENSORY SUITE SUB-CRITICISMS</h4>
                <div className="space-y-3">
                  {[
                    { title: "Verbal Command", val: evaluation.communicationFeedback },
                    { title: "Postural Stability", val: evaluation.bodyLanguageFeedback },
                    { title: "Eye Gaze Target", val: evaluation.eyeContactFeedback },
                    { title: "Vocal speed tempo", val: evaluation.voiceFeedback }
                  ].map((criticism) => (
                    <div key={criticism.title} className="text-xs">
                      <span className="font-semibold text-slate-200 block">{criticism.title}</span>
                      <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{criticism.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom practice guides - 5 cols */}
            <div className="lg:col-span-5 bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-teal-400" />
                  Advisor Practice Plan
                </h3>
                <p className="text-xs text-slate-400">
                  QuantView AI has formulated personalized training recommendations tailored to help you secure college mock selection goals.
                </p>
              </div>

              <div className="space-y-5 flex-grow pt-4">
                {evaluation.practiceRecommendations.map((rec, index) => (
                  <div key={index} className="bg-slate-950 p-4 border border-slate-850 rounded-xl hover:border-slate-800 transition-all flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-mono font-bold text-xs mt-0.5 shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">RECOMMENDED TASK</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{rec}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === "questions" && (
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                Speech Audio Transcript Logs
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Verbatim traces of dialogue exchanged during interview tracker diagnostics.
              </p>
            </div>

            <div className="space-y-6">
              {session.questions.map((q, index) => (
                <div key={q.id} className="bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 space-y-3.5 hover:border-slate-750 transition-all">
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                    <span className="text-xs font-mono font-bold text-blue-400">EXCHANGE {index + 1}</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Filler word count: {q.fillerWordsCount || 0} stutters
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest select-none">AI QUESTION</p>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium pl-3 border-l-2 border-slate-800">{q.questionText}</p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest select-none">CANDIDATE ANSWER</p>
                    <p className="text-xs text-slate-300 pl-3 border-l-2 border-cyan-500 leading-relaxed italic">
                      {q.answerText || "[Candidate closed answer loop procedurally]"}
                    </p>
                  </div>

                  {q.speechPaceWpm !== undefined && (
                    <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>Speaking Speed: {q.speechPaceWpm} Words Per Minute</span>
                      <span>Vocabulary index score: {q.userConfidenceScore}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
