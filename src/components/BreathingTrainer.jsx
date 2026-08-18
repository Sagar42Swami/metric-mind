import React, { useState, useEffect } from 'react';
import { Play, Pause, X, Wind, Award } from 'lucide-react';

export default function BreathingTrainer({ onCoherenceCycle, onClose }) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('READY'); // 'READY', 'INHALE', 'HOLD', 'EXHALE'
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Transition phase
          setPhase((currentPhase) => {
            if (currentPhase === 'READY' || currentPhase === 'EXHALE') {
              return 'INHALE';
            } else if (currentPhase === 'INHALE') {
              return 'HOLD';
            } else if (currentPhase === 'HOLD') {
              setCycles(c => {
                const newCycles = c + 1;
                // Feed metric shift back to parent!
                onCoherenceCycle(3, -5); // +3 Focus, -5 Stress
                return newCycles;
              });
              return 'EXHALE';
            }
            return 'INHALE';
          });
          return 4; // Reset to 4 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onCoherenceCycle]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('INHALE');
    setTimeLeft(4);
  };

  const handleStop = () => {
    setIsActive(false);
    setPhase('READY');
    setTimeLeft(4);
  };

  let bubbleClass = "scale-[1.0] bg-slate-900 border-space-700/60 shadow-neon-indigo/20";
  let promptText = "Ready to Sync";
  let subtitleText = "Box breathing calibrates cognitive resonance";

  if (phase === 'INHALE') {
    bubbleClass = "scale-[1.25] bg-emerald-500/10 border-emerald-500/40 shadow-neon-success";
    promptText = "Inhale slowly...";
    subtitleText = "Fill your lungs with oxygen";
  } else if (phase === 'HOLD') {
    bubbleClass = "scale-[1.25] bg-indigo-500/10 border-indigo-500/40 shadow-neon-indigo";
    promptText = "Hold breath...";
    subtitleText = "Synchronize brainwave coherence";
  } else if (phase === 'EXHALE') {
    bubbleClass = "scale-[0.85] bg-rose-500/10 border-rose-500/40 shadow-neon-danger";
    promptText = "Exhale slowly...";
    subtitleText = "Release carbon dioxide and stress";
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-slate-950/80 mt-4 space-y-4 animate-slide-down relative z-30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-space-700/40 pb-2.5">
        <h4 className="text-sm font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2">
          <Wind className="h-4 w-4 text-emerald-400" />
          <span>Flow Coherence Breathing Trainer</span>
        </h4>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-4">
        {/* Breathing Circle bubble */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          {/* Animated decorative outer rings */}
          {isActive && (
            <div className={`absolute inset-0 rounded-full border border-dashed animate-spin-slow ${
              phase === 'INHALE' ? 'border-emerald-500/20' :
              phase === 'HOLD' ? 'border-indigo-500/20' : 'border-rose-500/20'
            }`} />
          )}

          {/* Central Bubble */}
          <div className={`w-32 h-32 rounded-full border-2 flex flex-col items-center justify-center text-center transition-all duration-[4000ms] ease-in-out shadow-2xl relative z-10 ${bubbleClass}`}>
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-300">
              {isActive ? promptText : 'Flow Training'}
            </span>
            {isActive && (
              <span className="text-2xl font-black font-mono text-white mt-1">
                {timeLeft}s
              </span>
            )}
          </div>
        </div>

        {/* Controls and Stats */}
        <div className="space-y-4 max-w-sm text-center md:text-left">
          <div>
            <h5 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Breathing Prompt</h5>
            <p className="text-sm text-slate-200 mt-1 min-h-[40px] font-medium leading-relaxed">
              {isActive ? subtitleText : 'Follow the geometric bubble to calibrate focus and reduce neural stress indicators.'}
            </p>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            {!isActive ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-[#02040a] font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Play className="h-4.5 w-4.5 fill-[#02040a]" />
                <span>Start Training</span>
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="flex items-center gap-2 px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Pause className="h-4.5 w-4.5 fill-white" />
                <span>Stop Session</span>
              </button>
            )}

            {/* Cycles counter */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-space-700/40 rounded-xl">
              <Award className="h-4 w-4 text-amber-400" />
              <span className="text-xs text-slate-300 font-mono font-bold">
                Cycles: {cycles}
              </span>
            </div>
          </div>
          
          <p className="text-[10px] text-slate-500 font-medium">
            Completing the Hold phase injects a direct <span className="text-emerald-400">+3 Focus boost</span> and <span className="text-rose-400">-5 Stress reduction</span> into the live telemetry loop.
          </p>
        </div>
      </div>
    </div>
  );
}
