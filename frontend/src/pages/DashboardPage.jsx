import React from 'react';
import { useQuery } from 'react-query';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  TrendingUp, TrendingDown, Youtube, Instagram, Users, DollarSign,
  Sparkles, ArrowRight, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { analyticsApi, crmApi, aiApi } from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const MOCK_TREND = [
  { day: 'Mon', views: 12400, engagement: 3.2 },
  { day: 'Tue', views: 15800, engagement: 3.8 },
  { day: 'Wed', views: 11200, engagement: 2.9 },
  { day: 'Thu', views: 19400, engagement: 4.5 },
  { day: 'Fri', views: 22100, engagement: 5.1 },
  { day: 'Sat', views: 28400, engagement: 6.3 },
  { day: 'Sun', views: 24600, engagement: 5.7 },
];

const MOCK_TASKS = [
  { id: 1, title: 'Edit YouTube video #47', status: 'in_progress', assignee: 'Alex' },
  { id: 2, title: 'Review Nike brand proposal', status: 'review', assignee: 'You' },
  { id: 3, title: 'Schedule Instagram posts for week', status: 'todo', assignee: 'Maya' },
];

const MOCK_DEALS = [
  { id: 1, brand: 'Nike', value: 8500, status: 'active', due: '2026-05-10' },
  { id: 2, brand: 'Spotify', value: 4200, status: 'negotiation', due: '2026-04-28' },
  { id: 3, brand: 'Adobe', value: 12000, status: 'delivered', due: '2026-04-15' },
];

function StatCard({ label, value, change, icon: Icon, color, prefix = '' }) {
  const isPos = change >= 0;
  return (
    <div className="stat-card card-hover">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} />
        </div>
        <span className={clsx(
          'flex items-center gap-1 text-xs font-medium',
          isPos ? 'text-emerald-600' : 'text-red-500'
        )}>
          {isPos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change)}%
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{prefix}{value.toLocaleString()}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

const statusConfig = {
  todo: { label: 'To Do', color: 'bg-gray-100 text-gray-600' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  review: { label: 'Review', color: 'bg-amber-100 text-amber-700' },
  done: { label: 'Done', color: 'bg-emerald-100 text-emerald-700' },
};

const dealStatusConfig = {
  active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700' },
  negotiation: { label: 'Negotiating', color: 'bg-amber-100 text-amber-700' },
  delivered: { label: 'Delivered', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-600' },
};

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: overview } = useQuery('analytics-overview', analyticsApi.getOverview, {
    onError: () => {},
  });

  const stats = overview?.data?.data || {
    totalViews: 284600,
    followers: 142800,
    engagementRate: 4.8,
    monthlyRevenue: 24500,
    viewsChange: 12.4,
    followersChange: 8.1,
    engagementChange: -1.2,
    revenueChange: 22.3,
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12)  return { text: 'Good Morning',   emoji: '☀️',  sub: "Let's make today count. Here's your creator overview." };
    if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', emoji: '🌤️', sub: "Your afternoon snapshot — stay on top of your goals." };
    if (hour >= 17 && hour < 21) return { text: 'Good Evening',   emoji: '🌆', sub: "Winding down? Here's how your day performed." };
    return { text: 'Good Night',  emoji: '🌙', sub: "Late night hustle — your metrics from today." };
  };
  const greeting = getGreeting();


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting.text}, {user?.name?.split(' ')[0] || 'Creator'} {greeting.emoji}
          </h1>
          <p className="text-gray-500 mt-1">{greeting.sub}</p>
        </div>
        <Link to="/ai-insights" className="btn-primary hidden sm:inline-flex">
          <Sparkles size={16} />
          AI Insights
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Views"
          value={stats.totalViews}
          change={stats.viewsChange}
          icon={Youtube}
          color="text-red-600 bg-red-50"
        />
        <StatCard
          label="Total Followers"
          value={stats.followers}
          change={stats.followersChange}
          icon={Users}
          color="text-purple-600 bg-purple-50"
        />
        <StatCard
          label="Avg. Engagement"
          value={stats.engagementRate}
          change={stats.engagementChange}
          icon={TrendingUp}
          color="text-brand-600 bg-brand-50"
          prefix=""
        />
        <StatCard
          label="Monthly Revenue"
          value={stats.monthlyRevenue}
          change={stats.revenueChange}
          icon={DollarSign}
          color="text-emerald-600 bg-emerald-50"
          prefix="$"
        />
      </div>

      {/* Chart + AI Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Engagement Trend */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-gray-900">Engagement Trend</h3>
              <p className="text-sm text-gray-500">Last 7 days across platforms</p>
            </div>
            <Link to="/analytics" className="btn-ghost text-xs">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MOCK_TREND}>
              <defs>
                <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }}
              />
              <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2.5} fill="url(#viewGrad)" name="Views" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Snapshot */}
        <div className="card p-5 bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-900/20 dark:to-purple-900/20 border-brand-100 dark:border-brand-800/30">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-brand-100 flex items-center justify-center">
              <Sparkles size={14} className="text-brand-600" />
            </div>
            <h3 className="font-semibold text-gray-900">AI Recommendations</h3>
          </div>
          <div className="space-y-3">
            {[
              { icon: Clock, text: 'Best time to post: Thursday 7–9 PM', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30' },
              { icon: TrendingUp, text: 'Tech review content getting 34% higher engagement', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' },
              { icon: AlertCircle, text: 'Nike deal deadline in 3 days — take action', color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-start gap-2.5 bg-white dark:bg-gray-800/50 rounded-xl p-3 border border-white/70 dark:border-gray-700/50">
                <div className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center ${color}`}>
                  <Icon size={12} />
                </div>
                <p className="text-sm text-gray-700 leading-snug">{text}</p>
              </div>
            ))}
          </div>
          <Link to="/ai-insights" className="btn-primary w-full justify-center mt-4 text-xs py-2">
            Full AI Report <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Tasks + Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active Tasks */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Active Tasks</h3>
            <Link to="/team" className="btn-ghost text-xs">View Board <ArrowRight size={14} /></Link>
          </div>
          <div className="space-y-2">
            {MOCK_TASKS.map(task => {
              const sc = statusConfig[task.status] || statusConfig.todo;
              return (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <CheckCircle2 size={18} className="text-gray-300 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                    <p className="text-xs text-gray-400">Assigned to {task.assignee}</p>
                  </div>
                  <span className={`badge ${sc.color}`}>{sc.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Brand Deals */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Brand Deals</h3>
            <Link to="/crm" className="btn-ghost text-xs">View CRM <ArrowRight size={14} /></Link>
          </div>
          <div className="space-y-2">
            {MOCK_DEALS.map(deal => {
              const sc = dealStatusConfig[deal.status] || dealStatusConfig.active;
              return (
                <div key={deal.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300 flex-shrink-0">
                    {deal.brand[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{deal.brand}</p>
                    <p className="text-xs text-gray-400">Due {deal.due}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">${deal.value.toLocaleString()}</p>
                    <span className={`badge ${sc.color} mt-0.5`}>{sc.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
