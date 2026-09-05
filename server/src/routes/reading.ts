import { Router } from 'express';
import { z } from 'zod';
import {
  createReading,
  submitReading
} from '../services/readingService.js';

export const readingRouter = Router();

/* =========================
   CREATE READING
========================= */

const createBodySchema = z.object({
  title: z
    .string()
    .trim()
    .max(160)
    .optional(),

  passage: z
    .string()
    .trim()
    .min(50, 'Passage is too short.')
    .max(60000, 'Passage is too long.'),

  questions: z
    .string()
    .trim()
    .min(1, 'Please provide the questions.')
    .max(30000, 'Questions are too long.')
});

readingRouter.post('/create', async (req, res) => {
  const parsed = createBodySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid Reading Creator request.',
      details: parsed.error.issues
    });
  }

  try {
    const result = await createReading(parsed.data);

    return res.json(result);
  } catch (error) {
    console.error(
      'Reading creation failed:',
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : String(error);

    if (
      message.includes(
        'No Reading AI provider is configured'
      )
    ) {
      return res.status(503).json({
        error:
          'Reading AI is not configured yet.'
      });
    }

    return res.status(500).json({
      error:
        'Could not create the Reading test. Please try again.'
    });
  }
});

/* =========================
   SUBMIT READING
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

const submitBodySchema = z.object({
  title: z
    .string()
    .trim()
    .max(160)
    .optional(),

  passage: z
    .string()
    .trim()
    .min(50)
    .max(60000),

  groups: z
    .array(groupSchema)
    .min(1),

  answers: z
    .array(
      z.object({
        number: z.number().int().positive(),
        answer: z.string().max(1000)
      })
    )
    .max(200)
});

readingRouter.post('/submit', async (req, res) => {
  const parsed = submitBodySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid Reading submission.',
      details: parsed.error.issues
    });
  }

  try {
    const result = await submitReading(parsed.data);

    return res.json(result);
  } catch (error) {
    console.error(
      'Reading submission failed:',
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : String(error);

    if (
      message.includes(
        'No Reading AI provider is configured'
      )
    ) {
      return res.status(503).json({
        error:
          'Reading AI is not configured yet.'
      });
    }

    return res.status(500).json({
      error:
        'Could not check the Reading answers. Please try again.'
    });
  }
});