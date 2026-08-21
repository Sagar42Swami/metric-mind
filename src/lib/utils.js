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

// Ambient noise and binaural beat synthesizer state
let ambientCtx = null;
let noiseNode = null;
let binauralOscLeft = null;
let binauralOscRight = null;
let filterNode = null;

// Start playing focus binaural tones or brownian noise
export const startAmbientSound = (type, focusVal = 70) => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    stopAmbientSound();
    
    if (!ambientCtx || ambientCtx.state === 'closed') {
      ambientCtx = new AudioContextClass();
    }
    
    // Resume context if browser suspended it
    if (ambientCtx.state === 'suspended') {
      ambientCtx.resume();
    }

    if (type === 'pink_noise') {
      // Warm brownian/pink noise approximation buffer
      const bufferSize = 4 * ambientCtx.sampleRate;
      const buffer = ambientCtx.createBuffer(1, bufferSize, ambientCtx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Leaky integration filter for low-pass brown noise feel
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Gain scaling
      }

      noiseNode = ambientCtx.createBufferSource();
      noiseNode.buffer = buffer;
      noiseNode.loop = true;

      filterNode = ambientCtx.createBiquadFilter();
      filterNode.type = 'lowpass';
      // Dynamically filter focus: higher focus = clearer high frequencies
      filterNode.frequency.setValueAtTime(200 + (focusVal * 10), ambientCtx.currentTime);

      const gain = ambientCtx.createGain();
      gain.gain.setValueAtTime(0.08, ambientCtx.currentTime);

      noiseNode.connect(filterNode);
      filterNode.connect(gain);
      gain.connect(ambientCtx.destination);
      noiseNode.start();
    } else if (type === 'binaural') {
      // Binaural beats: 150Hz left ear, 150 + offset (e.g. 10Hz alpha) right ear
      const beatOffset = focusVal >= 85 ? 10 : focusVal >= 60 ? 6 : 4; // Alpha, Theta, or Delta
      
      binauralOscLeft = ambientCtx.createOscillator();
      binauralOscRight = ambientCtx.createOscillator();
      
      binauralOscLeft.type = 'sine';
      binauralOscLeft.frequency.setValueAtTime(150, ambientCtx.currentTime);
      
      binauralOscRight.type = 'sine';
      binauralOscRight.frequency.setValueAtTime(150 + beatOffset, ambientCtx.currentTime);

      const merger = ambientCtx.createChannelMerger(2);
      const gainL = ambientCtx.createGain();
      const gainR = ambientCtx.createGain();
      
      gainL.gain.setValueAtTime(0.04, ambientCtx.currentTime);
      gainR.gain.setValueAtTime(0.04, ambientCtx.currentTime);

      binauralOscLeft.connect(gainL).connect(merger, 0, 0);
      binauralOscRight.connect(gainR).connect(merger, 0, 1);

      const masterGain = ambientCtx.createGain();
      masterGain.gain.setValueAtTime(0.2, ambientCtx.currentTime);

      merger.connect(masterGain).connect(ambientCtx.destination);
      
      binauralOscLeft.start();
      binauralOscRight.start();
    }
  } catch (err) {
    console.error("Failed to compile ambient audio synthesizer", err);
  }
};

// Dynamically alter lowpass filter or beats frequency based on Focus
export const updateAmbientFrequency = (focusVal) => {
  try {
    if (!ambientCtx || ambientCtx.state !== 'running') return;
    
    if (filterNode) {
      // Modulate low-pass filter cutoff
      filterNode.frequency.exponentialRampToValueAtTime(200 + (focusVal * 10), ambientCtx.currentTime + 0.5);
    }
    if (binauralOscRight) {
      const beatOffset = focusVal >= 85 ? 10 : focusVal >= 60 ? 6 : 4;
      binauralOscRight.frequency.exponentialRampToValueAtTime(150 + beatOffset, ambientCtx.currentTime + 0.5);
    }
  } catch (e) {}
};

// Stop audio scapes
export const stopAmbientSound = () => {
  try {
    if (noiseNode) {
      noiseNode.stop();
      noiseNode = null;
    }
    if (binauralOscLeft) {
      binauralOscLeft.stop();
      binauralOscLeft = null;
    }
    if (binauralOscRight) {
      binauralOscRight.stop();
      binauralOscRight = null;
    }
    filterNode = null;
  } catch (e) {}
};
