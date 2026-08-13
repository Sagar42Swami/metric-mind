import React from 'react';
import { Clock, Eye } from 'lucide-react';

export default function FilterBar({
  timeframe,
  onSetTimeframe,
  activeMetric,
  onSetActiveMetric
}) {
  const timeframes = [
    { label: '1 Minute', value: 1, desc: 'Last 40 ticks' },
    { label: '5 Minutes', value: 5, desc: 'Last 200 ticks' },
    { label: '15 Minutes', value: 15, desc: 'Full history' }
  ];

  const metrics = [
    { key: 'focus', label: 'Focus Score', color: 'border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 active-bg:bg-emerald-500/10' },
    { key: 'stress', label: 'Stress Level', color: 'border-rose-500/30 hover:border-rose-500/50 text-rose-400 active-bg:bg-rose-500/10' },
    { key: 'activity', label: 'Activity Index', color: 'border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 active-bg:bg-cyan-500/10' },
    { key: 'engagement', label: 'Engagement Rate', color: 'border-indigo-500/30 hover:border-indigo-500/50 text-indigo-400 active-bg:bg-indigo-500/10' }
  ];

  return (
    <div className="glass-panel px-6 py-4 rounded-2xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border border-space-700/40 relative z-20">
      
      {/* Time Window Tabs */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-800/50 rounded-xl border border-space-700/50 text-slate-400">
          <Clock className="h-4.5 w-4.5" />
        </div>
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-space-700/40">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => onSetTimeframe(tf.value)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                timeframe === tf.value
                  ? 'bg-indigo-500 text-white shadow-neon-indigo/35'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/55'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
        <span className="hidden sm:inline text-xs text-slate-500 font-medium">
          {timeframes.find(t => t.value === timeframe)?.desc}
        </span>
      </div>

      {/* Primary Metric Filter Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-slate-400 p-2 bg-slate-800/50 rounded-xl border border-space-700/50">
          <Eye className="h-4.5 w-4.5" />
          <span className="text-xs font-bold uppercase tracking-wide">Focus Metric:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {metrics.map((m) => {
            const isActive = activeMetric === m.key;
            let activeStyles = '';
            
            if (isActive) {
              if (m.key === 'focus') activeStyles = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold shadow-neon-success/20';
              if (m.key === 'stress') activeStyles = 'bg-rose-500/20 border-rose-500 text-rose-400 font-bold shadow-neon-danger/20';
              if (m.key === 'activity') activeStyles = 'bg-cyan-500/20 border-cyan-500 text-cyan-400 font-bold shadow-neon-cyan/20';
              if (m.key === 'engagement') activeStyles = 'bg-indigo-500/20 border-indigo-500 text-indigo-400 font-bold shadow-neon-indigo/20';
            } else {
              activeStyles = 'bg-slate-900/40 border-space-700/40 text-slate-400 hover:text-slate-300';
            }

            return (
              <button
                key={m.key}
                onClick={() => onSetActiveMetric(m.key)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-200 ${activeStyles}`}
              >
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${
                  m.key === 'focus' ? 'bg-emerald-400' :
                  m.key === 'stress' ? 'bg-rose-400' :
                  m.key === 'activity' ? 'bg-cyan-400' : 'bg-indigo-400'
                }`} />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
