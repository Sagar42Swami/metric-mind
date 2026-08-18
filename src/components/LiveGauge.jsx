import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function LiveGauge({ value, title, metricKey, avg }) {
  // Setup data for the gauge
  const chartData = [
    { name: 'Value', value: Math.min(100, Math.max(0, value)) },
    { name: 'Remaining', value: 100 - Math.min(100, Math.max(0, value)) }
  ];

  // Colors & Gradients based on key
  const gaugeThemes = {
    focus: {
      color: '#10b981',
      bg: '#112220',
      gradientId: 'gaugeFocusGrad',
      startCol: '#059669',
      stopCol: '#10b981',
      stateFn: (val) => {
        if (val >= 85) return { label: 'Optimal Flow', style: 'text-emerald-400 glow-text-success border-emerald-500/20 bg-emerald-500/10' };
        if (val >= 70) return { label: 'Highly Focused', style: 'text-teal-400 border-teal-500/20 bg-teal-500/10' };
        if (val >= 50) return { label: 'Attentive', style: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10' };
        return { label: 'Distracted', style: 'text-rose-400 glow-text-danger border-rose-500/20 bg-rose-500/10' };
      }
    },
    stress: {
      color: '#f43f5e',
      bg: '#24141d',
      gradientId: 'gaugeStressGrad',
      startCol: '#e11d48',
      stopCol: '#fb7185',
      stateFn: (val) => {
        if (val >= 80) return { label: 'High Stress Spike', style: 'text-rose-400 glow-text-danger border-rose-500/30 bg-rose-500/25 animate-pulse' };
        if (val >= 55) return { label: 'Elevated Stress', style: 'text-amber-400 border-amber-500/20 bg-amber-500/10' };
        if (val >= 30) return { label: 'Normal / Productive', style: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10' };
        return { label: 'Completely Relaxed', style: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' };
      }
    },
    activity: {
      color: '#06b6d4',
      bg: '#102027',
      gradientId: 'gaugeActivityGrad',
      startCol: '#0891b2',
      stopCol: '#22d3ee',
      stateFn: (val) => {
        if (val >= 75) return { label: 'Hyperactive State', style: 'text-cyan-400 glow-text-cyan border-cyan-500/20 bg-cyan-500/10' };
        if (val >= 40) return { label: 'Steady Motion', style: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10' };
        return { label: 'Resting / Calming', style: 'text-slate-400 border-slate-500/20 bg-slate-500/10' };
      }
    },
    engagement: {
      color: '#6366f1',
      bg: '#17182e',
      gradientId: 'gaugeEngagementGrad',
      startCol: '#4f46e5',
      stopCol: '#818cf8',
      stateFn: (val) => {
        if (val >= 80) return { label: 'High Alignment', style: 'text-indigo-400 glow-text-indigo border-indigo-500/20 bg-indigo-500/10' };
        if (val >= 60) return { label: 'Steady Response', style: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10' };
        return { label: 'Passive Listening', style: 'text-slate-400 border-slate-500/20 bg-slate-500/10' };
      }
    }
  };

  const currentTheme = gaugeThemes[metricKey] || gaugeThemes.focus;
  const status = currentTheme.stateFn(value);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-space-700/40 flex flex-col items-center justify-between h-full min-h-[300px] relative overflow-hidden group">
      
      {/* Title */}
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          Telemetry Dial Meter
        </span>
        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-900 border border-space-700 text-slate-400 font-mono">
          {title}
        </span>
      </div>

      {/* Gauge Visual */}
      <div className="relative w-full h-44 flex items-center justify-center mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <linearGradient id={currentTheme.gradientId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={currentTheme.startCol} />
                <stop offset="100%" stopColor={currentTheme.stopCol} />
              </linearGradient>
            </defs>
            <Pie
              data={chartData}
              startAngle={180}
              endAngle={0}
              innerRadius="75%"
              outerRadius="95%"
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              cx="50%"
              cy="80%"
              isAnimationActive={false} // Keeps update responsive
            >
              <Cell fill={`url(#${currentTheme.gradientId})`} />
              <Cell fill="var(--color-hud-border)" opacity={0.25} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Digital Readout inside Center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/6 flex flex-col items-center text-center mt-3">
          <span className="text-4xl font-extrabold tracking-tight text-white font-mono leading-none">
            {value}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1.5">
            Current Index
          </span>
          <div className={`mt-2.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border ${status.style}`}>
            {status.label}
          </div>
        </div>
      </div>

      {/* Footer stats */}
      <div className="w-full flex items-center justify-between border-t border-space-700/40 pt-4 mt-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Target Segment Avg</span>
          <span className="text-sm font-bold text-slate-300 font-mono mt-0.5">{avg}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Deviation</span>
          <span className={`text-sm font-bold font-mono mt-0.5 ${
            value - avg >= 0 
              ? metricKey === 'stress' ? 'text-rose-400' : 'text-emerald-400' 
              : metricKey === 'stress' ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {value - avg >= 0 ? `+${value - avg}` : `${value - avg}`}
          </span>
        </div>
      </div>
    </div>
  );
}
