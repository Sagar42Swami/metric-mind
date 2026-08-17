import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { formatPercent } from '../lib/utils';

export default function KPICard({
  title,
  value,
  delta,
  metricKey,
  avg,
  trend,
  icon: Icon,
  data,
  isActive,
  onClick,
  thresholds
}) {
  // Format the sparkline data
  const sparklineData = data.slice(-15).map((pt, idx) => ({
    id: idx,
    val: pt.metrics?.[metricKey] ?? 0
  }));

  // Style mappings based on metric key
  const styles = {
    focus: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      activeBorder: 'border-emerald-500/80 shadow-neon-success bg-emerald-500/5',
      gradient: 'colorFocus',
      stroke: '#10b981',
      shadow: 'shadow-emerald-500/5',
      glow: 'glow-text-success'
    },
    stress: {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      activeBorder: 'border-rose-500/80 shadow-neon-danger bg-rose-500/5',
      gradient: 'colorStress',
      stroke: '#f43f5e',
      shadow: 'shadow-rose-500/5',
      glow: 'glow-text-danger'
    },
    activity: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      activeBorder: 'border-cyan-500/80 shadow-neon-cyan bg-cyan-500/5',
      gradient: 'colorActivity',
      stroke: '#06b6d4',
      shadow: 'shadow-cyan-500/5',
      glow: 'glow-text-cyan'
    },
    engagement: {
      text: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30',
      activeBorder: 'border-indigo-500/80 shadow-neon-indigo bg-indigo-500/5',
      gradient: 'colorEngagement',
      stroke: '#6366f1',
      shadow: 'shadow-indigo-500/5',
      glow: 'glow-text-indigo'
    }
  };

  const metricStyle = styles[metricKey] || styles.focus;
  const isTrendPositive = trend >= 0;

  // Get threshold limit text if applicable
  let limitLabel = '';
  if (thresholds) {
    if (metricKey === 'focus') {
      limitLabel = `<${thresholds.focusMin}% | >=${thresholds.focusOptimal}%`;
    } else if (metricKey === 'stress') {
      limitLabel = `>=${thresholds.stressMax}%`;
    }
  }

  // For Stress, lower is better (positive change could actually mean stress is increasing, so let's adjust badge color contextually)
  const isTrendGood = metricKey === 'stress' ? !isTrendPositive : isTrendPositive;

  return (
    <div
      onClick={onClick}
      className={`glass-panel p-5 rounded-2xl cursor-pointer transition-all duration-350 select-none relative overflow-hidden group ${
        isActive 
          ? `${metricStyle.activeBorder} scale-[1.01]` 
          : 'border-space-700/40 hover:border-space-600/70 hover:scale-[1.01] hover:bg-space-800/25'
      }`}
    >
      {/* Decorative backing glow */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 ${
        metricKey === 'focus' ? 'bg-emerald-500' :
        metricKey === 'stress' ? 'bg-rose-500' :
        metricKey === 'activity' ? 'bg-cyan-500' : 'bg-indigo-500'
      }`} />

      {/* Top row */}
      <div className="flex items-center justify-between gap-4 mb-3 relative z-10">
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          {title}
        </span>
        <div className={`p-2 rounded-xl border ${metricStyle.bg} ${metricStyle.border}`}>
          <Icon className={`h-4.5 w-4.5 ${metricStyle.text}`} />
        </div>
      </div>

      {/* Value row */}
      <div className="flex items-baseline gap-2.5 mb-2 relative z-10">
        <span className={`text-3xl font-extrabold tracking-tight text-white font-mono`}>
          {value}
        </span>
        
        {/* Delta vs last tick */}
        {delta !== undefined && delta !== 0 && (
          <span className={`text-xs font-mono font-bold ${
            delta > 0 
              ? metricKey === 'stress' ? 'text-rose-400' : 'text-emerald-400' 
              : metricKey === 'stress' ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {delta > 0 ? `+${delta}` : delta}
          </span>
        )}
        
        {/* Trend Indicator */}
        <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
          isTrendGood 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}>
          {isTrendPositive ? (
            <ArrowUpRight className="h-3 w-3 shrink-0" />
          ) : (
            <ArrowDownRight className="h-3 w-3 shrink-0" />
          )}
          <span>{formatPercent(trend)}</span>
        </div>
      </div>

      {/* Sparkline & Averages */}
      <div className="flex items-end justify-between gap-3 h-12 mt-4 relative z-10">
        <div className="text-[10px] text-slate-500 leading-tight">
          <div className="font-semibold uppercase tracking-wider">Avg Value</div>
          <div className="text-slate-300 font-mono font-bold text-sm mt-0.5">{avg}</div>
        </div>

        {/* Limit Indicator */}
        {limitLabel && (
          <div className="text-[10px] text-slate-500 leading-tight">
            <div className="font-semibold uppercase tracking-wider">Safety Limits</div>
            <div className="text-slate-400 font-mono font-bold text-[9px] mt-1 shrink-0">{limitLabel}</div>
          </div>
        )}

        {/* Mini Sparkline Chart */}
        <div className="w-28 h-full opacity-60 group-hover:opacity-90 transition-opacity duration-300">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData} margin={{ top: 5, bottom: 5, left: 2, right: 2 }}>
              <defs>
                <linearGradient id={metricStyle.gradient} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metricStyle.stroke} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={metricStyle.stroke} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="val"
                stroke={metricStyle.stroke}
                strokeWidth={1.5}
                fillOpacity={1}
                fill={`url(#${metricStyle.gradient})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
