import React from 'react';
import { Target, Flame, CheckCircle2, Award } from 'lucide-react';

export default function DailyGoals({ dailyGoal }) {
  const { flowMinutes, targetMinutes, streak } = dailyGoal;
  const pct = Math.min(100, Math.round((flowMinutes / targetMinutes) * 100));
  const isGoalReached = flowMinutes >= targetMinutes;

  let motivationMsg = "Maintain Focus optimal levels to fill your daily coherence tank.";
  if (pct >= 80) {
    motivationMsg = "So close! Just a bit more deep work to finish today's goal.";
  } else if (pct >= 50) {
    motivationMsg = "Halfway there. Keep up the high focus cycles!";
  } else if (pct >= 25) {
    motivationMsg = "Good start! You are establishing a cognitive state baseline.";
  }
  if (isGoalReached) {
    motivationMsg = "Goal reached! Excellent job maintaining cognitive coherence.";
  }

  return (
    <div className="glass-panel p-5 rounded-2xl border border-indigo-500/15 relative overflow-hidden group">
      <div className="flex items-center justify-between border-b border-space-700/30 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-4.5 w-4.5 text-indigo-400" />
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-300">Daily Coherence Goal</h4>
        </div>
        {isGoalReached && <Award className="h-4.5 w-4.5 text-amber-400 animate-bounce" />}
      </div>

      <div className="space-y-4">
        {/* Progress row */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Flow Time Goal</span>
            <p className="text-sm font-extrabold text-slate-200">
              {flowMinutes}m <span className="text-xs font-semibold text-slate-400">/ {targetMinutes}m target</span>
            </p>
          </div>
          
          <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-space-700/40 rounded-xl">
            <Flame className={`h-4 w-4 ${streak > 0 ? 'text-amber-500 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-xs text-slate-300 font-mono font-bold">{streak}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-space-800">
            <div 
              style={{ width: `${pct}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                isGoalReached 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-neon-success' 
                  : 'bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-neon-indigo'
              }`}
            />
          </div>
          <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wide">
            <span>{pct}% Completed</span>
            {isGoalReached ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Target Complete
              </span>
            ) : (
              <span>{Math.round((targetMinutes - flowMinutes) * 10) / 10}m remaining</span>
            )}
          </div>
        </div>

        <p className="text-[10px] text-slate-400 leading-relaxed font-medium bg-slate-900/30 p-2 rounded-xl border border-space-850/20 italic">
          "{motivationMsg}"
        </p>
      </div>
    </div>
  );
}
