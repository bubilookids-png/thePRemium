import crypto from 'node:crypto';
import { z } from 'zod';
import {
  runReadingAI
} from './readingAIClient.js';
import type {
  ReadingCreateRequestDTO,
  ReadingCreateResponseDTO
} from '../types/readingDto.js';

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

type CacheEntry = {
  expiresAt: number;
  data: ReadingCreateResponseDTO;
};

const cache = new Map<string, CacheEntry>();

const CACHE_TTL = 30 * 60 * 1000;

function cacheKey(input: ReadingCreateRequestDTO) {
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

  if (data.passage.trim() !== original.passage.trim()) {
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
        ? { instruction: group.instruction }
        : {}),
      questions: group.questions.map((question) => ({
        number: question.number,
        type: question.type,
        question: question.question,
        ...(question.options?.length
          ? { options: question.options }
          : {}),
        ...(question.matchingItems?.length
          ? { matchingItems: question.matchingItems }
          : {})
      })),
      ...(group.options?.length
        ? { options: group.options }
        : {}),
      ...(group.matchingItems?.length
        ? { matchingItems: group.matchingItems }
        : {})
    }))
  };
}

export async function createReading(
  input: ReadingCreateRequestDTO
): Promise<ReadingCreateResponseDTO> {
  const key = cacheKey(input);

  const cached = cache.get(key);

  if (cached && cached.expiresAt > Date.now()) {
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
    expiresAt: Date.now() + CACHE_TTL,
    data: result
  });

  return result;
}