import type { AnalyzeResponseDTO, TargetLanguageDTO } from '../types/dto.js';

function makeId(prefix: string, i: number) {
  return `${prefix}-${i}-${Math.random().toString(16).slice(2)}`;
}

export function mockAnalyze(word: string, targetLanguage: TargetLanguageDTO): AnalyzeResponseDTO {
  // Deterministic-ish content that looks realistic enough to test UI/quiz end-to-end.
  // (This is used if GROQ_API_KEY is missing or AI fails.)
  const lower = word.toLowerCase();

  const definition =
    lower === 'resilient'
      ? 'Able to recover quickly from difficulties; tough and adaptable.'
      : 'A common English word. (Mock definition)';

  const translation =
    targetLanguage.code === 'es'
      ? (lower === 'resilient' ? 'resiliente' : `traducción simulada de "${word}"`)
      : `Mock translation of "${word}" to ${targetLanguage.label}`;

  const synonyms = lower === 'resilient'
    ? ['tough', 'adaptable', 'strong', 'hardy', 'robust']
    : ['example synonym 1', 'example synonym 2', 'example synonym 3'];

  const antonyms = lower === 'resilient'
    ? ['fragile', 'vulnerable']
    : [];

  const collocations = lower === 'resilient'
    ? ['a resilient person', 'resilient communities', 'resilient mindset', 'highly resilient']
    : ['common collocation 1', 'common collocation 2', 'common collocation 3'];

  const examples = lower === 'resilient'
    ? [
        'After the setback, she stayed resilient and kept working toward her goal.',
        'The city proved resilient in the face of economic challenges.',
        'Resilient materials can bend without breaking.'
      ]
    : [
        `Here is a natural example sentence using "${word}".`,
        `Another example sentence with "${word}" in context.`
      ];

  const analysis = {
    word,
    targetLanguage,
    definition,
    translation,
    cefrLevel: lower === 'resilient' ? 'B2' : 'Unknown',
    partOfSpeech: lower === 'resilient' ? 'adjective' : 'unknown',
    synonyms,
    antonyms,
    collocations,
    examples,
    usage:
      lower === 'resilient'
        ? 'Use “resilient” to describe people, communities, systems, or materials that recover well after difficulty or stress.'
        : 'Mock usage explanation.',
    commonMistakes:
      lower === 'resilient'
        ? [
            'Don’t confuse “resilient” (recovering quickly) with “resistant” (blocking or preventing).',
            'Common pattern: “be resilient in the face of …”'
          ]
        : ['Mock mistake note 1', 'Mock mistake note 2'],
    pronunciation: lower === 'resilient' ? { ipa: '/rɪˈzɪl.i.ənt/' } : {}
  } as const;

  const quiz = {
    title: `Mini Quiz — ${word}`,
    questions: [
      {
        id: makeId('q', 1),
        type: 'multiple_choice',
        prompt: `Choose the best definition of "${word}".`,
        options: lower === 'resilient'
          ? [
              'Able to recover quickly from difficulties',
              'Very expensive and luxurious',
              'Easily confused or unclear',
              'Extremely small in size'
            ]
          : [
              'Mock correct definition',
              'Mock wrong option A',
              'Mock wrong option B',
              'Mock wrong option C'
            ],
        correctOptionIndex: 0,
        explanation: 'Focus on the core meaning and common usage in everyday contexts.'
      },
      {
        id: makeId('q', 2),
        type: 'select_synonym',
        prompt: `Pick a synonym of "${word}".`,
        options: lower === 'resilient'
          ? ['fragile', 'adaptable', 'careless', 'silent']
          : ['synonym', 'antonym', 'random', 'unrelated'],
        correctOptionIndex: 1,
        explanation: 'A synonym has a similar meaning.'
      },
      {
        id: makeId('q', 3),
        type: 'select_antonym',
        prompt: `Pick an antonym of "${word}" (opposite meaning).`,
        options: lower === 'resilient'
          ? ['robust', 'fragile', 'flexible', 'brave']
          : ['opposite', 'same', 'similar', 'close'],
        correctOptionIndex: 1,
        explanation: 'An antonym expresses the opposite meaning.'
      },
      {
        id: makeId('q', 4),
        type: 'fill_blank',
        prompt: lower === 'resilient'
          ? 'Fill in the blank: “She stayed ____ after failing the first exam.”'
          : `Fill in the blank: “This is a ____ sentence.”`,
        correctText: lower === 'resilient' ? 'resilient' : word.toLowerCase(),
        explanation: 'Use the target word in a grammatically correct position.'
      }
    ]
  } as const;

  return { analysis, quiz };
}
