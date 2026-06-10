// Types for NurseAI QuizCraft

export type QuestionType = "multiple-choice" | "case-study" | "bow-tie" | "cloze" | "matrix";

export type Difficulty = "easy" | "moderate" | "difficult";

export type BloomsLevel = "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";

export interface MCQOption {
  letter: string;
  text: string;
}

export interface MCQQuestion {
  type: "multiple-choice";
  stem: string;
  options: MCQOption[];
  correctAnswer: string;
  rationale: string;
}

export interface CaseStudyQuestion {
  type: "case-study";
  scenario: string;
  question: string;
  options: MCQOption[];
  correctAnswer: string;
  rationale: string;
}

export interface BowTieQuestion {
  type: "bow-tie";
  scenario: string;
  correctLeft: string[];
  correctCenter: string;
  correctRight: string[];
  allLeft: string[];
  allCenter: string[];
  allRight: string[];
  rationale: string;
}

export interface ClozeQuestion {
  type: "cloze";
  text: string; // text with blanks marked as {{blank1}}, {{blank2}}, etc.
  blanks: { id: string; answer: string; options?: string[] }[];
  rationale: string;
}

export interface MatrixQuestion {
  type: "matrix";
  stem: string;
  rows: string[];
  columns: string[];
  correctMatches: { row: string; column: string }[];
  rationale: string;
}

export type GeneratedQuestion = MCQQuestion | CaseStudyQuestion | BowTieQuestion | ClozeQuestion | MatrixQuestion;

export interface GenerateRequest {
  topic: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  count: number;
}

export interface GenerateResponse {
  questions: GeneratedQuestion[];
  error?: string;
}

export interface QuestionCardProps {
  question: GeneratedQuestion;
  index: number;
}

export interface FormData {
  topic: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  count: number;
}
