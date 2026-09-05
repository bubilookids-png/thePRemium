export type ReadingQuestionType =
  | 'multiple_choice'
  | 'true_false_not_given'
  | 'yes_no_not_given'
  | 'matching_headings'
  | 'matching_information'
  | 'matching_features'
  | 'sentence_completion'
  | 'summary_completion'
  | 'note_completion'
  | 'table_completion'
  | 'flow_chart_completion'
  | 'short_answer';

export type ReadingQuestion = {
  number: number;
  type: ReadingQuestionType;
  question: string;
  options?: string[];
  matchingItems?: string[];
};

export type ReadingQuestionGroup = {
  id: string;
  type: ReadingQuestionType;
  instruction?: string;
  questions: ReadingQuestion[];
  options?: string[];
  matchingItems?: string[];
};

export type ReadingResponse = {
  title: string;
  passage: string;
  groups: ReadingQuestionGroup[];
};

/* =========================
   SUBMIT
========================= */

export type ReadingAnswer = {
  number: number;
  answer: string;
};

export type ReadingQuestionResult = {
  number: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
};

export type ReadingSubmitResponse = {
  score: number;
  total: number;
  percentage: number;
  band: number;
  results: ReadingQuestionResult[];
};