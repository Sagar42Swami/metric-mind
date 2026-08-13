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
