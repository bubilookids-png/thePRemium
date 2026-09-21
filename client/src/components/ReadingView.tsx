import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { ReadingMock } from '../data/readingMocks';
import { ReadingMockTest } from './ReadingMockTest';
import { apiFetch } from '../services/apiClient';

export function ReadingView() {
  const [selectedMock, setSelectedMock] = useState<ReadingMock | null>(null);
  const [readingMocks, setReadingMocks] = useState<ReadingMock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMocks() {
      try {
        setIsLoading(true);
        const data = await apiFetch('/api/reading-mocks') as any[];
        const formattedData = data.map((item: any) => item.content);
        setReadingMocks(formattedData);
      } catch (err: any) {
        setError(err.message || 'Failed to load reading mocks');
      } finally {
        setIsLoading(false);
      }
    }
    loadMocks();
  }, []);

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
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-[#F8E7C9]/70 animate-pulse">Loading reading mocks from Turso cloud...</p>
        </div>
      ) : error ? (
        <div className="text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 text-center py-4 my-4">
          {error}
        </div>
      ) : (
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
      )}
    </Card>
  );
}
