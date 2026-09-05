import React from 'react';
import { ServerStatus } from './ServerStatus';

type HeaderProps = {
  onReadingClick?: () => void;
  readingActive?: boolean;
};

export function Header({
  onReadingClick,
  readingActive = false
}: HeaderProps) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <div
            className="brand-mark"
            aria-hidden="true"
          >
            ✦
          </div>

          <div className="min-w-0">
            <h1 className="brand-title truncate">
              English Vocabulary Trainer
            </h1>

            <p className="brand-subtitle">
              AI-powered learning lab
            </p>
          </div>
        </div>

        <div className="header-right">
          {onReadingClick ? (
            <button
              type="button"
              className={`reading-nav-btn ${
                readingActive
                  ? 'reading-nav-btn-active'
                  : ''
              }`}
              onClick={onReadingClick}
            >
              <span>✦</span>
              Reading Creator
            </button>
          ) : null}

          <ServerStatus />
        </div>
      </div>
    </header>
  );
}