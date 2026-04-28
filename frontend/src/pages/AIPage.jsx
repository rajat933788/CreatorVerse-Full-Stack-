import React from 'react';
import AIChat from '../components/ai/AIChat';
import AIRecommendations from '../components/ai/AIRecommendations';
import PostingTimeSuggestion from '../components/ai/PostingTimeSuggestion';

export default function AIPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">AI Assistant</h1>
        <p className="text-gray-500 dark:text-gray-400">Your personal co-pilot for content strategy and analytics.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <AIRecommendations />
          <PostingTimeSuggestion />
        </div>
        
        <div className="xl:col-span-1">
          <AIChat />
        </div>
      </div>
    </div>
  );
}
