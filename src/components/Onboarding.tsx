import React, { useState } from "react";
import { UserProfile } from "../types";
import { Sparkles, ArrowRight, User, Briefcase, Award, GraduationCap } from "lucide-react";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState<"Junior" | "Mid-level" | "Senior">("Junior");
  const [targetIndustry, setTargetIndustry] = useState("Technology & Software");

  const [isRegistering, setIsRegistering] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const profile: UserProfile = {
      name,
      email,
      targetRole,
      experienceLevel,
      targetIndustry,
      joinedDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" }),
    };

    onComplete(profile);
  };

  const fillDemoData = () => {
    setName("Alex Rivera");
    setEmail("alex.rivera@example.com");
    setTargetRole("Senior Frontend Developer");
    setExperienceLevel("Mid-level");
    setTargetIndustry("SaaS & Digital Products");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between text-slate-100 relative overflow-hidden font-sans">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md relative z-10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="font-bold text-slate-900 tracking-tighter text-lg">Q</span>
            </div>
            <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              QuantView <span className="text-xs font-mono px-1.5 py-0.5 ml-1.5 rounded bg-blue-500/15 border border-blue-500/20 text-blue-400">AI Coach</span>
            </span>
          </div>
          <button
            onClick={fillDemoData}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-medium px-3 py-1.5 rounded-md border border-cyan-500/20 transition-all hover:bg-cyan-500/5 cursor-pointer"
          >
            Quick Sandbox Autofill
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-grow flex items-center justify-center relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Brand Introduction */}
          <div className="lg:col-span-6 space-y-6 text-left lg:pr-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>White-Label Intel-Grade Coach</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              Prepare for critical interviews in <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">QuantView AI Room</span>
            </h1>
            <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
              QuantView is a multi-modal assessment system configured with vocal pitch, speed tracking, visual layout telemetry, and conversational feedback mechanisms. Register to launch customizable mock sessions and secure granular evaluations.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xs mt-0.5">✓</div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Full-Auditory Interview Loop</h4>
                  <p className="text-xs text-slate-400">SpeechSynthesis naturally articulates follow-up interactions while speech transcripts are monitored live.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs mt-0.5">✓</div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Advanced Sensory Overlay</h4>
                  <p className="text-xs text-slate-400">Tracks eye gaze stability, forward posture, and visual expressions during timed explanations.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="w-full max-w-md bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-2xl relative">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {isRegistering ? "Candidate Registration" : "Account Sign In"}
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  {isRegistering
                    ? "Establish your custom placement profile to initialize practice"
                    : "Access your dashboard to review historic performances"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegistering ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> Candidate Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Rivera"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors placeholder:text-slate-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Professional Email ID
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex.rivera@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors placeholder:text-slate-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" /> Target Job Role
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Software Engineer / Product Manager"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors placeholder:text-slate-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" /> Experience
                        </label>
                        <select
                          value={experienceLevel}
                          onChange={(e) => setExperienceLevel(e.target.value as any)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
                        >
                          <option value="Junior">Junior (0-2 years)</option>
                          <option value="Mid-level">Mid-level (3-5 years)</option>
                          <option value="Senior">Senior (5+ years)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5" /> Target Sector
                        </label>
                        <input
                          type="text"
                          required
                          value={targetIndustry}
                          onChange={(e) => setTargetIndustry(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Onboarding Email ID
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex.rivera@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (e.target.value.includes("alex")) {
                            setName("Alex Rivera");
                          } else {
                            setName(e.target.value.split("@")[0] || "User");
                          }
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Access Key / Password
                      </label>
                      <input
                        type="password"
                        required
                        defaultValue="••••••••"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full group bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-900 font-semibold py-2.5 px-4 rounded-lg text-sm mt-2 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-blue-500/15"
                >
                  <span>{isRegistering ? "Initialize Assessment Space" : "Sign In to QuantView"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-700/30 text-center">
                <button
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  {isRegistering
                    ? "Already have an interview profile? Access here"
                    : "Need a profile? Register with your placement data"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/20 py-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-6">
          QuantView Assessment Core Engine • Version 1.4.2 • Secured AI Environment
        </div>
      </footer>
    </div>
  );
}
