export type SupportedLanguageCode =
  | 'es' | 'fr' | 'de' | 'it' | 'pt'
  | 'ru' | 'tr' | 'ar' | 'hi'
  | 'zh-CN' | 'ja' | 'ko' | 'vi' | 'id' | 'uz';

export type TargetLanguage = {
  code: SupportedLanguageCode;
  label: string;
};

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Unknown';

export type VocabAnalysis = {
  word: string;
  targetLanguage: TargetLanguage;
  definition: string;
  translation: string;
  cefrLevel: CEFRLevel;
  partOfSpeech: string;
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  examples: string[];
  usage: string;
  commonMistakes: string[];
  pronunciation?: {
    ipa?: string;
  };
};

export type QuizQuestionType =
  | 'multiple_choice'
  | 'fill_blank'
  | 'select_synonym'
  | 'select_antonym';

export type QuizQuestion = {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  options?: string[];
  correctOptionIndex?: number;
  correctText?: string; // for fill_blank
  explanation: string;
};

export type VocabQuiz = {
  title: string;
  questions: QuizQuestion[];
};

export type AnalyzeResponse = {
  analysis: VocabAnalysis;
  quiz: VocabQuiz;
};
