import React, { useEffect } from 'react';
import { AlertTriangle, X, Sparkles } from 'lucide-react';
import { formatTimeFull } from '../lib/utils';

export default function AlertBanner({ anomaly, onDismiss }) {
  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!anomaly) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 8000);
    return () => clearTimeout(timer);
  }, [anomaly, onDismiss]);

  if (!anomaly) return null;

  const isCritical = anomaly.severity === 'critical';
  const isOptimal = anomaly.severity === 'optimal';

  let bgStyles = 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-neon-cyan/10';
  let iconStyles = 'text-amber-400 bg-amber-500/10 border border-amber-500/30';
  let bannerHeader = 'Warning Telemetry Event';
  let borderPulse = 'animate-pulse';

  if (isCritical) {
    bgStyles = 'bg-rose-500/15 border-rose-500/40 text-rose-200 shadow-neon-danger/20';
    iconStyles = 'text-rose-400 bg-rose-500/20 border border-rose-500/40';
    bannerHeader = 'CRITICAL OVERLOAD SIGNAL';
    borderPulse = 'animate-glow-pulse border-rose-500/50';
  } else if (isOptimal) {
    bgStyles = 'bg-emerald-500/10 border-emerald-500/45 text-emerald-200 shadow-neon-success/20';
    iconStyles = 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30';
    bannerHeader = 'OPTIMAL PHASE DETECTED';
    borderPulse = 'animate-pulse border-emerald-500/50';
  }

  return (
    <div className={`mt-4 border rounded-2xl p-4 glass-panel flex items-start gap-4 transition-all duration-300 relative overflow-hidden z-30 animate-slide-down ${bgStyles} ${borderPulse}`}>
      {/* Glow highlight */}
      <div className={`absolute top-0 left-0 w-1.5 h-full ${
        isCritical ? 'bg-rose-500' : isOptimal ? 'bg-emerald-500' : 'bg-amber-500'
      }`} />

      {/* Icon */}
      <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${iconStyles}`}>
        {isOptimal ? (
          <Sparkles className="h-5 w-5 animate-spin-slow" />
        ) : (
          <AlertTriangle className={`h-5 w-5 ${isCritical ? 'animate-bounce' : ''}`} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded ${
            isCritical 
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
              : isOptimal 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            {bannerHeader}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {formatTimeFull(anomaly.timestamp)}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-200">
          {anomaly.message}
        </p>
        <span className="text-xs text-slate-400 mt-1 block">
          Telemetry signature auto-updated in system log below.
        </span>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={onDismiss}
        className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors self-start shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
