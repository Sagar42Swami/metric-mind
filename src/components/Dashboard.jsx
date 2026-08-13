import React, { useState, useEffect } from 'react';
import { useLiveMetrics } from '../hooks/useLiveMetrics';
import Header from './Header';
import AlertBanner from './AlertBanner';
import FilterBar from './FilterBar';
import KPICard from './KPICard';
import LiveGauge from './LiveGauge';
import StreamChart from './StreamChart';
import CategoryBarChart from './CategoryBarChart';
import DistributionPieChart from './DistributionPieChart';
import EventLog from './EventLog';

import { Brain, Flame, Activity, Target } from 'lucide-react';
import { calcAverage, calcTrend } from '../lib/utils';

export default function Dashboard() {
  // Hook for live metrics
  const {
    history,
    getFilteredHistory,
    isPaused,
    tickRate,
    anomalyEvents,
    latestAnomaly,
    pause,
    resume,
    setSpeed,
    triggerAnomaly,
    dismissAnomaly,
    reset
  } = useLiveMetrics();

  // Selected filters
  const [timeframe, setTimeframe] = useState(1); // 1, 5, or 15 mins
  const [activeMetric, setActiveMetric] = useState('focus'); // focus, stress, activity, engagement
  const [isLoading, setIsLoading] = useState(true);

  // Buffer simulated neural link loading sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filter historical rolling buffer
  const filteredData = getFilteredHistory(timeframe);

  // Compute live averages of current window
  const liveAverages = {
    focus: calcAverage(filteredData, 'focus'),
    stress: calcAverage(filteredData, 'stress'),
    activity: calcAverage(filteredData, 'activity'),
    engagement: calcAverage(filteredData, 'engagement')
  };

  // Compute trends
  const liveTrends = {
    focus: calcTrend(filteredData, 'focus'),
    stress: calcTrend(filteredData, 'stress'),
    activity: calcTrend(filteredData, 'activity'),
    engagement: calcTrend(filteredData, 'engagement')
  };

  // Current values (latest point)
  const latestPoint = history[history.length - 1] || {
    metrics: { focus: 0, stress: 0, activity: 0, engagement: 0 }
  };
  const currentMetrics = latestPoint.metrics;

  // Render Skeleton HUD loader
  if (isLoading) {
    return (
      <div className="min-h-screen grid-bg radial-glow flex flex-col justify-center items-center gap-5 p-6 select-none animate-fade-in bg-[#060913]">
        <div className="relative flex flex-col items-center">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full blur opacity-40 animate-pulse-slow"></div>
          <div className="relative bg-slate-950 p-4.5 rounded-full border border-space-700/50 shadow-neon-indigo animate-spin-slow">
            <Brain className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
        <div className="text-center space-y-2 max-w-sm">
          <h2 className="text-lg font-black tracking-widest bg-gradient-to-r from-indigo-200 to-cyan-200 bg-clip-text text-transparent uppercase">
            Syncing Neural Link
          </h2>
          <div className="h-1 w-44 bg-slate-900 rounded-full overflow-hidden mx-auto border border-space-800/30">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full animate-[loadingProgress_1.5s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
          </div>
          <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
            calibrating client-side telemetry stream...
          </p>
        </div>
        
        {/* Style injection for loadingProgress animation */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes loadingProgress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(250%); }
          }
          .animate-spin-slow {
            animation: spin 3s linear infinite;
          }
        `}} />
      </div>
    );
  }

  // Define KPI Cards props helper
  const kpis = [
    { key: 'focus', title: 'Focus Score', icon: Brain, value: currentMetrics.focus },
    { key: 'stress', title: 'Stress Level', icon: Flame, value: currentMetrics.stress },
    { key: 'activity', title: 'Activity Index', icon: Activity, value: currentMetrics.activity },
    { key: 'engagement', title: 'Engagement Rate', icon: Target, value: currentMetrics.engagement }
  ];

  return (
    <div className="grid-bg radial-glow min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto animate-fade-in bg-[#060913]">
      
      {/* 1. Header component */}
      <Header
        isPaused={isPaused}
        tickRate={tickRate}
        onPause={pause}
        onResume={resume}
        onSetSpeed={setSpeed}
        onTriggerAnomaly={triggerAnomaly}
        onReset={reset}
      />

      {/* 2. Alert banner if anomaly occurs */}
      <AlertBanner
        anomaly={latestAnomaly}
        onDismiss={dismissAnomaly}
      />

      {/* 3. Filter control bar */}
      <FilterBar
        timeframe={timeframe}
        onSetTimeframe={setTimeframe}
        activeMetric={activeMetric}
        onSetActiveMetric={setActiveMetric}
      />

      {/* 4. KPI Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <KPICard
            key={kpi.key}
            metricKey={kpi.key}
            title={kpi.title}
            icon={kpi.icon}
            value={kpi.value}
            avg={liveAverages[kpi.key]}
            trend={liveTrends[kpi.key]}
            data={filteredData}
            isActive={activeMetric === kpi.key}
            onClick={() => setActiveMetric(kpi.key)}
          />
        ))}
      </div>

      {/* 5. Main visual charts (Stream chart + Live gauge) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 flex">
          <StreamChart
            data={filteredData}
            activeMetric={activeMetric}
            title={kpis.find(k => k.key === activeMetric)?.title || 'Telemetry Data'}
          />
        </div>
        <div className="flex">
          <LiveGauge
            value={currentMetrics[activeMetric]}
            title={kpis.find(k => k.key === activeMetric)?.title || 'Telemetry Data'}
            metricKey={activeMetric}
            avg={liveAverages[activeMetric]}
          />
        </div>
      </div>

      {/* 6. Lower statistics charts (Bar chart + Donut chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="flex">
          <CategoryBarChart liveAverages={liveAverages} />
        </div>
        <div className="flex">
          <DistributionPieChart data={filteredData} />
        </div>
      </div>

      {/* 7. Scrollable Event log */}
      <EventLog events={anomalyEvents} />

      {/* System Footer Info */}
      <footer className="text-center text-[10px] text-slate-600 font-mono tracking-widest py-4 border-t border-space-700/20 uppercase">
        Mind Metric v1.0.0 // Fully Client-Side Telemetry Simulator // Sandbox Validated
      </footer>

    </div>
  );
}
