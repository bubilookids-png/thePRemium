import React, { useMemo, useState } from 'react';
import { createReading } from '../services/readingApi';
import type {
  ReadingResponse,
  ReadingQuestionType
} from '../types/reading';

type Props = {
  onBack: () => void;
};

function typeLabel(type: ReadingQuestionType) {
  const labels: Record<
    ReadingQuestionType,
    string
  > = {
    multiple_choice: 'Multiple Choice',
    true_false_not_given: 'True / False / Not Given',
    yes_no_not_given: 'Yes / No / Not Given',
    matching_headings: 'Matching Headings',
    matching_information: 'Matching Information',
    matching_features: 'Matching Features',
    sentence_completion: 'Sentence Completion',
    summary_completion: 'Summary Completion',
    note_completion: 'Note Completion',
    table_completion: 'Table Completion',
    flow_chart_completion: 'Flow-chart Completion',
    short_answer: 'Short Answer'
  };

  return labels[type];
}

export function ReadingCreator({
  onBack
}: Props) {
  const [title, setTitle] = useState('');
  const [passage, setPassage] = useState('');
  const [questions, setQuestions] =
    useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const [reading, setReading] =
    useState<ReadingResponse | null>(null);

  const questionCount = useMemo(() => {
    if (!reading) return 0;

    return reading.groups.reduce(
      (total, group) =>
        total + group.questions.length,
      0
    );
  }, [reading]);

  async function handleCreate() {
    setError(null);

    if (passage.trim().length < 50) {
      setError(
        'Please enter the full reading passage.'
      );
      return;
    }

    if (!questions.trim()) {
      setError(
        'Please enter the questions for this passage.'
      );
      return;
    }

    setLoading(true);

    try {
      const result = await createReading({
        title: title.trim() || undefined,
        passage,
        questions
      });

      setReading(result);

      window.setTimeout(() => {
        document
          .getElementById('reading-workspace')
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
      }, 80);
    } catch (e: any) {
      setError(
        e?.message ||
          'Could not create the Reading test.'
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setReading(null);
    setError(null);

    window.setTimeout(() => {
      document
        .getElementById('reading-creator-input')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
    }, 50);
  }

  if (reading) {
    return (
      <div className="reading-page fade-in">
        <div className="reading-toolbar">
          <div>
            <div className="reading-eyebrow">
              ✦ IELTS reading workspace
            </div>

            <h2 className="reading-title">
              {reading.title}
            </h2>

            <div className="reading-meta">
              <span className="reading-pill">
                <span className="reading-pill-dot" />
                {questionCount} questions
              </span>

              <span className="reading-pill">
                {reading.groups.length} sections
              </span>
            </div>
          </div>

          <div className="reading-toolbar-actions">
            <button
              type="button"
              className="reading-secondary-btn"
              onClick={handleReset}
            >
              ← Edit
            </button>

            <button
              type="button"
              className="reading-primary-btn"
              onClick={onBack}
            >
              Vocabulary
            </button>
          </div>
        </div>

        <div
          id="reading-workspace"
          className="reading-workspace"
        >
          <section className="reading-pane reading-passage-pane">
            <div className="reading-pane-header">
              <div>
                <span className="reading-pane-label">
                  PASSAGE
                </span>

                <strong>
                  Read the text carefully
                </strong>
              </div>

              <span className="reading-pane-number">
                01
              </span>
            </div>

            <article className="reading-passage">
              {reading.passage
                .split(/\n\s*\n/)
                .map((paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ))}
            </article>
          </section>

          <section className="reading-pane reading-questions-pane">
            <div className="reading-pane-header">
              <div>
                <span className="reading-pane-label">
                  QUESTIONS
                </span>

                <strong>
                  Answer the questions
                </strong>
              </div>

              <span className="reading-pane-number">
                {String(questionCount).padStart(
                  2,
                  '0'
                )}
              </span>
            </div>

            <div className="reading-question-content">
              {reading.groups.map(
                (group) => (
                  <div
                    key={group.id}
                    className="reading-group"
                  >
                    <div className="reading-group-top">
                      <span>
                        {typeLabel(group.type)}
                      </span>
                    </div>

                    {group.instruction ? (
                      <p className="reading-instruction">
                        {group.instruction}
                      </p>
                    ) : null}

                    {group.questions.map(
                      (question) => (
                        <ReadingQuestion
                          key={`${group.id}-${question.number}`}
                          question={question}
                          group={group}
                        />
                      )
                    )}
                  </div>
                )
              )}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="reading-page fade-in">
      <div className="reading-intro">
        <div>
          <button
            type="button"
            className="reading-back-link"
            onClick={onBack}
          >
            ← Back to Vocabulary
          </button>

          <div className="reading-eyebrow">
            ✦ AI reading creator
          </div>

          <h2 className="reading-hero-title">
            Turn your passage into
            <span> a real Reading workspace.</span>
          </h2>

          <p className="reading-hero-copy">
            Paste your own IELTS-style passage and
            its questions. AI will structure them
            into a clean two-pane reading interface
            without generating new content.
          </p>
        </div>

        <div className="reading-feature-card">
          <span>01</span>
          <strong>Paste your content</strong>
          <p>
            Your passage and questions stay yours.
          </p>
        </div>

        <div className="reading-feature-card">
          <span>02</span>
          <strong>AI structures it</strong>
          <p>
            Question types and groups are detected
            automatically.
          </p>
        </div>

        <div className="reading-feature-card">
          <span>03</span>
          <strong>Practice naturally</strong>
          <p>
            Read left, answer right — just like a
            focused IELTS workspace.
          </p>
        </div>
      </div>

      <div
        id="reading-creator-input"
        className="reading-creator-card section-card"
      >
        <div className="section-head">
          <div>
            <h3 className="section-title">
              Create Reading
            </h3>

            <p className="section-kicker">
              Supply the original passage and
              questions
            </p>
          </div>

          <span className="reading-ai-badge">
            ✦ Cerebras AI
          </span>
        </div>

        <div className="section-body">
          <div className="reading-field">
            <label className="field-label">
              Title
              <span className="field-hint">
                optional
              </span>
            </label>

            <input
              className="text-input"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="e.g. The History of Coffee"
              maxLength={160}
            />
          </div>

          <div className="reading-input-grid">
            <div className="reading-field">
              <div className="field-label">
                <span>Reading passage</span>

                <span className="field-hint">
                  {passage.length.toLocaleString()}
                  / 60,000
                </span>
              </div>

              <textarea
                className="reading-textarea"
                value={passage}
                onChange={(e) =>
                  setPassage(e.target.value)
                }
                placeholder={`Paste your complete reading passage here...

Keep the original paragraphs and wording.`}
              />
            </div>

            <div className="reading-field">
              <div className="field-label">
                <span>Questions</span>

                <span className="field-hint">
                  {questions.length.toLocaleString()}
                  / 30,000
                </span>
              </div>

              <textarea
                className="reading-textarea"
                value={questions}
                onChange={(e) =>
                  setQuestions(e.target.value)
                }
                placeholder={`Paste the questions belonging to the passage here...

For example:
Questions 1–5
Choose the correct letter, A, B, C or D.

1. ...
A ...
B ...
C ...
D ...`}
              />
            </div>
          </div>

          {error ? (
            <div className="reading-error">
              <strong>Couldn’t create Reading</strong>
              <span>{error}</span>
            </div>
          ) : null}

          <button
            type="button"
            className="reading-create-btn"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="reading-btn-spinner" />
                Structuring your Reading...
              </>
            ) : (
              <>
                <span>✦</span>
                Create Reading
                <span>→</span>
              </>
            )}
          </button>

          <p className="reading-privacy-note">
            AI structures your supplied content. It
            does not generate a new passage or invent
            questions.
          </p>
        </div>
      </div>
    </div>
  );
}

function ReadingQuestion({
  question,
  group
}: {
  question: ReadingResponse['groups'][number]['questions'][number];
  group: ReadingResponse['groups'][number];
}) {
  const options =
    question.options ||
    group.options ||
    undefined;

  const matchingItems =
    question.matchingItems ||
    group.matchingItems ||
    undefined;

  const isChoice =
    question.type === 'multiple_choice' ||
    question.type === 'true_false_not_given' ||
    question.type === 'yes_no_not_given';

  const isMatching =
    question.type.startsWith('matching_');

  return (
    <div className="reading-question">
      <div className="reading-question-number">
        {question.number}
      </div>

      <div className="reading-question-body">
        <p className="reading-question-text">
          {question.question}
        </p>

        {isChoice && options?.length ? (
          <div className="reading-options">
            {options.map((option, index) => (
              <label
                className="reading-option"
                key={`${question.number}-${index}`}
              >
                <input
                  type="radio"
                  name={`reading-q-${question.number}`}
                />

                <span className="reading-option-letter">
                  {String.fromCharCode(65 + index)}
                </span>

                <span>{option}</span>
              </label>
            ))}
          </div>
        ) : isMatching &&
          matchingItems?.length ? (
          <select
            className="reading-answer-select"
            defaultValue=""
          >
            <option value="" disabled>
              Select an answer
            </option>

            {matchingItems.map(
              (item, index) => (
                <option
                  value={item}
                  key={`${question.number}-${index}`}
                >
                  {item}
                </option>
              )
            )}
          </select>
        ) : (
          <input
            className="reading-answer-input"
            type="text"
            placeholder="Your answer..."
          />
        )}
      </div>
    </div>
  );
}