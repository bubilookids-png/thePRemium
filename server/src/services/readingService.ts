import crypto from 'node:crypto';
import { z } from 'zod';
import {
  runReadingAI
} from './readingAIClient.js';

import type {
  ReadingCreateRequestDTO,
  ReadingCreateResponseDTO,
  ReadingSubmitRequestDTO,
  ReadingSubmitResponseDTO
} from '../types/readingDto.js';

/* =========================
   CREATE SCHEMAS
========================= */

const questionTypeSchema = z.enum([
  'multiple_choice',
  'true_false_not_given',
  'yes_no_not_given',
  'matching_headings',
  'matching_information',
  'matching_features',
  'sentence_completion',
  'summary_completion',
  'note_completion',
  'table_completion',
  'flow_chart_completion',
  'short_answer'
]);

const questionSchema = z.object({
  number: z.number().int().positive(),
  type: questionTypeSchema,
  question: z.string().min(1),
  options: z.array(z.string()).optional(),
  matchingItems: z.array(z.string()).optional()
});

const groupSchema = z.object({
  id: z.string().min(1),
  type: questionTypeSchema,
  instruction: z.string().optional(),
  questions: z.array(questionSchema).min(1),
  options: z.array(z.string()).optional(),
  matchingItems: z.array(z.string()).optional()
});

const responseSchema = z.object({
  title: z.string().min(1).max(160),
  passage: z.string().min(1),
  groups: z.array(groupSchema).min(1)
});

/* =========================
   CREATE CACHE
========================= */

type CacheEntry = {
  expiresAt: number;
  data: ReadingCreateResponseDTO;
};

const cache = new Map<string, CacheEntry>();

const CACHE_TTL = 30 * 60 * 1000;

function cacheKey(
  input: ReadingCreateRequestDTO
) {
  return crypto
    .createHash('sha256')
    .update(
      JSON.stringify({
        title: input.title || '',
        passage: input.passage,
        questions: input.questions
      })
    )
    .digest('hex');
}

function cleanTitle(title?: string) {
  const value = title?.trim();

  return value || 'IELTS Reading Practice';
}

/* =========================
   CREATE PROMPT
========================= */

const SYSTEM_PROMPT = `
You are an IELTS Reading document parser.

Your ONLY job is to STRUCTURE the user's existing IELTS-style
reading passage and questions into JSON.

STRICT RULES:

1. NEVER write a new passage.
2. NEVER summarize the passage.
3. NEVER rewrite the passage.
4. NEVER improve grammar.
5. NEVER correct spelling.
6. NEVER invent questions.
7. NEVER invent answer choices.
8. NEVER invent matching items.
9. NEVER invent answers or answer keys.
10. Preserve the user's wording exactly whenever possible.
11. Preserve paragraph breaks in the passage.
12. Detect the question type from the supplied material.
13. Group questions when they share the same instructions.
14. Keep question numbers exactly as supplied.
15. If a question has options, copy those options.
16. If options are missing, do not invent them.
17. If matching items are supplied, copy them.
18. If matching items are missing, do not invent them.
19. Return ONLY valid JSON.
20. Do not put Markdown fences around the JSON.

Allowed question types:

multiple_choice
true_false_not_given
yes_no_not_given
matching_headings
matching_information
matching_features
sentence_completion
summary_completion
note_completion
table_completion
flow_chart_completion
short_answer

Output shape:

{
  "title": "string",
  "passage": "string",
  "groups": [
    {
      "id": "group-1",
      "type": "multiple_choice",
      "instruction": "string",
      "questions": [
        {
          "number": 1,
          "type": "multiple_choice",
          "question": "string",
          "options": ["string"]
        }
      ],
      "options": ["string"],
      "matchingItems": ["string"]
    }
  ]
}

Do not include properties that are not supported by the user's input.
`;

function buildUserPrompt(
  input: ReadingCreateRequestDTO
) {
  return `
USER TITLE:
${cleanTitle(input.title)}

USER PASSAGE:
<<<PASSAGE_START>>>
${input.passage}
<<<PASSAGE_END>>>

USER QUESTIONS:
<<<QUESTIONS_START>>>
${input.questions}
<<<QUESTIONS_END>>>

Now parse and structure the supplied content.

Remember:
- Do not rewrite it.
- Do not summarize it.
- Do not invent anything.
- Return JSON only.
`;
}

/* =========================
   CREATE VALIDATION
========================= */

function validateAndNormalize(
  raw: unknown,
  original: ReadingCreateRequestDTO
): ReadingCreateResponseDTO {
  const parsed = responseSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(
      'Reading AI returned an invalid structure.'
    );
  }

  const data = parsed.data;

  if (
    data.passage.trim() !==
    original.passage.trim()
  ) {
    throw new Error(
      'Reading AI modified the supplied passage.'
    );
  }

  return {
    title: cleanTitle(original.title),
    passage: original.passage,
    groups: data.groups.map((group) => ({
      id: group.id,
      type: group.type,

      ...(group.instruction
        ? {
            instruction:
              group.instruction
          }
        : {}),

      questions: group.questions.map(
        (question) => ({
          number: question.number,
          type: question.type,
          question: question.question,

          ...(question.options?.length
            ? {
                options:
                  question.options
              }
            : {}),

          ...(question.matchingItems?.length
            ? {
                matchingItems:
                  question.matchingItems
              }
            : {})
        })
      ),

      ...(group.options?.length
        ? {
            options: group.options
          }
        : {}),

      ...(group.matchingItems?.length
        ? {
            matchingItems:
              group.matchingItems
          }
        : {})
    }))
  };
}

/* =========================
   CREATE READING
========================= */

export async function createReading(
  input: ReadingCreateRequestDTO
): Promise<ReadingCreateResponseDTO> {
  const key = cacheKey(input);

  const cached = cache.get(key);

  if (
    cached &&
    cached.expiresAt > Date.now()
  ) {
    return cached.data;
  }

  if (cached) {
    cache.delete(key);
  }

  const raw = await runReadingAI({
    system: SYSTEM_PROMPT,
    user: buildUserPrompt(input),
    temperature: 0
  });

  const result = validateAndNormalize(
    raw,
    input
  );

  cache.set(key, {
    expiresAt:
      Date.now() + CACHE_TTL,
    data: result
  });

  return result;
}

/* =====================================================
   SUBMIT / EXAMINER
===================================================== */

const submitResultSchema = z.object({
  results: z.array(
    z.object({
      number: z.number().int().positive(),
      correctAnswer: z.string().min(1),
      isCorrect: z.boolean(),
      explanation: z.string().min(1)
    })
  ).min(1)
});

function buildSubmitPrompt(
  input: ReadingSubmitRequestDTO
) {
  const allQuestions =
    input.groups.flatMap((group) =>
      group.questions.map((question) => ({
        number: question.number,
        type: question.type,
        question: question.question,
        options:
          question.options ||
          group.options ||
          [],
        matchingItems:
          question.matchingItems ||
          group.matchingItems ||
          []
      }))
    );

  const answerMap = new Map(
    input.answers.map((item) => [
      item.number,
      item.answer
    ])
  );

  const questionsWithAnswers =
    allQuestions.map((question) => ({
      ...question,
      userAnswer:
        answerMap.get(question.number) ||
        ''
    }));

  return `
You are an extremely strict IELTS Reading examiner.

Your task is to check a student's answers against the supplied
reading passage and questions.

IMPORTANT:

1. The student did NOT provide an answer key.
2. YOU must determine the correct answer yourself from the passage
   and the question.
3. Do NOT trust the student's answer as the correct answer.
4. Do NOT invent information that is not supported by the passage.
5. For multiple choice questions, select the correct option.
6. For True/False/Not Given questions, distinguish carefully between:
   - True: the passage clearly supports the statement.
   - False: the passage clearly contradicts the statement.
   - Not Given: the passage does not provide enough information.
7. For Yes/No/Not Given questions, use the same logic but evaluate
   the writer's opinion or claim.
8. For matching questions, identify the correct matching item from
   the supplied choices.
9. For completion questions, provide the most appropriate answer
   supported by the passage.
10. Ignore capitalization differences when judging answers.
11. For short answers and completion questions, allow reasonable
    grammatical variations when the meaning is clearly identical.
12. Do not mark an answer correct merely because it is similar.
13. Be strict like a real IELTS examiner.
14. Every supplied question MUST have exactly one result.
15. Return ONLY valid JSON.
16. Do not use Markdown fences.

PASSAGE:
<<<PASSAGE_START>>>
${input.passage}
<<<PASSAGE_END>>>

QUESTIONS AND STUDENT ANSWERS:
<<<QUESTIONS_START>>>
${JSON.stringify(
  questionsWithAnswers,
  null,
  2
)}
<<<QUESTIONS_END>>>

Return exactly this structure:

{
  "results": [
    {
      "number": 1,
      "correctAnswer": "B",
      "isCorrect": true,
      "explanation": "The passage states..."
    }
  ]
}

The result must contain every question number.
`;
}

/* =========================
   IELTS BAND
========================= */

function calculateBand(
  score: number,
  total: number
): number {
  if (total <= 0) return 0;

  /*
   IELTS Reading is officially scored out of 40.
   For custom tests, we scale the score proportionally
   to a 40-question test and then apply the standard
   Academic Reading band conversion approximately.
  */

  const scaledScore =
    (score / total) * 40;

  if (scaledScore >= 39) return 9.0;
  if (scaledScore >= 37) return 8.5;
  if (scaledScore >= 35) return 8.0;
  if (scaledScore >= 33) return 7.5;
  if (scaledScore >= 30) return 7.0;
  if (scaledScore >= 27) return 6.5;
  if (scaledScore >= 23) return 6.0;
  if (scaledScore >= 19) return 5.5;
  if (scaledScore >= 15) return 5.0;
  if (scaledScore >= 13) return 4.5;
  if (scaledScore >= 10) return 4.0;
  if (scaledScore >= 8) return 3.5;
  if (scaledScore >= 6) return 3.0;
  if (scaledScore >= 4) return 2.5;
  if (scaledScore >= 3) return 2.0;
  if (scaledScore >= 2) return 1.5;
  if (scaledScore >= 1) return 1.0;

  return 0;
}

/* =========================
   SUBMIT READING
========================= */

export async function submitReading(
  input: ReadingSubmitRequestDTO
): Promise<ReadingSubmitResponseDTO> {
  const raw = await runReadingAI({
    system: `
You are a professional IELTS Reading examiner.

Determine the correct answers using ONLY the supplied passage,
questions and IELTS rules.

Return valid JSON only.
`,
    user: buildSubmitPrompt(input),
    temperature: 0
  });

  const parsed =
    submitResultSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(
      'Reading examiner returned an invalid result.'
    );
  }

  const questionMap = new Map(
    input.groups
      .flatMap(
        (group) => group.questions
      )
      .map((question) => [
        question.number,
        question
      ])
  );

  const answerMap = new Map(
    input.answers.map((answer) => [
      answer.number,
      answer.answer.trim()
    ])
  );

  const orderedResults =
    parsed.data.results
      .sort(
        (a, b) =>
          a.number - b.number
      )
      .map((result) => {
        const question =
          questionMap.get(
            result.number
          );

        if (!question) {
          throw new Error(
            `AI returned unknown question number: ${result.number}`
          );
        }

        return {
          number: result.number,

          question:
            question.question,

          userAnswer:
            answerMap.get(
              result.number
            ) || '',

          correctAnswer:
            result.correctAnswer,

          isCorrect:
            result.isCorrect,

          explanation:
            result.explanation
        };
      });

  const total =
    questionMap.size;

  if (
    orderedResults.length !== total
  ) {
    throw new Error(
      'Reading examiner did not return a result for every question.'
    );
  }

  const score =
    orderedResults.filter(
      (item) => item.isCorrect
    ).length;

  const percentage =
    Math.round(
      (score / total) * 100
    );

  const band =
    calculateBand(
      score,
      total
    );

  return {
    score,
    total,
    percentage,
    band,
    results:
      orderedResults
  };
}