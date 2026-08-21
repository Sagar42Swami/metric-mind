import React, { useState } from 'react';
import { MessageSquare, Plus, Clock } from 'lucide-react';

export default function Annotations({ annotations = [], onAddAnnotation }) {
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    onAddAnnotation(note.trim());
    setNote('');
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-indigo-500/15 relative overflow-hidden group">
      <div className="flex items-center gap-2 border-b border-space-700/30 pb-3 mb-4">
        <MessageSquare className="h-4.5 w-4.5 text-indigo-400" />
        <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-300">Timeline Annotations</h4>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Log active context note..."
          className="flex-1 bg-slate-900 border border-space-700/50 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-300 outline-none placeholder:text-slate-500 focus:border-indigo-500/50"
        />
        <button
          type="submit"
          className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
        </button>
      </form>

      <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
        {annotations.length === 0 ? (
          <p className="text-[10px] text-slate-500 italic text-center py-4">No notes logged yet. Type above to add a context point to the timeline.</p>
        ) : (
          [...annotations].reverse().slice(0, 5).map((ann, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-slate-900/30 border border-space-800/60 p-2 rounded-xl text-[10px] text-slate-300">
              <Clock className="h-3 w-3 text-slate-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-slate-400 font-mono">
                  {new Date(ann.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
                <p className="mt-0.5 leading-relaxed font-medium">{ann.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
