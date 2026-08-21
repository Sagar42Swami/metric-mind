import React, { useState, useEffect } from 'react';
import { ShieldAlert, X, CheckCircle, RefreshCw } from 'lucide-react';

const STRETCHES = [
  { title: "Neck Release", instruction: "Slowly tilt your left ear toward your left shoulder. Hold for 5 seconds.", duration: 5 },
  { title: "Shoulder Rolls", instruction: "Roll your shoulders backward in a smooth circle.", duration: 5 },
  { title: "Eye Calibrator", instruction: "Look away from the screen at an object 20 feet away.", duration: 5 },
  { title: "Wrist Flexor", instruction: "Extend your right arm forward and gently pull your fingers back.", duration: 5 }
];

export default function BreaksPanel({ onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(STRETCHES[0].duration);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (activeStep < STRETCHES.length - 1) {
            setActiveStep(s => s + 1);
            return STRETCHES[activeStep + 1].duration;
          } else {
            setCompleted(true);
            clearInterval(interval);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeStep, completed]);

  const handleRestart = () => {
    setActiveStep(0);
    setSecondsLeft(STRETCHES[0].duration);
    setCompleted(false);
  };

  const currentStretch = STRETCHES[activeStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02040a]/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-indigo-500/30 bg-slate-950/90 text-center space-y-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="flex flex-col items-center gap-2">
          <div className="p-3 bg-indigo-500/10 rounded-full border border-indigo-500/30 animate-pulse text-indigo-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h3 className="text-base font-black uppercase tracking-widest text-slate-100">Micro-Break Calibration</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Guided physical posture refresh</p>
        </div>

        {!completed ? (
          <div className="space-y-4 py-2">
            <div className="w-24 h-24 rounded-full border-4 border-dashed border-indigo-500/30 flex items-center justify-center mx-auto text-3xl font-black font-mono text-white animate-spin-slow">
              <span className="scale-100 shrink-0 select-none">{secondsLeft}s</span>
            </div>
            
            <div className="space-y-1.5 px-4">
              <h4 className="text-sm font-extrabold text-indigo-400 uppercase tracking-wide">
                {currentStretch.title} ({activeStep + 1}/{STRETCHES.length})
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium min-h-[40px]">
                {currentStretch.instruction}
              </p>
            </div>

            {/* Stepper Dots */}
            <div className="flex justify-center gap-1.5">
              {STRETCHES.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === activeStep ? 'bg-indigo-400 scale-110 shadow-neon-indigo/50' : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/30 w-16 h-16 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wide">Coherence Restored</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Physical tension successfully reset. You may now resume focus.
              </p>
            </div>
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-space-700/40 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Restart stretches</span>
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          Resume Session
        </button>
      </div>
    </div>
  );
}
