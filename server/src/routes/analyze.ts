import { Router } from 'express';
import { z } from 'zod';
import { analyzeWordService } from '../services/analyzeService.js';
import { isLikelyValidTerm, normalizeTerm } from '../utils/validate.js';

export const analyzeRouter = Router();

const bodySchema = z.object({
  word: z.string().min(1).max(80),
  targetLanguage: z.object({
    code: z.string().min(1).max(12),
    label: z.string().min(1).max(40)
  })
});

analyzeRouter.post('/', async (req, res) => {
  console.log('REQUEST BODY:', req.body);

  const parsed = bodySchema.safeParse(req.body);

  if (!parsed.success) {
  return res.status(400).json({
    error: 'Invalid request',
    details: parsed.error.issues
  });
}

  const term = normalizeTerm(parsed.data.word);
  if (!isLikelyValidTerm(term)) {
    return res.status(400).json({
      error: 'Invalid word/term. Use letters, spaces, apostrophes, and hyphens (max 3 words).'
    });
  }

  try {
    const result = await analyzeWordService({
      word: term,
      targetLanguage: parsed.data.targetLanguage
    });

    // Ensure the "analysis.word" reflects normalized term (consistency)
    result.analysis.word = term;

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Server error while analyzing the word. Please try again.'
    });
  }
});
