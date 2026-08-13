import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

export default function CategoryBarChart({ liveAverages }) {
  // Mock comparison profiles
  const profiles = [
    { name: 'Deep Dev', focus: 84, stress: 35, activity: 68, engagement: 90 },
    { name: 'VC Calls', focus: 58, stress: 72, activity: 45, engagement: 85 },
    { name: 'Casual Web', focus: 45, stress: 25, activity: 38, engagement: 50 },
    { name: 'Creative', focus: 75, stress: 48, activity: 58, engagement: 80 }
  ];

  // Append the live averages of the current session
  const chartData = [
    ...profiles,
    {
      name: 'LIVE SESSION',
      focus: liveAverages.focus,
      stress: liveAverages.stress,
      activity: liveAverages.activity,
      engagement: liveAverages.engagement,
      isLive: true
    }
  ];

  // Custom cell coloring or highlight logic
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3 rounded-xl border border-space-700/60 shadow-2xl text-xs font-semibold">
          <div className="text-slate-400 uppercase tracking-widest text-[9px] mb-1.5 font-bold">
            {data.isLive ? 'Current Real-Time State' : 'Benchmark State'}
          </div>
          <div className="font-bold text-slate-100 mb-2 border-b border-space-700/30 pb-1 text-sm">
            {data.name}
          </div>
          <div className="space-y-1">
            {payload.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4">
                <span className="text-slate-400 font-medium">{item.name}:</span>
                <span className="font-mono font-bold" style={{ color: item.color }}>
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-space-700/40 w-full relative z-20 group">
      
      {/* Header */}
      <div className="mb-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          Neural State Analysis
        </span>
        <h3 className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-400" />
          <span>Metric Benchmark Comparison</span>
        </h3>
      </div>

      {/* Recharts Bar Chart */}
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.02)" />
            <XAxis 
              dataKey="name" 
              tickLine={false} 
              axisLine={false}
              tick={({ payload, x, y, index }) => {
                const item = chartData[index];
                const isLive = item?.isLive;
                return (
                  <text
                    x={x}
                    y={y + 12}
                    fill={isLive ? '#818cf8' : '#64748b'}
                    fontSize={10}
                    fontWeight={isLive ? 800 : 500}
                    textAnchor="middle"
                    className={isLive ? 'animate-pulse' : ''}
                  >
                    {payload.value}
                  </text>
                );
              }}
            />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              iconSize={8}
              iconType="circle"
              wrapperStyle={{ fontSize: 10, paddingTop: 10 }}
            />
            <Bar dataKey="focus" name="Focus" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={12} />
            <Bar dataKey="stress" name="Stress" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={12} />
            <Bar dataKey="activity" name="Activity" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={12} />
            <Bar dataKey="engagement" name="Engagement" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
