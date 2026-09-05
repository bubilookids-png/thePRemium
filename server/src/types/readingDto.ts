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

export type ReadingQuestionDTO = {
  number: number;
  type: ReadingQuestionType;
  question: string;
  options?: string[];
  matchingItems?: string[];
};

export type ReadingQuestionGroupDTO = {
  id: string;
  type: ReadingQuestionType;
  instruction?: string;
  questions: ReadingQuestionDTO[];
  options?: string[];
  matchingItems?: string[];
};

export type ReadingCreateRequestDTO = {
  title?: string;
  passage: string;
  questions: string;
};

export type ReadingCreateResponseDTO = {
  title: string;
  passage: string;
  groups: ReadingQuestionGroupDTO[];
};