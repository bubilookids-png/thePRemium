import { Router, Request, Response } from 'express';

export const readingRouter = Router();

// Mock testlarning to'liq ro'yxati (Katalog uchun - passages siz)
readingRouter.get('/tests', (_req: Request, res: Response) => {
  try {
    // 200-300 ta test yaratish uchun sikl yoki tayyor massiv ishlatish mumkin
    const tests = [
      { id: 'mock-test-1', title: 'Academic Reading Mock Test 1 — Ecosystems & Technology', level: 'Academic', isFree: true, durationMinutes: 60, isRealExam: true },
      { id: 'mock-test-2', title: 'Academic Reading Mock Test 2 — Artificial Intelligence & History', level: 'Academic', isFree: true, durationMinutes: 60, isRealExam: true }
    ];
    res.json({ tests });
  } catch (error) {
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// Testning to'liq 3 ta passageni ID bo'yicha olish
readingRouter.get('/tests/:id', (req: Request, res: Response) => {
  const testId = req.params.id;
  // Yuqoridagi MOCK_READING_TESTS dan mos keladigani qaytariladi
  res.json({ 
    test: {
      id: testId,
      title: `Academic Reading Test ${testId}`,
      level: 'Academic',
      isFree: true,
      durationMinutes: 60,
      isRealExam: true,
      passages: [
        {
          id: 1,
          title: 'Passage 1: Academic Reading Section 1',
          content: 'Detailed text content for passage 1...',
          questions: [{ id: 'q1', type: 'fill_blank', prompt: 'Complete the summary: ________', correctAnswer: 'example' }]
        },
        {
          id: 2,
          title: 'Passage 2: Academic Reading Section 2',
          content: 'Detailed text content for passage 2...',
          questions: [{ id: 'q2', type: 'fill_blank', prompt: 'Complete the summary: ________', correctAnswer: 'example' }]
        },
        {
          id: 3,
          title: 'Passage 3: Academic Reading Section 3',
          content: 'Detailed text content for passage 3...',
          questions: [{ id: 'q3', type: 'fill_blank', prompt: 'Complete the summary: ________', correctAnswer: 'example' }]
        }
      ]
    } 
  });
});