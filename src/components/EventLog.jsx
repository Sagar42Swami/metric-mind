import React from 'react';
import { Bell, ShieldAlert, Sparkles, Terminal } from 'lucide-react';
import { formatTimeFull, getSeverityClass } from '../lib/utils';

export default function EventLog({ events }) {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-space-700/40 w-full relative z-20 flex flex-col h-[320px] group">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-space-700/35 pb-3">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            System Telemetry
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
            <Terminal className="h-4.5 w-4.5 text-indigo-400" />
            <span>Event / Anomaly Registry</span>
          </h3>
        </div>
        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-900 border border-space-700 text-slate-500 font-mono">
          Logs: {events.length}
        </span>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2.5 scrollbar-thin">
        {events.map((event, idx) => {
          const isCritical = event.severity === 'critical';
          const isOptimal = event.severity === 'optimal';
          
          let severityLabel = 'WARNING';
          let severityIcon = <Bell className="h-3.5 w-3.5" />;
          
          if (isCritical) {
            severityLabel = 'CRITICAL';
            severityIcon = <ShieldAlert className="h-3.5 w-3.5" />;
          } else if (isOptimal) {
            severityLabel = 'OPTIMAL';
            severityIcon = <Sparkles className="h-3.5 w-3.5" />;
          }

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors duration-150 hover:bg-slate-900/35 ${getSeverityClass(
                event.severity
              )}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {severityIcon}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-extrabold uppercase tracking-wider">
                      {severityLabel}
                    </span>
                    <span className="text-[9.5px] font-mono text-slate-400 opacity-80">
                      {formatTimeFull(event.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
                    {event.message}
                  </p>
                </div>
              </div>

              {/* Tag / Metric Signature */}
              <div className="md:text-right shrink-0">
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-slate-950/40 border border-space-700/20 text-slate-400 font-mono">
                  {event.type}
                </span>
              </div>
            </div>
          );
        })}

        {events.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-500">
            <Bell className="h-8 w-8 stroke-1 text-slate-600 mb-2 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-wider">No Anomalies Logged</p>
            <p className="text-[10px] text-slate-600 mt-1 max-w-[200px]">
              System operating within baseline parameters. Use "Inject Anomaly" above to test.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
