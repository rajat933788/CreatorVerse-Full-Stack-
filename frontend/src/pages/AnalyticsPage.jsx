import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Youtube, Instagram, TrendingUp, Eye, Heart, MessageCircle, Share2, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

const PLATFORMS = [
  { id: 'all', label: 'All Platforms' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-600' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-purple-600' },
  { id: 'tiktok', label: 'TikTok', color: 'text-cyan-600' },
];

const PERIODS = ['7D', '30D', '90D', '1Y'];

const engagementData = [
  { date: 'Apr 1', youtube: 18200, instagram: 9400, tiktok: 24600 },
  { date: 'Apr 5', youtube: 21400, instagram: 11200, tiktok: 28400 },
  { date: 'Apr 10', youtube: 19800, instagram: 10600, tiktok: 31200 },
  { date: 'Apr 15', youtube: 25600, instagram: 14800, tiktok: 29800 },
  { date: 'Apr 20', youtube: 28400, instagram: 17200, tiktok: 35600 },
];

const platformStats = [
  {
    id: 'youtube', name: 'YouTube', bg: 'bg-red-50',
    followers: '84.2K', growth: '+2.1K',
    metrics: { views: 1240000, likes: 48200, comments: 8600, shares: 3200 },
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#FF0000">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    id: 'instagram', name: 'Instagram', bg: 'bg-purple-50',
    followers: '42.6K', growth: '+1.4K',
    metrics: { views: 384000, likes: 18600, comments: 2400, shares: 1800 },
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <defs>
          <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F58529" />
            <stop offset="50%" stopColor="#DD2A7B" />
            <stop offset="100%" stopColor="#8134AF" />
          </linearGradient>
        </defs>
        <path fill="url(#ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    id: 'tiktok', name: 'TikTok', bg: 'bg-gray-100',
    followers: '15.8K', growth: '+3.8K',
    metrics: { views: 520000, likes: 42400, comments: 6200, shares: 8400 },
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#010101">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
];

const contentPerformance = [
  { title: 'iPhone 16 Pro Max Review', platform: 'YouTube', views: '148K', likes: '8.2K', engagement: '6.8%' },
  { title: 'Morning Routine 2026', platform: 'Instagram', views: '84K', likes: '4.1K', engagement: '5.4%' },
  { title: 'Best Budget Phones', platform: 'TikTok', views: '312K', likes: '28K', engagement: '9.1%' },
  { title: 'My Studio Setup Tour', platform: 'YouTube', views: '96K', likes: '5.6K', engagement: '5.9%' },
  { title: 'Coffee Shop Vlog', platform: 'Instagram', views: '52K', likes: '2.8K', engagement: '4.2%' },
];

const radarData = [
  { metric: 'Views', value: 85 },
  { metric: 'Engagement', value: 72 },
  { metric: 'Reach', value: 68 },
  { metric: 'Shares', value: 58 },
  { metric: 'Comments', value: 65 },
  { metric: 'Saves', value: 80 },
];

export default function AnalyticsPage() {
  const [activePlatform, setActivePlatform] = useState('all');
  const [period, setPeriod] = useState('30D');

  const platformColor = { youtube: '#FF0000', instagram: '#8B5CF6', tiktok: '#06B6D4' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Unified cross-platform performance data</p>
        </div>
        <button className="btn-secondary text-xs">
          <RefreshCw size={14} /> Sync Data
        </button>
      </div>

      {/* Platform Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {PLATFORMS.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePlatform(p.id)}
            className={clsx(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all border',
              activePlatform === p.id
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            )}
          >
            {p.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={clsx(
                'px-3 py-1 rounded-md text-xs font-medium transition-all',
                period === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platformStats.map(p => (
          <div key={p.id} className="card p-5 card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-9 h-9 rounded-xl ${p.bg} flex items-center justify-center flex-shrink-0`}>
                {p.logo}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                <p className="text-xs text-gray-500">{p.followers} followers</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                {p.growth}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Eye, label: 'Views', val: p.metrics.views.toLocaleString() },
                { icon: Heart, label: 'Likes', val: p.metrics.likes.toLocaleString() },
                { icon: MessageCircle, label: 'Comments', val: p.metrics.comments.toLocaleString() },
                { icon: Share2, label: 'Shares', val: p.metrics.shares.toLocaleString() },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={11} className="text-gray-400" />
                    <span className="text-xs text-gray-500">{label}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{val}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Views Over Time</h3>
          <p className="text-sm text-gray-500 mb-5">Cross-platform comparison</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={engagementData}>
              <defs>
                {Object.entries(platformColor).map(([k, c]) => (
                  <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="youtube" stroke="#FF0000" strokeWidth={2} fill="url(#g-youtube)" name="YouTube" />
              <Area type="monotone" dataKey="instagram" stroke="#8B5CF6" strokeWidth={2} fill="url(#g-instagram)" name="Instagram" />
              <Area type="monotone" dataKey="tiktok" stroke="#06B6D4" strokeWidth={2} fill="url(#g-tiktok)" name="TikTok" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Performance Radar</h3>
          <p className="text-sm text-gray-500 mb-3">Overall channel health</p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Content */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Top Performing Content</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="text-xs font-medium text-gray-500 pb-3 pr-4">Title</th>
                <th className="text-xs font-medium text-gray-500 pb-3 pr-4">Platform</th>
                <th className="text-xs font-medium text-gray-500 pb-3 pr-4">Views</th>
                <th className="text-xs font-medium text-gray-500 pb-3 pr-4">Likes</th>
                <th className="text-xs font-medium text-gray-500 pb-3">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {contentPerformance.map((c, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 pr-4 text-sm font-medium text-gray-900">{c.title}</td>
                  <td className="py-3 pr-4">
                    <span className={clsx('badge', {
                      'bg-red-50 text-red-600': c.platform === 'YouTube',
                      'bg-purple-50 text-purple-600': c.platform === 'Instagram',
                      'bg-cyan-50 text-cyan-600': c.platform === 'TikTok',
                    })}>
                      {c.platform}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-700">{c.views}</td>
                  <td className="py-3 pr-4 text-sm text-gray-700">{c.likes}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full"
                          style={{ width: c.engagement }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{c.engagement}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
