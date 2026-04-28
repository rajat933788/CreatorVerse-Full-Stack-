import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Users, Eye, TrendingUp, Briefcase, Loader2 } from 'lucide-react';
import { analyticsApi, crmApi } from '../services/api';

const COLORS = {
  YouTube: '#FF0000',
  Instagram: '#8B5CF6',
  TikTok: '#06B6D4'
};

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [dealsCount, setDealsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.getOverview(),
      analyticsApi.getEngagementTrend(30),
      crmApi.getDeals()
    ])
      .then(([overviewRes, trendRes, dealsRes]) => {
        setOverview(overviewRes.data?.data || overviewRes.data);
        setTrendData(trendRes.data?.data || trendRes.data || []);
        
        const deals = dealsRes.data?.data || dealsRes.data || [];
        const activeDeals = deals.filter(d => ['active', 'negotiation'].includes(d.status)).length;
        setDealsCount(activeDeals);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  const stats = overview || {
    totalViews: 0, followers: 0, engagementRate: 0, platforms: {}
  };

  const pieData = [
    { name: 'YouTube', value: stats.platforms?.youtube?.followers || 0 },
    { name: 'Instagram', value: stats.platforms?.instagram?.followers || 0 },
    { name: 'TikTok', value: stats.platforms?.tiktok?.followers || 0 }
  ];

  // Group trend data by week for the bar chart
  const weeklyData = [];
  for (let i = 0; i < trendData.length; i += 7) {
    const weekChunk = trendData.slice(i, i + 7);
    const weekAgg = {
      week: `Week ${Math.floor(i / 7) + 1}`,
      YouTube: weekChunk.reduce((sum, day) => sum + (day.youtube || 0), 0),
      Instagram: weekChunk.reduce((sum, day) => sum + (day.instagram || 0), 0),
      TikTok: weekChunk.reduce((sum, day) => sum + (day.tiktok || 0), 0),
    };
    weeklyData.push(weekAgg);
  }

  const lineData = trendData.map(d => ({
    date: d.date,
    YouTube: d.youtube,
    Instagram: d.instagram
  }));

  const statCards = [
    { label: 'Total Followers', value: stats.followers?.toLocaleString() || '0', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Views This Month', value: stats.totalViews?.toLocaleString() || '0', icon: Eye, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Avg Engagement Rate', value: `${stats.engagementRate || 0}%`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Active Brand Deals', value: dealsCount, icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400">Deep dive into your audience growth and engagement.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="card p-6 bg-white dark:bg-gray-900 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg} dark:bg-gray-800 ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="card p-6 bg-white dark:bg-gray-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Views Over Last 30 Days</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} minTickGap={30} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 12 }} tickMargin={10} stroke="#9CA3AF" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="YouTube" stroke={COLORS.YouTube} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Instagram" stroke={COLORS.Instagram} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="card p-6 bg-white dark:bg-gray-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Weekly Engagement</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} tickMargin={10} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 12 }} tickMargin={10} stroke="#9CA3AF" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f3f4f6', opacity: 0.4 }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="YouTube" fill={COLORS.YouTube} radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Instagram" fill={COLORS.Instagram} radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="TikTok" fill={COLORS.TikTok} radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card p-6 bg-white dark:bg-gray-900 lg:col-span-2 flex flex-col items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 self-start">Follower Distribution</h3>
          <div className="h-[300px] w-full max-w-md">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
