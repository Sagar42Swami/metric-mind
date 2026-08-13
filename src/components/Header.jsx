import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Zap, ChevronDown, Activity } from 'lucide-react';

export default function Header({ 
  isPaused, 
  tickRate, 
  onPause, 
  onResume, 
  onSetSpeed, 
  onTriggerAnomaly, 
  onReset 
}) {
  const [showAnomalyMenu, setShowAnomalyMenu] = useState(false);

  const speeds = [
    { label: 'Fast (1.0s)', value: 1000 },
    { label: 'Normal (1.5s)', value: 1500 },
    { label: 'Slow (3.0s)', value: 3000 }
  ];

  const anomalies = [
    { label: 'Neuro Overload (Stress Spike)', value: 'STRESS_SPIKE', color: 'text-rose-400' },
    { label: 'Attention Crash (Focus Dip)', value: 'FOCUS_DROP', color: 'text-amber-400' },
    { label: 'Optimal Flow State', value: 'FLOW_STATE', color: 'text-emerald-400' }
  ];

  return (
    <header className="glass-panel px-6 py-4 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-space-700/40 relative z-40">
      
      {/* Title / Branding */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/30 shadow-neon-indigo animate-pulse-slow">
          <Activity className="h-6 w-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-white via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
            MIND METRIC
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`relative flex h-2 w-2`}>
              {!isPaused && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isPaused ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              {isPaused ? 'Telemetry Paused' : 'Live Streaming'}
            </span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Pause / Resume */}
        <button
          onClick={isPaused ? onResume : onPause}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
            isPaused 
              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/50 shadow-sm shadow-emerald-500/10'
              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30 hover:border-amber-500/50 shadow-sm shadow-amber-500/10'
          }`}
        >
          {isPaused ? (
            <>
              <Play className="h-4 w-4" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="h-4 w-4" />
              <span>Pause</span>
            </>
          )}
        </button>

        {/* Speed / Interval Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900/50 border border-space-700/50 rounded-xl px-2.5 py-1.5">
          <span className="text-xs font-semibold text-slate-500 pl-1 uppercase">Rate:</span>
          <select
            value={tickRate}
            onChange={(e) => onSetSpeed(Number(e.target.value))}
            className="bg-transparent text-sm font-semibold text-slate-200 border-none outline-none cursor-pointer focus:ring-0"
          >
            {speeds.map(speed => (
              <option key={speed.value} value={speed.value} className="bg-[#0f172a] text-slate-200">
                {speed.label}
              </option>
            ))}
          </select>
        </div>

        {/* Anomaly Injector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAnomalyMenu(!showAnomalyMenu)}
            onBlur={() => setTimeout(() => setShowAnomalyMenu(false), 200)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:border-indigo-500/50 rounded-xl text-sm font-semibold transition-all duration-200"
          >
            <Zap className="h-4 w-4 fill-indigo-400/20" />
            <span>Inject Telemetry Anomaly</span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showAnomalyMenu ? 'rotate-180' : ''}`} />
          </button>
          
          {showAnomalyMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-950/95 border border-indigo-500/30 shadow-2xl backdrop-blur-lg p-1.5 z-50 animate-slide-down">
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 px-3 py-1.5 border-b border-space-700/40">
                Select Anomaly Signature
              </div>
              {anomalies.map((anomaly) => (
                <button
                  key={anomaly.value}
                  onClick={() => {
                    onTriggerAnomaly(anomaly.value);
                    setShowAnomalyMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-900 transition-colors ${anomaly.color} flex items-center justify-between`}
                >
                  <span>{anomaly.label}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">TRIGGER</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reset */}
        <button
          onClick={onReset}
          title="Reset Dashboard State"
          className="p-2.5 bg-slate-800/40 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-space-700/30 hover:border-space-600 rounded-xl transition-all duration-200"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

      </div>
    </header>
  );
}
