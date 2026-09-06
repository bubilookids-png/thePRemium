import React from 'react';
import { ServerStatus } from './ServerStatus';

export function Header() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            ✦
          </div>

          <div className="min-w-0">
            <h1 className="brand-title truncate">
              English Vocabulary Trainer
            </h1>

            <p className="brand-subtitle">
              AI-powered vocabulary lab
            </p>
          </div>
        </div>

        <ServerStatus />
      </div>
    </header>
  );
}