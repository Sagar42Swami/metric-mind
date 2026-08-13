import { useState, useEffect, useCallback, useRef } from 'react';
import { dataEngine } from '../lib/dataEngine';

export const useLiveMetrics = () => {
  const [history, setHistory] = useState([]);
  const [isPaused, setIsPaused] = useState(true);
  const [tickRate, setTickRate] = useState(1500);
  const [anomalyEvents, setAnomalyEvents] = useState([]);
  const [latestAnomaly, setLatestAnomaly] = useState(null);

  // Maximum number of points to keep in memory (approx 5-6 mins of history at 1.5s)
  const maxBufferSize = 250;

  // Use refs to access latest values in the callback without re-subscribing
  const historyRef = useRef([]);
  historyRef.current = history;

  // Initialize and subscribe
  useEffect(() => {
    // Generate initial historical seed data so charts are populated immediately
    const seedData = dataEngine.generateHistory(60);
    setHistory(seedData);
    
    // Set initial status
    setIsPaused(dataEngine.isPaused);
    setTickRate(dataEngine.tickRate);

    // Subscribe to telemetry ticks
    const unsubscribe = dataEngine.subscribe((event) => {
      if (event.type === 'METRIC_UPDATE') {
        const newHistory = [...historyRef.current, event];
        
        // Cap the history buffer size
        if (newHistory.length > maxBufferSize) {
          newHistory.shift();
        }
        setHistory(newHistory);

        // Check for anomalies
        if (event.anomaly && event.anomaly.triggered) {
          setLatestAnomaly(event.anomaly);
          setAnomalyEvents(prev => {
            const newEvents = [event.anomaly, ...prev];
            return newEvents.slice(0, 50); // Cap at 50 events in log
          });
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

  const dismissAnomaly = useCallback(() => {
    setLatestAnomaly(null);
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
    pause,
    resume,
    setSpeed,
    triggerAnomaly,
    dismissAnomaly,
    reset
  };
};
