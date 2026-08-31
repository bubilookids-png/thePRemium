import React from 'react';

export function Header() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <span>✦</span>
          </div>

          <div className="min-w-0">
            <h1 className="brand-title">
              English Vocabulary Trainer
            </h1>

            <p className="brand-subtitle">
              AI-powered vocabulary lab
            </p>
          </div>
        </div>

        <div className="header-right">
          <div className="topbar-badge">
            <span className="status-dot" />
            <span>AI ready</span>
          </div>

          <div className="header-orb" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
    </header>
  );
}