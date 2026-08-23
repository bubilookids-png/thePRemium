export type TargetLanguageDTO = {
  code: string;
  label: string;
};

export type AnalyzeRequestDTO = {
  word: string;
  targetLanguage: TargetLanguageDTO;
};

export type VocabAnalysisDTO = {
  word: string;
  targetLanguage: TargetLanguageDTO;
  definition: string;
  translation: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Unknown';
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

export type QuizQuestionDTO = {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'select_synonym' | 'select_antonym';
  prompt: string;
  options?: string[];
  correctOptionIndex?: number;
  correctText?: string;
  explanation: string;
};

export type VocabQuizDTO = {
  title: string;
  questions: QuizQuestionDTO[];
};

export type AnalyzeResponseDTO = {
  analysis: VocabAnalysisDTO;
  quiz: VocabQuizDTO;
};
