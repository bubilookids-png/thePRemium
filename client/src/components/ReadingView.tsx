import React from 'react';
import { Card } from './Card';

export function ReadingView() {
  return (
    <Card title="IELTS Reading Mocks" subtitle="Select a full reading mock to practice">
      <div className="flex flex-col items-center justify-center py-10 text-[#F8E7C9]/70 text-sm font-mono">
        <span className="text-4xl mb-4">📖</span>
        <p>Reading mock list will appear here.</p>
        <p className="mt-2 text-xs">Waiting for mock data to be provided...</p>
      </div>
    </Card>
  );
}
