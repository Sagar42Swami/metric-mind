// Utility functions for Mind Metric Dashboard

// Calculate average of a metric in a rolling history
export const calcAverage = (data, metricKey) => {
  if (!data || data.length === 0) return 0;
  const sum = data.reduce((acc, point) => acc + (point.metrics?.[metricKey] || 0), 0);
  return Math.round(sum / data.length);
};

// Calculate min and max of a metric in a rolling history
export const calcMinMax = (data, metricKey) => {
  if (!data || data.length === 0) return { min: 0, max: 0 };
  const values = data.map(point => point.metrics?.[metricKey] ?? 0);
  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
};

// Calculate percentage change of the current value versus the rolling average of the rest of the history
export const calcTrend = (data, metricKey) => {
  if (!data || data.length < 2) return 0;
  const current = data[data.length - 1].metrics?.[metricKey] ?? 0;
  
  // Average of previous values
  const previousPoints = data.slice(0, data.length - 1);
  const prevAvg = previousPoints.reduce((acc, point) => acc + (point.metrics?.[metricKey] || 0), 0) / previousPoints.length;
  
  if (prevAvg === 0) return 0;
  const diff = current - prevAvg;
  return parseFloat(((diff / prevAvg) * 100).toFixed(1));
};

// Format timestamps for graph ticks: HH:MM:SS
export const formatTime = (ms) => {
  if (!ms) return '';
  const date = new Date(ms);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

// Format timestamps for event logs: HH:MM:SS.mmm
export const formatTimeFull = (ms) => {
  if (!ms) return '';
  const date = new Date(ms);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const msStr = date.getMilliseconds().toString().padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${msStr}`;
};

// Format trend label with positive/negative indicators
export const formatPercent = (val) => {
  if (val > 0) return `+${val}%`;
  if (val < 0) return `${val}%`;
  return '0%';
};

// Return CSS class names based on anomaly severity
export const getSeverityClass = (severity) => {
  switch (severity) {
    case 'critical':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/25';
    case 'warning':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/25';
    case 'optimal':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25';
    default:
      return 'bg-slate-500/10 text-slate-400 border border-slate-500/25';
  }
};

// Play synthesized telemetry sound using Web Audio API
export const playTelemetrySound = (severity) => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (severity === 'critical') {
      // High-pitch alarm alert sequence (two quick alarm beeps)
      const playBeep = (delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime + delay); // A5
        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.25);
      };
      playBeep(0);
      playBeep(0.12);
    } else if (severity === 'warning') {
      // Medium pitch warning beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } else if (severity === 'optimal') {
      // High-pitch chime ascending sequence
      const playTone = (freq, delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.2);
      };
      playTone(523.25, 0); // C5
      playTone(659.25, 0.08); // E5
    }
  } catch (err) {
    console.error("Audio Context initialization failed", err);
  }
};
