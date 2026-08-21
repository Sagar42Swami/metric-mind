import React, { useState } from 'react';
import { 
  AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { formatTime } from '../lib/utils';
import { LineChart, ToggleLeft, ToggleRight } from 'lucide-react';

export default function StreamChart({ data, activeMetric, annotations = [], calendarEvents = [] }) {
  const [showOverlay, setShowOverlay] = useState(false);

  // Setup color constants
  const metricConfigs = {
    focus: { stroke: '#10b981', fillId: 'gradFocus', name: 'Focus Score' },
    stress: { stroke: '#f43f5e', fillId: 'gradStress', name: 'Stress Level' },
    activity: { stroke: '#06b6d4', fillId: 'gradActivity', name: 'Activity Index' },
    engagement: { stroke: '#6366f1', fillId: 'gradEngagement', name: 'Engagement Rate' }
  };

  const activeConfig = metricConfigs[activeMetric] || metricConfigs.focus;

  // Custom tooltips
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="glass-panel p-3.5 rounded-xl border border-space-700/60 shadow-2xl text-xs font-semibold">
          <div className="text-slate-500 uppercase tracking-widest text-[9px] mb-1.5 font-bold">
            Timestamp: {new Date(point.timestamp).toLocaleTimeString()}
          </div>
          <div className="space-y-1.5">
            {payload.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || item.stroke }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-mono text-slate-100 font-extrabold text-right">
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

  // Map data for Recharts
  const chartData = data.map(pt => ({
    timestamp: pt.timestamp,
    formattedTime: formatTime(pt.timestamp),
    focus: pt.metrics?.focus ?? 0,
    stress: pt.metrics?.stress ?? 0,
    activity: pt.metrics?.activity ?? 0,
    engagement: pt.metrics?.engagement ?? 0,
  }));

  // Format annotation timestamps to match the categorical X-axis formatting
  const chartAnnotations = annotations.map(ann => ({
    ...ann,
    formattedTime: formatTime(ann.timestamp)
  }));

  const chartEvents = calendarEvents.map(evt => ({
    ...evt,
    formattedTime: formatTime(evt.timestamp)
  }));

  return (
    <div className="glass-panel p-6 rounded-2xl border border-space-700/40 w-full relative z-25 group">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Real-Time Stream Visualization
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
            <LineChart className="h-5 w-5 text-indigo-400" />
            <span>Active Feed: {activeConfig.name}</span>
          </h3>
        </div>

        {/* Overlay toggle */}
        <button
          onClick={() => setShowOverlay(!showOverlay)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
            showOverlay
              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/35 shadow-neon-indigo/10'
              : 'bg-slate-900/50 text-slate-400 border-space-700/40 hover:text-slate-300'
          }`}
        >
          {showOverlay ? <ToggleRight className="h-5.5 w-5.5" /> : <ToggleLeft className="h-5.5 w-5.5" />}
          <span>Overlay Secondary Metrics</span>
        </button>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-[320px] pr-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradFocus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="gradStress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="gradActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="gradEngagement" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.03)" />

            <XAxis
              dataKey="formattedTime"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500, fontFamily: 'JetBrains Mono' }}
              dy={10}
            />

            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500, fontFamily: 'JetBrains Mono' }}
              dx={-5}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Inactive secondary overlays as thin lines */}
            {showOverlay && activeMetric !== 'focus' && (
              <Line
                type="monotone"
                dataKey="focus"
                name="Focus Score"
                stroke="#10b981"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            )}
            {showOverlay && activeMetric !== 'stress' && (
              <Line
                type="monotone"
                dataKey="stress"
                name="Stress Level"
                stroke="#f43f5e"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            )}
            {showOverlay && activeMetric !== 'activity' && (
              <Line
                type="monotone"
                dataKey="activity"
                name="Activity Index"
                stroke="#06b6d4"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            )}
            {showOverlay && activeMetric !== 'engagement' && (
              <Line
                type="monotone"
                dataKey="engagement"
                name="Engagement Rate"
                stroke="#6366f1"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            )}

            {/* Render logged timeline annotations */}
            {chartAnnotations.map((ann, idx) => (
              <ReferenceLine
                key={`ann-${idx}`}
                x={ann.formattedTime}
                stroke="var(--color-hud-border)"
                strokeWidth={1}
                strokeDasharray="2 3"
                label={{ value: '📝', position: 'top', fill: '#a5b4fc', fontSize: 10 }}
              />
            ))}

            {/* Render mock calendar events */}
            {chartEvents.map((evt, idx) => (
              <ReferenceLine
                key={`evt-${idx}`}
                x={evt.formattedTime}
                stroke="var(--color-hud-border)"
                strokeWidth={1}
                strokeDasharray="1 3"
                label={{ value: `📅 ${evt.title}`, position: 'insideTopLeft', fill: '#94a3b8', fontSize: 8 }}
              />
            ))}

            {/* Active glowing area */}
            <Area
              type="monotone"
              dataKey={activeMetric}
              name={activeConfig.name}
              stroke={activeConfig.stroke}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#${activeConfig.fillId})`}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: activeConfig.stroke }}
              isAnimationActive={true}
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
