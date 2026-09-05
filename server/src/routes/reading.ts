import { Router } from 'express';
import { z } from 'zod';
import { createReading } from '../services/readingService.js';

export const readingRouter = Router();

const bodySchema = z.object({
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
  const parsed = bodySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid Reading Creator request.',
      details: parsed.error.issues
    });
  }

  try {
    const result = await createReading(
      parsed.data
    );

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