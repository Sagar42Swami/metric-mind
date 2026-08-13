import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { BrainCircuit } from 'lucide-react';

export default function DistributionPieChart({ data }) {
  // Calculate distribution based on history points
  let flowCount = 0;
  let focusCount = 0;
  let attentiveCount = 0;
  let distractedCount = 0;

  data.forEach((point) => {
    const focus = point.metrics?.focus ?? 0;
    if (focus >= 85) flowCount++;
    else if (focus >= 70) focusCount++;
    else if (focus >= 50) attentiveCount++;
    else distractedCount++;
  });

  const total = data.length || 1;

  const distribution = [
    { name: 'Flow State (85+)', value: Math.round((flowCount / total) * 100), color: '#10b981' },
    { name: 'Focused (70-84)', value: Math.round((focusCount / total) * 100), color: '#059669' },
    { name: 'Attentive (50-69)', value: Math.round((attentiveCount / total) * 100), color: '#06b6d4' },
    { name: 'Distracted (<50)', value: Math.round((distractedCount / total) * 100), color: '#f43f5e' }
  ].filter(item => item.value > 0); // Don't show 0% states

  // Find dominant state
  let dominant = { name: 'N/A', color: 'text-slate-500' };
  if (distribution.length > 0) {
    const maxVal = Math.max(...distribution.map(d => d.value));
    const maxState = distribution.find(d => d.value === maxVal);
    if (maxState) {
      if (maxState.name.startsWith('Flow')) dominant = { name: 'FLOW', color: 'text-emerald-400 glow-text-success' };
      else if (maxState.name.startsWith('Focused')) dominant = { name: 'FOCUS', color: 'text-teal-400' };
      else if (maxState.name.startsWith('Attentive')) dominant = { name: 'STEADY', color: 'text-cyan-400' };
      else dominant = { name: 'IDLE', color: 'text-rose-400 glow-text-danger' };
    }
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      return (
        <div className="glass-panel p-2.5 rounded-xl border border-space-700/60 shadow-2xl text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.payload.color }} />
            <span className="text-slate-200">{entry.name}:</span>
            <span className="font-mono text-slate-100 font-extrabold">{entry.value}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-space-700/40 w-full relative z-20 flex flex-col justify-between h-full min-h-[300px] group">
      
      {/* Header */}
      <div>
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          Cognitive Load
        </span>
        <h3 className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-indigo-400" />
          <span>State Distribution</span>
        </h3>
      </div>

      {/* Donut Chart Visual */}
      <div className="relative w-full h-44 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distribution}
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="85%"
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
              animationDuration={400}
            >
              {distribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center overlay label */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center">
          <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">
            Dominant Mode
          </span>
          <span className={`text-xl font-black mt-0.5 tracking-wider ${dominant.color}`}>
            {dominant.name}
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 justify-center border-t border-space-700/40 pt-4 text-[10px] font-semibold">
        {distribution.map((d, index) => (
          <div key={index} className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span>{d.name.split(' (')[0]}:</span>
            <span className="font-mono text-slate-300 font-bold">{d.value}%</span>
          </div>
        ))}
        {distribution.length === 0 && (
          <span className="text-slate-500 italic">No telemetry data.</span>
        )}
      </div>

    </div>
  );
}
