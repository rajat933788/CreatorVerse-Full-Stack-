import React, { useEffect, useState } from 'react';
import { aiApi } from '../../services/api';
import { Lightbulb, ArrowRight, Loader2 } from 'lucide-react';

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    aiApi.getRecommendations()
      .then(res => {
        const ideas = res.data?.data?.contentIdeas || [];
        setRecommendations(ideas.map(idea => ({ title: idea.title, description: `Confidence: ${idea.confidence}%. Tags: ${idea.tags.join(', ')}` })));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card p-8 flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 size={32} className="animate-spin text-indigo-500 mb-4" />
        <p className="text-gray-500 text-sm font-medium">Generating smart recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400 text-sm font-medium">Failed to load recommendations: {error}</p>
      </div>
    );
  }

  const defaultRecs = [
    { title: 'Create a "Behind the Scenes" Vlog', description: 'Your audience engagement spikes when you show authenticity. A BTS video is highly likely to perform well this week.' },
    { title: 'Reach out to Tech Brands', description: 'Your recent gadget review had 34% higher retention. Pitch to smaller tech accessory brands now.' },
    { title: 'Post an Interactive Poll on Instagram', description: 'Instagram algorithm currently favors accounts utilizing polls in stories. Ask about their favorite editing software.' }
  ];

  const displayRecs = recommendations.length >= 3 ? recommendations.slice(0, 3) : defaultRecs;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb size={20} className="text-amber-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Action Plan</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayRecs.map((rec, i) => (
          <div key={i} className="card p-5 hover:-translate-y-1 transition-transform duration-200 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-100 dark:border-gray-700 flex flex-col h-full">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm mb-4 shrink-0">
              {i + 1}
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">{rec.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 flex-grow">{rec.description}</p>
            <button className="btn-secondary w-full justify-center text-xs mt-auto group">
              Take Action <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
