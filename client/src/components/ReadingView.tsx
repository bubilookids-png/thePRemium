import React, { useState } from 'react';
import { Card } from './Card';
import { readingMocks, ReadingMock } from '../data/readingMocks';
import { ReadingMockTest } from './ReadingMockTest';

export function ReadingView() {
  const [selectedMock, setSelectedMock] = useState<ReadingMock | null>(null);

  if (selectedMock) {
    return (
      <div className="w-full max-w-7xl mx-auto flex flex-col h-[calc(100vh-120px)] animate-fade-in relative z-20">
        <button
          onClick={() => setSelectedMock(null)}
          className="mb-4 text-[#F8E7C9]/60 hover:text-[#F8E7C9] self-start flex items-center transition-colors"
        >
          <span className="mr-2">←</span> Back to mock list
        </button>
        <ReadingMockTest mock={selectedMock} />
      </div>
    );
  }

  return (
    <Card title="IELTS Reading Mocks" subtitle="Select a full reading mock to practice">
      <div className="flex flex-col gap-4 py-4">
        {readingMocks.map(mock => (
          <div
            key={mock.id}
            onClick={() => setSelectedMock(mock)}
            className="p-6 border border-[#F8E7C9]/10 rounded-xl bg-[#091511] hover:bg-[#0c1f19] transition-colors cursor-pointer flex flex-col justify-between items-start"
          >
            <h3 className="text-xl font-medium text-[#F8E7C9] mb-2">{mock.title}</h3>
            <p className="text-sm text-[#F8E7C9]/60">
              3 Passages • 40 Questions
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
