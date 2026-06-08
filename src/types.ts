export interface UserProfile {
  name: string;
  email: string;
  targetRole: string;
  experienceLevel: "Junior" | "Mid-level" | "Senior";
  targetIndustry: string;
  joinedDate: string;
}

export type InterviewType = "hr" | "technical" | "behavioral" | "aptitude" | "placement";

export interface MockQuestion {
  id: string;
  questionText: string;
  answerText?: string;
  audioDuration?: number;
  wordCount?: number;
  fillerWordsCount?: number;
  fillerWordsList?: string[];
  speechPaceWpm?: number; 
  userConfidenceScore?: number; // based on speech quality & voice level
  feedback?: string;
}

export interface InteractiveMetrics {
  speechPaceStatus: "Normal" | "Too Fast" | "Too Slow";
  audioLevelDbs: number;
  eyeContactPercentage: number;
  bodyPostureScore: number;
  fillerWordsSequence: string[];
}

export interface DetailedEvaluation {
  overallScore: number;
  communicationScore: number;
  confidenceScore: number;
  voiceAnalysisScore: number;
  facialExpressionScore: number;
  eyeContactScore: number;
  bodyLanguageScore: number;
  technicalPerformanceScore: number;
  date: string;
  
  // Qualitative feedback strings
  strengths: string[];
  weaknesses: string[];
  mistakesMade: string[];
  communicationFeedback: string;
  confidenceFeedback: string;
  bodyLanguageFeedback: string;
  eyeContactFeedback: string;
  voiceFeedback: string;
  detailedAnalysisParagraph: string;
  
  // Practice suggestions
  practiceRecommendations: string[];
}

export interface MockSession {
  id: string;
  userId: string;
  interviewType: InterviewType;
  date: string;
  questions: MockQuestion[];
  evaluation?: DetailedEvaluation;
  status: "idle" | "ongoing" | "completing" | "evaluated";
}

export interface RecommendationResource {
  id: string;
  title: string;
  category: "communication" | "body-language" | "technical" | "confidence" | "mock-speech";
  description: string;
  estimatedTime: string;
  resourceType: "Exercise" | "Guide" | "Speaking Module" | "Body Language Blueprint";
}
