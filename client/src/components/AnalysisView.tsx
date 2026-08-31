import React from 'react';
import type { VocabAnalysis } from '../types/vocab';
import { Card } from './Card';

function Pill({
  children,
  accent = false
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <span className={`premium-pill ${accent ? 'premium-pill-accent' : ''}`}>
      <span className="premium-pill-dot" />
      {children}
    </span>
  );
}

function SectionIcon({ children }: { children: React.ReactNode }) {
  return <span className="analysis-section-icon">{children}</span>;
}

export function AnalysisView(props: {
  analysis: VocabAnalysis;
  onStartQuiz: () => void;
}) {
  const a = props.analysis;

  return (
    <div className="analysis-view fade-in">

      {/* OVERVIEW */}
      <Card
        title="Word overview"
        subtitle="Everything you need to understand the word"
        rightSlot={
          <button
            onClick={props.onStartQuiz}
            className="premium-quiz-btn"
          >
            <span>✦</span>
            Start mini quiz
            <span className="quiz-btn-arrow">→</span>
          </button>
        }
      >
        <div className="analysis-meta-row">
          <Pill>CEFR · {a.cefrLevel}</Pill>
          <Pill>Part of speech · {a.partOfSpeech}</Pill>

          {a.pronunciation?.ipa ? (
            <Pill accent>
              IPA · {a.pronunciation.ipa}
            </Pill>
          ) : null}
        </div>

        <div className="premium-overview-grid">

          <div className="premium-info-box definition-box">
            <div className="premium-info-top">
              <div className="premium-info-label">
                <SectionIcon>Aa</SectionIcon>
                Definition
              </div>

              <span className="info-language">EN</span>
            </div>

            <div className="premium-info-value">
              {a.definition}
            </div>
          </div>

          <div className="premium-info-box translation-box">
            <div className="premium-info-top">
              <div className="premium-info-label">
                <SectionIcon>文</SectionIcon>
                Translation
              </div>

              <span className="info-language">
                {a.targetLanguage.label}
              </span>
            </div>

            <div className="premium-info-value translation-value">
              {a.translation}
            </div>
          </div>

        </div>
      </Card>

      {/* SYNONYMS + ANTONYMS */}
      <div className="cards-2 analysis-two-column">

        <Card
          title="Synonyms"
          subtitle="Words with similar meaning"
        >
          {a.synonyms?.length ? (
            <div className="premium-tag-list">
              {a.synonyms.map((word, index) => (
                <span
                  className="premium-tag"
                  key={`${word}-${index}`}
                >
                  <span className="tag-symbol">≈</span>
                  {word}
                </span>
              ))}
            </div>
          ) : (
            <div className="premium-empty-state">
              No common synonyms provided.
            </div>
          )}
        </Card>

        <Card
          title="Antonyms"
          subtitle="Words with opposite meaning"
        >
          {a.antonyms?.length ? (
            <div className="premium-tag-list">
              {a.antonyms.map((word, index) => (
                <span
                  className="premium-tag premium-tag-negative"
                  key={`${word}-${index}`}
                >
                  <span className="tag-symbol">≠</span>
                  {word}
                </span>
              ))}
            </div>
          ) : (
            <div className="premium-empty-state">
              No common antonyms provided.
            </div>
          )}
        </Card>

      </div>

      {/* COLLOCATIONS */}
      <Card
        title="Common collocations"
        subtitle="Natural combinations native speakers commonly use"
      >
        {a.collocations?.length ? (
          <div className="premium-collocations">
            {a.collocations.map((collocation, index) => (
              <div
                className="premium-collocation"
                key={`${collocation}-${index}`}
              >
                <span className="collocation-number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="collocation-text">
                  {collocation}
                </span>

                <span className="collocation-arrow">↗</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="premium-empty-state">
            No collocations provided.
          </div>
        )}
      </Card>

      {/* EXAMPLES */}
      <Card
        title="Natural examples"
        subtitle="See how the word works in real English"
      >
        {a.examples?.length ? (
          <ol className="premium-example-list">
            {a.examples.map((example, index) => (
              <li
                className="premium-example-item"
                key={`${example}-${index}`}
              >
                <span className="premium-example-number">
                  {index + 1}
                </span>

                <div className="premium-example-content">
                  <span className="premium-example-label">
                    Example
                  </span>

                  <span className="premium-example-text">
                    {example}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="premium-empty-state">
            No examples provided.
          </div>
        )}
      </Card>

      {/* USAGE + MISTAKES */}
      <div className="cards-2 analysis-two-column">

        <Card
          title="How it’s used"
          subtitle="Practical usage guidance"
        >
          <div className="premium-usage-box">
            <div className="usage-mark">“</div>

            <p className="premium-usage-text">
              {a.usage}
            </p>
          </div>
        </Card>

        <Card
          title="Usage notes"
          subtitle="Common mistakes to avoid"
        >
          {a.commonMistakes?.length ? (
            <div className="premium-mistakes">
              {a.commonMistakes.map((mistake, index) => (
                <div
                  className="premium-mistake"
                  key={`${mistake}-${index}`}
                >
                  <span className="mistake-icon">!</span>

                  <span className="mistake-text">
                    {mistake}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="premium-empty-state">
              No common mistakes listed.
            </div>
          )}
        </Card>

      </div>

      {/* QUIZ CTA */}
      <div className="analysis-final-cta">
        <div>
          <div className="analysis-final-eyebrow">
            READY TO TEST YOUR MEMORY?
          </div>

          <h3>
            Think you’ve got it?
          </h3>

          <p>
            Put this word into practice with a quick AI-generated quiz.
          </p>
        </div>

        <button
          onClick={props.onStartQuiz}
          className="premium-final-quiz-btn"
        >
          <span>✦</span>
          Test your knowledge
          <span>→</span>
        </button>
      </div>

    </div>
  );
}
