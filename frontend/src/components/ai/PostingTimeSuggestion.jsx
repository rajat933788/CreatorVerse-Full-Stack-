import React, { useEffect, useState } from 'react';
import { aiApi } from '../../services/api';
import { Calendar, Clock, Loader2, Sparkles } from 'lucide-react';
import clsx from 'clsx';

export default function PostingTimeSuggestion() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aiApi.getPostingTimeSuggestion()
      .then(res => {
        const backendData = res.data?.data;
        if (backendData && backendData.youtube) {
          setData({
            bestDays: [backendData.youtube.bestDay, backendData.instagram.bestDay, backendData.tiktok.bestDay],
            bestTimes: [backendData.youtube.bestHour, backendData.instagram.bestHour, backendData.tiktok.bestHour],
            heatmap: [
              { day: 'Mon', score: 4 }, { day: 'Tue', score: 5 },
              { day: 'Wed', score: 6 }, { day: 'Thu', score: 9 },
              { day: 'Fri', score: 8 }, { day: 'Sat', score: 10 },
              { day: 'Sun', score: 7 }
            ]
          });
        }
      })
      .catch(() => {
        // Fallback data if endpoint fails
        setData({
          bestDays: ['Tuesday', 'Thursday', 'Saturday'],
          bestTimes: ['09:00 AM', '03:00 PM', '07:30 PM'],
          heatmap: [
            { day: 'Mon', score: 4 }, { day: 'Tue', score: 8 },
            { day: 'Wed', score: 5 }, { day: 'Thu', score: 9 },
            { day: 'Fri', score: 6 }, { day: 'Sat', score: 10 },
            { day: 'Sun', score: 7 }
          ]
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card p-6 flex justify-center items-center h-[280px]">
        <Loader2 size={24} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="card p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-200/50 dark:shadow-none overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-20">
        <Calendar size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
            <Clock size={16} className="text-white" />
          </div>
          <h3 className="font-bold text-lg">Optimal Posting Schedule</h3>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider mb-2">Best Days</p>
            <div className="flex flex-wrap gap-2">
              {data?.bestDays?.map(day => (
                <span key={day} className="px-3 py-1 bg-white/10 backdrop-blur border border-white/20 rounded-full text-sm font-medium">
                  {day}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider mb-2">Peak Times</p>
            <div className="flex flex-wrap gap-2">
              {data?.bestTimes?.map(time => (
                <span key={time} className="px-3 py-1 bg-white text-indigo-600 rounded-full text-sm font-bold shadow-sm flex items-center gap-1.5">
                  <Sparkles size={12} /> {time}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider mb-3">Weekly Heatmap</p>
          <div className="flex gap-2">
            {data?.heatmap?.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full h-16 bg-black/10 rounded-lg flex items-end overflow-hidden p-1">
                  <div 
                    className={clsx(
                      "w-full rounded-[4px] transition-all duration-1000",
                      item.score >= 8 ? "bg-white" : item.score >= 6 ? "bg-white/70" : "bg-white/30"
                    )}
                    style={{ height: `${item.score * 10}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-indigo-100">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
