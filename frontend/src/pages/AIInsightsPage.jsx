import React, { useState } from 'react';
import {
  Sparkles, TrendingUp, Clock, Target, Users, Zap, Brain,
  ChevronRight, RefreshCw, ThumbsUp, ThumbsDown, Send, Bot
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import clsx from 'clsx';

const POSTING_DATA = [
  { time: '6AM', score: 28 }, { time: '9AM', score: 62 }, { time: '12PM', score: 74 },
  { time: '3PM', score: 55 }, { time: '6PM', score: 88 }, { time: '9PM', score: 95 },
  { time: '12AM', score: 40 },
];

const BRAND_MATCHES = [
  { brand: 'Logitech', category: 'Tech', match: 94, reason: 'Your tech review niche aligns with their creator-focused product line', value: '$6,000–$10,000', logo: 'L' },
  { brand: 'Squarespace', category: 'Website', match: 89, reason: 'Strong audience overlap with creators and entrepreneurs', value: '$3,500–$7,000', logo: 'S' },
  { brand: 'Audible', category: 'Education', match: 85, reason: 'Your audience skews 25–34, high purchase intent for books', value: '$2,000–$4,000', logo: 'A' },
  { brand: 'Rode Mics', category: 'Audio', match: 82, reason: 'Your studio setup content performs well — high gear interest signal', value: '$1,500–$3,000', logo: 'R' },
];

const CONTENT_SUGGESTIONS = [
  { title: 'Best Budget Microphones Under $100 (2026)', type: 'YouTube Long-form', confidence: 92, tags: ['gear', 'budget', 'audio'] },
  { title: '5 AI Tools Every Creator Needs Right Now', type: 'YouTube Short', confidence: 88, tags: ['AI', 'productivity'] },
  { title: 'Day in My Life as a Full-Time Creator', type: 'Instagram Reel', confidence: 84, tags: ['lifestyle', 'vlog'] },
  { title: 'How I Made $24K from Brand Deals This Month', type: 'YouTube Long-form', confidence: 79, tags: ['money', 'creator economy'] },
];

const INIT_MESSAGES = [
  { role: 'assistant', text: "Hi! I'm your CreatorVerse AI assistant. Ask me anything about your content strategy, brand deals, engagement, or audience growth." },
];

function ChatPanel() {
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const CANNED = {
    'best time to post': "Based on your audience data, your best posting times are **Thursday–Friday between 6–9 PM IST**. Engagement is 42% higher during these windows compared to morning posts.",
    'content strategy': "Your top performing content is tech reviews and gear roundups. I recommend doubling down on comparison videos (e.g., 'X vs Y') — they get 2.3x more impressions from search.",
    'brand deals': "You have 3 open brand deals with a combined value of $22,700. The Nike deal deadline is in 3 days — I recommend sending the deliverable draft today for timely review.",
    'audience': "Your audience is 68% male, aged 22–34. Top locations: India (42%), USA (28%), UK (11%). They're most active on weekday evenings. High interest in tech, productivity, and creator tools.",
  };

  const getReply = (msg) => {
    const lower = msg.toLowerCase();
    for (const [key, reply] of Object.entries(CANNED)) {
      if (lower.includes(key)) return reply;
    }
    return "Great question! Based on your current analytics, I'd recommend focusing on your highest-engagement content format (tech reviews) and scheduling your posts during peak activity windows. Would you like me to dig deeper into any specific area?";
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(p => [...p, { role: 'user', text: userMsg }]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setMessages(p => [...p, { role: 'assistant', text: getReply(userMsg) }]);
    setLoading(false);
  };

  return (
    <div className="card flex flex-col h-96">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-brand-100 flex items-center justify-center">
          <Bot size={14} className="text-brand-600" />
        </div>
        <span className="font-semibold text-gray-900 text-sm">AI Assistant</span>
        <span className="ml-auto text-xs text-emerald-600 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse-soft" /> Online
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={clsx('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={clsx('max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
              m.role === 'user'
                ? 'bg-brand-600 text-white rounded-tr-sm'
                : 'bg-gray-100 text-gray-800 rounded-tl-sm'
            )}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="p-3 border-t border-gray-100 flex gap-2">
        <input
          className="input flex-1 text-sm py-2"
          placeholder="Ask about strategy, content, deals..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button onClick={send} className="btn-primary px-3 py-2">
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}

function MatchBar({ value }) {
  const color = value >= 90 ? 'bg-emerald-500' : value >= 80 ? 'bg-brand-500' : 'bg-amber-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-sm font-bold text-gray-900 w-8 text-right">{value}%</span>
    </div>
  );
}

export default function AIInsightsPage() {
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1200));
    setRefreshing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-500 mt-1">Predictive analytics and strategic recommendations</p>
        </div>
        <button onClick={refresh} className={clsx('btn-secondary', refreshing && 'opacity-60')}>
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Forecast Banner */}
      <div className="card p-5 bg-gradient-to-r from-brand-600 to-purple-600 text-white border-0">
        <div className="flex items-center gap-3 mb-3">
          <Brain size={20} className="opacity-80" />
          <span className="font-semibold">Engagement Forecast — Next 7 Days</span>
          <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">92–95% accuracy</span>
        </div>
        <p className="text-brand-100 text-sm mb-4">Based on your historical data, current trends, and posting schedule, we predict:</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Projected Views', value: '312K', change: '+18%' },
            { label: 'Projected Engagement', value: '5.6%', change: '+0.8%' },
            { label: 'Estimated Revenue', value: '$2,840', change: '+12%' },
          ].map(({ label, value, change }) => (
            <div key={label} className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-brand-200 mt-0.5">{label}</p>
              <p className="text-xs text-emerald-300 mt-1 font-medium">{change} vs last week</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Best Posting Times */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-brand-500" />
            <h3 className="font-semibold text-gray-900">Best Posting Times Today</h3>
            <span className="ml-auto badge bg-amber-100 text-amber-700">Thursday</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={POSTING_DATA} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(v) => [`${v}/100`, 'Engagement Score']}
              />
              <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]}
                label={{ position: 'top', fontSize: 9, fill: '#94a3b8' }}
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-center text-gray-500 mt-2">
            🕘 Peak window: <span className="font-semibold text-gray-700">9 PM IST</span> — engagement score 95/100
          </p>
        </div>

        {/* Content Suggestions */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-brand-500" />
            <h3 className="font-semibold text-gray-900">Content Ideas (AI Generated)</h3>
          </div>
          <div className="space-y-2.5">
            {CONTENT_SUGGESTIONS.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all cursor-pointer group">
                <div className="w-7 h-7 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-brand-600">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 leading-snug">{s.title}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-gray-400">{s.type}</span>
                    {s.tags.map(t => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-md">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-bold text-emerald-600">{s.confidence}%</span>
                  <span className="text-[10px] text-gray-400">confidence</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Matches */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-5">
          <Target size={16} className="text-brand-500" />
          <h3 className="font-semibold text-gray-900">AI Brand Match Recommendations</h3>
          <span className="ml-auto text-xs text-gray-400">Precision@k: 90%+</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BRAND_MATCHES.map((b, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-100 hover:border-brand-200 transition-all space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-700">
                  {b.logo}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{b.brand}</p>
                  <p className="text-xs text-gray-400">{b.category} · Est. {b.value}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-600">{b.match}%</span>
                  <p className="text-[10px] text-gray-400">match</p>
                </div>
              </div>
              <MatchBar value={b.match} />
              <p className="text-xs text-gray-500 leading-relaxed">{b.reason}</p>
              <div className="flex gap-2 pt-1">
                <button className="btn-primary flex-1 justify-center text-xs py-1.5">Reach Out</button>
                <button className="btn-ghost text-gray-400 px-2 py-1.5">
                  <ThumbsDown size={13} />
                </button>
                <button className="btn-ghost text-brand-500 px-2 py-1.5">
                  <ThumbsUp size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat */}
      <ChatPanel />
    </div>
  );
}
