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
import BreathingTrainer from './BreathingTrainer';

import { Brain, Flame, Activity, Target, Volume2, VolumeX, Download, X, Info, SlidersHorizontal } from 'lucide-react';
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
    thresholds,
    setThresholds,
    soundEnabled,
    setSoundEnabled,
    pause,
    resume,
    setSpeed,
    triggerAnomaly,
    dismissAnomaly,
    reset,
    setProfile,
    injectMetricShift
  } = useLiveMetrics();

  // Selected filters
  const [timeframe, setTimeframe] = useState(1); // 1, 5, or 15 mins
  const [activeMetric, setActiveMetric] = useState('focus'); // focus, stress, activity, engagement
  const [isLoading, setIsLoading] = useState(true);

  // UI Panels states
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showBreathingPanel, setShowBreathingPanel] = useState(false);

  const handleExportSessionLogs = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `mind_metric_session_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error("Failed to export telemetry session logs", err);
    }
  };

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
    metrics: { focus: 0, stress: 0, activity: 0, engagement: 0 },
    deltas: { focus: 0, stress: 0, activity: 0, engagement: 0 }
  };
  const currentMetrics = latestPoint.metrics;
  const currentDeltas = latestPoint.deltas || { focus: 0, stress: 0, activity: 0, engagement: 0 };

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
        showSettings={showSettingsPanel}
        onToggleSettings={() => setShowSettingsPanel(!showSettingsPanel)}
        showSummary={showSummaryModal}
        onToggleSummary={() => setShowSummaryModal(!showSummaryModal)}
        showBreathing={showBreathingPanel}
        onToggleBreathing={() => setShowBreathingPanel(!showBreathingPanel)}
      />

      {/* 2. Alert banner if anomaly occurs */}
      <AlertBanner
        anomaly={latestAnomaly}
        onDismiss={dismissAnomaly}
      />

      {/* Breathing Trainer Panel */}
      {showBreathingPanel && (
        <BreathingTrainer
          onCoherenceCycle={injectMetricShift}
          onClose={() => setShowBreathingPanel(false)}
        />
      )}

      {/* 3. Filter control bar */}
      <FilterBar
        timeframe={timeframe}
        onSetTimeframe={setTimeframe}
        activeMetric={activeMetric}
        onSetActiveMetric={setActiveMetric}
      />

      {/* Settings Control Panel */}
      {showSettingsPanel && (
        <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-slate-950/80 mt-4 space-y-4 animate-slide-down relative z-30">
          <div className="flex items-center justify-between border-b border-space-700/40 pb-2.5">
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
              <span>Telemetry Alert Safety Thresholds</span>
            </h4>
            <button 
              onClick={() => setShowSettingsPanel(false)}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Stress Threshold Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>Max Stress Limit</span>
                <span className="text-rose-400 font-mono">{thresholds.stressMax}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="95" 
                value={thresholds.stressMax} 
                onChange={(e) => setThresholds(prev => ({ ...prev, stressMax: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <p className="text-[10px] text-slate-500 italic">Triggers critical alarm warning when stress exceeds this value.</p>
            </div>

            {/* Focus Min Threshold Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>Min Focus Limit</span>
                <span className="text-amber-400 font-mono">{thresholds.focusMin}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="50" 
                value={thresholds.focusMin} 
                onChange={(e) => setThresholds(prev => ({ ...prev, focusMin: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <p className="text-[10px] text-slate-500 italic">Triggers cognitive fatigue warning when focus sinks below this value.</p>
            </div>

            {/* Focus Optimal Threshold Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>Optimal Flow Limit</span>
                <span className="text-emerald-400 font-mono">{thresholds.focusOptimal}%</span>
              </div>
              <input 
                type="range" 
                min="75" 
                max="98" 
                value={thresholds.focusOptimal} 
                onChange={(e) => setThresholds(prev => ({ ...prev, focusOptimal: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <p className="text-[10px] text-slate-500 italic">Triggers peak coherence state alert when focus exceeds this value.</p>
            </div>

            {/* Simulation Profile Presets */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>Simulation Profile</span>
                <span className="text-indigo-400 font-mono">ACTIVE</span>
              </div>
              <select
                onChange={(e) => setProfile(e.target.value)}
                className="w-full bg-slate-900 border border-space-700/50 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-300 outline-none cursor-pointer focus:border-indigo-500/50"
              >
                <option value="DEFAULT" className="bg-[#0f172a] text-slate-300 font-bold">Balanced Default</option>
                <option value="DEEP_FOCUS" className="bg-[#0f172a] text-emerald-400 font-bold">Deep Focus Mode</option>
                <option value="HIGH_STRESS" className="bg-[#0f172a] text-rose-400 font-bold">High Stress Overload</option>
                <option value="RECOVERY" className="bg-[#0f172a] text-cyan-400 font-bold">Calm Recovery State</option>
              </select>
              <p className="text-[10px] text-slate-500 italic">Sets the core baseline data simulator profiles dynamically.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-space-700/40 pt-4 mt-2">
            {/* Audio Alert switch */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                  soundEnabled 
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/35 shadow-neon-indigo/10' 
                    : 'bg-slate-900/50 text-slate-400 border-space-700/40 hover:text-slate-300'
                }`}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <span>{soundEnabled ? 'Synthesized Telemetry Sound Enabled' : 'Sound Muted'}</span>
              </button>
              <span className="text-[10px] text-slate-500 font-medium">Audio context plays beeps dynamically on boundary alerts.</span>
            </div>

            {/* Export Session Logs button */}
            <button
              onClick={handleExportSessionLogs}
              className="flex items-center justify-center gap-2 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-space-700/60 hover:border-space-600 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Export Session Logs (.JSON)</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. KPI Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <KPICard
            key={kpi.key}
            metricKey={kpi.key}
            title={kpi.title}
            icon={kpi.icon}
            value={kpi.value}
            delta={currentDeltas[kpi.key]}
            avg={liveAverages[kpi.key]}
            trend={liveTrends[kpi.key]}
            data={filteredData}
            isActive={activeMetric === kpi.key}
            onClick={() => setActiveMetric(kpi.key)}
            thresholds={thresholds}
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

      {/* Session Analytics Modal Overlay */}
      {showSummaryModal && (
        <div className="fixed inset-0 bg-[#02040a]/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in animate-delay-100">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-cyan-500/30 bg-[#090e1a]/95 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-space-700/45 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                  <Activity className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Session telemetry summary</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Telemetry Active Runtime Report</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSummaryModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Runtime / Core Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-space-700/30">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Elapsed Time</div>
                <div className="text-lg font-bold text-slate-200 font-mono mt-1">
                  {Math.round((history.length * tickRate) / 1000)}s
                </div>
                <span className="text-[8.5px] text-slate-500">{history.length} active stream ticks</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-space-700/30">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Averages</div>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
                  {liveAverages.focus}%
                </div>
                <span className="text-[8.5px] text-slate-500">Mean Focus Score</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-space-700/30">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Peak Stress</div>
                <div className="text-lg font-bold text-rose-400 font-mono mt-1">
                  {history.length > 0 ? Math.max(...history.map(pt => pt.metrics?.stress || 0)) : 0}%
                </div>
                <span className="text-[8.5px] text-slate-500">Highest stress recorded</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-space-700/30">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Anomalies Logged</div>
                <div className="text-lg font-bold text-amber-400 font-mono mt-1">
                  {anomalyEvents.length}
                </div>
                <span className="text-[8.5px] text-slate-500">Safety threshold violations</span>
              </div>
            </div>

            {/* Detailed Metric Averages / Limits Table */}
            <div className="overflow-hidden rounded-xl border border-space-700/35">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-[10px] text-slate-500 uppercase font-extrabold tracking-wider border-b border-space-700/35">
                  <tr>
                    <th className="px-4 py-2.5">Metric Stream</th>
                    <th className="px-4 py-2.5 text-center">Avg</th>
                    <th className="px-4 py-2.5 text-center">Min / Max</th>
                    <th className="px-4 py-2.5 text-right">Trigger Boundary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-space-700/20 font-medium">
                  {/* Focus Row */}
                  <tr>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-semibold text-slate-200">Focus Score</span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono">{liveAverages.focus}%</td>
                    <td className="px-4 py-3 text-center font-mono text-slate-400">
                      {history.length > 0 ? Math.min(...history.map(pt => pt.metrics?.focus || 0)) : 0}% / {history.length > 0 ? Math.max(...history.map(pt => pt.metrics?.focus || 0)) : 0}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-500">
                      &lt;{thresholds.focusMin}% or &gt;={thresholds.focusOptimal}%
                    </td>
                  </tr>
                  {/* Stress Row */}
                  <tr>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      <span className="font-semibold text-slate-200">Stress Level</span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono">{liveAverages.stress}%</td>
                    <td className="px-4 py-3 text-center font-mono text-slate-400">
                      {history.length > 0 ? Math.min(...history.map(pt => pt.metrics?.stress || 0)) : 0}% / {history.length > 0 ? Math.max(...history.map(pt => pt.metrics?.stress || 0)) : 0}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-500">
                      &gt;={thresholds.stressMax}%
                    </td>
                  </tr>
                  {/* Activity Row */}
                  <tr>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="font-semibold text-slate-200">Activity Index</span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono">{liveAverages.activity}%</td>
                    <td className="px-4 py-3 text-center font-mono text-slate-400">
                      {history.length > 0 ? Math.min(...history.map(pt => pt.metrics?.activity || 0)) : 0}% / {history.length > 0 ? Math.max(...history.map(pt => pt.metrics?.activity || 0)) : 0}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-500">—</td>
                  </tr>
                  {/* Engagement Row */}
                  <tr>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      <span className="font-semibold text-slate-200">Engagement Rate</span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono">{liveAverages.engagement}%</td>
                    <td className="px-4 py-3 text-center font-mono text-slate-400">
                      {history.length > 0 ? Math.min(...history.map(pt => pt.metrics?.engagement || 0)) : 0}% / {history.length > 0 ? Math.max(...history.map(pt => pt.metrics?.engagement || 0)) : 0}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-500">—</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Cognitive Efficiency Assessment */}
            <div className="bg-slate-900/30 p-4 rounded-xl border border-space-700/20 text-xs leading-relaxed space-y-2">
              <h5 className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Info className="h-4.5 w-4.5 text-cyan-400" />
                <span>Executive Session Diagnostics</span>
              </h5>
              <p className="text-slate-400">
                This session report compiles cognitive data in real time. Safety limits are monitored client-side via active event handlers. 
                {liveAverages.focus >= 70 ? (
                  <span className="text-emerald-400"> The session diagnostic shows optimal coherence. High focus ratios suggest stable cognitive performance.</span>
                ) : liveAverages.stress >= 60 ? (
                  <span className="text-rose-400"> Warning: The diagnostic highlights elevated cognitive friction. Deep focus levels are compressed by increased stress telemetry.</span>
                ) : (
                  <span className="text-slate-300"> The session diagnostic is stable. Attention scores are hovering around standard baseline values.</span>
                )}
              </p>
            </div>

            {/* Close button */}
            <div className="flex justify-end pt-2 border-t border-space-700/20">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-[#02040a] font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
