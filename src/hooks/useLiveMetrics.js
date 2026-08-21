import { useState, useEffect, useCallback, useRef } from 'react';
import { dataEngine } from '../lib/dataEngine';
import { playTelemetrySound } from '../lib/utils';

export const useLiveMetrics = () => {
  const [history, setHistory] = useState([]);
  const [isPaused, setIsPaused] = useState(true);
  const [tickRate, setTickRate] = useState(1500);
  const [anomalyEvents, setAnomalyEvents] = useState([]);
  const [latestAnomaly, setLatestAnomaly] = useState(null);

  // Custom Settings & Alerts state
  const [thresholds, setThresholds] = useState({
    stressMax: 85,
    focusMin: 25,
    focusOptimal: 95
  });
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([
    { timestamp: Date.now() - 240000, title: 'Standup Sync' },
    { timestamp: Date.now() - 90000, title: 'Code Review' }
  ]);

  // Maximum number of points to keep in memory (approx 5-6 mins of history at 1.5s)
  const maxBufferSize = 250;

  // Use refs to access latest values in the callback without re-subscribing
  const historyRef = useRef([]);
  historyRef.current = history;

  const thresholdsRef = useRef(thresholds);
  thresholdsRef.current = thresholds;

  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  // Initialize and subscribe
  useEffect(() => {
    // Generate initial historical seed data so charts are populated immediately
    const rawSeedData = dataEngine.generateHistory(60);
    const seedData = rawSeedData.map((pt, idx) => {
      const prevPt = rawSeedData[idx - 1];
      const deltas = { focus: 0, stress: 0, activity: 0, engagement: 0 };
      if (prevPt) {
        Object.keys(pt.metrics).forEach((key) => {
          deltas[key] = pt.metrics[key] - prevPt.metrics[key];
        });
      }
      return { ...pt, deltas };
    });
    setHistory(seedData);
    
    // Set initial status
    setIsPaused(dataEngine.isPaused);
    setTickRate(dataEngine.tickRate);

    // Subscribe to telemetry ticks
    const unsubscribe = dataEngine.subscribe((event) => {
      if (event.type === 'METRIC_UPDATE') {
        const prevPoint = historyRef.current[historyRef.current.length - 1];
        const currentMetrics = event.metrics;
        const prevMetrics = prevPoint ? prevPoint.metrics : null;

        // Calculate deltas
        const deltas = { focus: 0, stress: 0, activity: 0, engagement: 0 };
        if (prevMetrics) {
          Object.keys(currentMetrics).forEach((key) => {
            deltas[key] = currentMetrics[key] - prevMetrics[key];
          });
        }

        // Enrich the event with deltas
        const enrichedEvent = {
          ...event,
          deltas
        };

        // Check safety thresholds client-side (avoid repeating alert if already out-of-bounds)
        let clientAnomaly = null;
        const limits = thresholdsRef.current;

        if (currentMetrics.stress >= limits.stressMax && (!prevMetrics || prevMetrics.stress < limits.stressMax)) {
          clientAnomaly = {
            triggered: true,
            type: 'STRESS_SPIKE',
            message: `Neural overload. Stress index exceeded safety levels (${limits.stressMax}%+).`,
            severity: 'critical',
            timestamp: Date.now()
          };
        } else if (currentMetrics.focus <= limits.focusMin && (!prevMetrics || prevMetrics.focus > limits.focusMin)) {
          clientAnomaly = {
            triggered: true,
            type: 'FOCUS_DROP',
            message: `Cognitive fatigue detected. Extreme drop in attentiveness (<${limits.focusMin}%).`,
            severity: 'warning',
            timestamp: Date.now()
          };
        } else if (currentMetrics.focus >= limits.focusOptimal && (!prevMetrics || prevMetrics.focus < limits.focusOptimal)) {
          clientAnomaly = {
            triggered: true,
            type: 'FLOW_STATE',
            message: `Peak Flow State. High focus and brainwave coherence (${limits.focusOptimal}%+).`,
            severity: 'optimal',
            timestamp: Date.now()
          };
        }

        // If client anomaly is detected, and there is no engine anomaly triggered on this tick:
        if (clientAnomaly && (!enrichedEvent.anomaly || !enrichedEvent.anomaly.triggered)) {
          enrichedEvent.anomaly = clientAnomaly;
        }

        const newHistory = [...historyRef.current, enrichedEvent];
        
        // Cap the history buffer size
        if (newHistory.length > maxBufferSize) {
          newHistory.shift();
        }
        setHistory(newHistory);

        // Check for anomalies
        if (enrichedEvent.anomaly && enrichedEvent.anomaly.triggered) {
          setLatestAnomaly(enrichedEvent.anomaly);
          setAnomalyEvents(prev => {
            const newEvents = [enrichedEvent.anomaly, ...prev];
            return newEvents.slice(0, 50); // Cap at 50 events in log
          });
          if (soundEnabledRef.current) {
            playTelemetrySound(enrichedEvent.anomaly.severity);
          }
        }
      } else if (event.type === 'STATUS_UPDATE') {
        setIsPaused(event.isPaused);
        setTickRate(event.tickRate);
      }
    });

    // Start engine by default
    dataEngine.start();
    setIsPaused(false);

    return () => {
      unsubscribe();
      dataEngine.pause();
    };
  }, []);

  // Control Actions
  const pause = useCallback(() => {
    dataEngine.pause();
  }, []);

  const resume = useCallback(() => {
    dataEngine.resume();
  }, []);

  const setSpeed = useCallback((speedMs) => {
    dataEngine.setSpeed(speedMs);
  }, []);

  const triggerAnomaly = useCallback((type) => {
    dataEngine.triggerManualAnomaly(type);
  }, []);

  const setProfile = useCallback((profile) => {
    dataEngine.setProfile(profile);
  }, []);

  const injectMetricShift = useCallback((focusDelta, stressDelta) => {
    dataEngine.currentValues.focus = Math.max(10, Math.min(100, dataEngine.currentValues.focus + focusDelta));
    dataEngine.currentValues.stress = Math.max(5, Math.min(100, dataEngine.currentValues.stress + stressDelta));
    if (!dataEngine.isPaused) {
      dataEngine.tick();
    }
  }, []);

  const dismissAnomaly = useCallback(() => {
    setLatestAnomaly(null);
  }, []);

  const addAnnotation = useCallback((text) => {
    const newNote = {
      timestamp: Date.now(),
      text
    };
    setAnnotations(prev => [...prev, newNote]);
    setAnomalyEvents(prev => {
      const newEvent = {
        triggered: true,
        type: 'USER_NOTE',
        message: `Note: "${text}"`,
        severity: 'info',
        timestamp: Date.now()
      };
      return [newEvent, ...prev].slice(0, 50);
    });
  }, []);

  const reset = useCallback(() => {
    dataEngine.pause();
    setHistory([]);
    setAnomalyEvents([]);
    setLatestAnomaly(null);
    
    // Generate fresh seed data
    const seedData = dataEngine.generateHistory(60);
    setHistory(seedData);
    
    dataEngine.start();
    setIsPaused(false);
  }, []);

  // Filter history based on selected timeframe (minutes)
  const getFilteredHistory = useCallback((timeframeMins) => {
    const cutoff = Date.now() - timeframeMins * 60 * 1000;
    return history.filter(pt => pt.timestamp >= cutoff);
  }, [history]);

  return {
    history,
    getFilteredHistory,
    isPaused,
    tickRate,
    anomalyEvents,
    latestAnomaly,
    thresholds,
    setThresholds,
    soundEnabled,
    setSoundEnabled,
    pause,
    resume,
    setSpeed,
    triggerAnomaly,
    dismissAnomaly,
    reset,
    setProfile,
    injectMetricShift,
    annotations,
    addAnnotation,
    calendarEvents
  };
};
