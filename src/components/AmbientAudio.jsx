import React, { useState, useEffect } from 'react';
import { Headphones, Volume2, Music } from 'lucide-react';
import { startAmbientSound, stopAmbientSound, updateAmbientFrequency } from '../lib/utils';

export default function AmbientAudio({ focusVal }) {
  const [activeSound, setActiveSound] = useState(null); // null, 'pink_noise', 'binaural'

  // Update soundscape frequency when focusVal changes
  useEffect(() => {
    if (activeSound) {
      updateAmbientFrequency(focusVal);
    }
  }, [focusVal, activeSound]);

  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  const handleToggleSound = (type) => {
    if (activeSound === type) {
      stopAmbientSound();
      setActiveSound(null);
    } else {
      startAmbientSound(type, focusVal);
      setActiveSound(type);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-indigo-500/15 relative overflow-hidden group">
      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500 rounded-full blur-2xl opacity-5 group-hover:opacity-10 transition-opacity" />
      
      <div className="flex items-center gap-2 border-b border-space-700/30 pb-3 mb-4">
        <Headphones className="h-4.5 w-4.5 text-indigo-400" />
        <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-300">Ambient Soundscapes</h4>
      </div>

      <div className="space-y-3.5">
        <p className="text-[10.5px] text-slate-400 font-medium leading-relaxed">
          Natively synthesized soundscapes adjust filters and binaural pitch offsets in real-time according to your focus level.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleToggleSound('pink_noise')}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeSound === 'pink_noise'
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-neon-success/15'
                : 'bg-slate-900/40 border-space-700/40 text-slate-400 hover:text-slate-200 hover:border-space-600'
            }`}
          >
            <Music className="h-4.5 w-4.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Pink Noise</span>
          </button>

          <button
            onClick={() => handleToggleSound('binaural')}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeSound === 'binaural'
                ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400 shadow-neon-indigo/15'
                : 'bg-slate-900/40 border-space-700/40 text-slate-400 hover:text-slate-200 hover:border-space-600'
            }`}
          >
            <Headphones className="h-4.5 w-4.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Binaural Beats</span>
          </button>
        </div>

        {activeSound && (
          <div className="flex items-center justify-between bg-slate-900/50 border border-space-700/30 rounded-xl px-3 py-1.5 animate-pulse">
            <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-indigo-400 animate-bounce" />
              <span>Synthesizer Active</span>
            </span>
            <button
              onClick={() => {
                stopAmbientSound();
                setActiveSound(null);
              }}
              className="text-[9.5px] font-bold text-rose-400 hover:text-rose-350 cursor-pointer"
            >
              Mute
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
