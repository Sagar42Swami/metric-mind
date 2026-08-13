// Mock real-time data generator for Mind Metric
// Simulates EEG/telemetry data stream without external API calls

class MockDataStreamEngine {
  constructor() {
    this.subscribers = new Set();
    this.intervalId = null;
    this.tickRate = 1500; // ms
    this.isPaused = true;
    
    // Seed initial values for smooth random walks
    this.currentValues = {
      focus: 72,
      stress: 38,
      activity: 58,
      engagement: 76
    };
    
    this.time = 0;
  }

  // Register a subscriber callback
  subscribe(callback) {
    this.subscribers.add(callback);
    // Return unsubscribe function for convenience
    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback) {
    this.subscribers.delete(callback);
  }

  // Start the simulation ticks
  start(tickRate = this.tickRate) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.tickRate = tickRate;
    this.isPaused = false;
    this.intervalId = setInterval(() => this.tick(), this.tickRate);
  }

  // Pause the simulation ticks
  pause() {
    this.isPaused = true;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.notifyStatusChange();
  }

  // Resume the simulation ticks
  resume() {
    this.start(this.tickRate);
    this.notifyStatusChange();
  }

  // Adjust tick speed dynamically
  setSpeed(speedMs) {
    this.tickRate = speedMs;
    if (!this.isPaused) {
      this.start(speedMs);
    }
  }

  // Trigger subscriber notifications about status (running/paused)
  notifyStatusChange() {
    const statusUpdate = {
      type: 'STATUS_UPDATE',
      isPaused: this.isPaused,
      tickRate: this.tickRate
    };
    this.subscribers.forEach(cb => cb(statusUpdate));
  }

  // Generate standard metrics with a smooth random walk + sine wave trends
  tick() {
    this.time += 0.1;
    
    // Check if we trigger a spontaneous anomaly (approx 4% chance per tick)
    const shouldTriggerAnomaly = Math.random() < 0.04;
    let anomalyData = null;

    if (shouldTriggerAnomaly) {
      anomalyData = this.generateAnomaly();
    } else {
      // Normal tick: apply smooth random walk + waves
      
      // Focus: baseline ~70, sine wave variation, random walk of -3 to +3
      const focusWave = Math.sin(this.time * 0.5) * 5;
      const focusWalk = (Math.random() - 0.5) * 4;
      this.currentValues.focus = Math.max(10, Math.min(100, this.currentValues.focus + focusWalk + (focusWave * 0.1)));

      // Stress: baseline ~40, random walk of -4 to +4, inverse relationship with focus trend
      const stressInverse = (70 - this.currentValues.focus) * 0.15;
      const stressWalk = (Math.random() - 0.5) * 5 + stressInverse;
      this.currentValues.stress = Math.max(5, Math.min(100, this.currentValues.stress + stressWalk));

      // Activity: baseline ~55, high frequency variation
      const activityWalk = (Math.random() - 0.5) * 8;
      this.currentValues.activity = Math.max(10, Math.min(100, this.currentValues.activity + activityWalk));

      // Engagement: baseline ~75, smooth slow walk
      const engagementWalk = (Math.random() - 0.5) * 3;
      this.currentValues.engagement = Math.max(20, Math.min(100, this.currentValues.engagement + engagementWalk));
    }

    // Round values for UI cleanliness
    const metrics = {
      focus: Math.round(this.currentValues.focus),
      stress: Math.round(this.currentValues.stress),
      activity: Math.round(this.currentValues.activity),
      engagement: Math.round(this.currentValues.engagement)
    };

    const dataPoint = {
      type: 'METRIC_UPDATE',
      timestamp: Date.now(),
      metrics,
      anomaly: anomalyData
    };

    // Broadcast to all subscribers
    this.subscribers.forEach(callback => callback(dataPoint));
  }

  // Build a specific, detailed anomaly event
  generateAnomaly(specifiedType = null) {
    const types = ['STRESS_SPIKE', 'FOCUS_DROP', 'FLOW_STATE'];
    const selectedType = specifiedType || types[Math.floor(Math.random() * types.length)];
    let message = '';
    let severity = 'warning';

    if (selectedType === 'STRESS_SPIKE') {
      this.currentValues.stress = 88 + Math.random() * 8; // Jump high
      this.currentValues.focus = 30 - Math.random() * 10;   // Sink focus
      message = 'Neural overload. Stress index exceeded safety levels (85+).';
      severity = 'critical';
    } else if (selectedType === 'FOCUS_DROP') {
      this.currentValues.focus = 18 + Math.random() * 10;   // Deep crash
      this.currentValues.engagement = 25 + Math.random() * 10;
      this.currentValues.stress = 50 + Math.random() * 10;
      message = 'Cognitive fatigue detected. Extreme drop in attentiveness.';
      severity = 'warning';
    } else if (selectedType === 'FLOW_STATE') {
      this.currentValues.focus = 94 + Math.random() * 6;    // Near perfect
      this.currentValues.stress = 15 + Math.random() * 10;   // Low stress
      this.currentValues.engagement = 90 + Math.random() * 8; // High engagement
      message = 'Peak Flow State. High focus and synchronized brainwave coherence.';
      severity = 'optimal';
    }

    return {
      triggered: true,
      type: selectedType,
      message,
      severity,
      timestamp: Date.now()
    };
  }

  // Force an anomaly manually (UI control trigger)
  triggerManualAnomaly(type) {
    if (this.isPaused) {
      // Temporarily step one tick if paused, but let's just trigger it immediately
      this.resume();
    }
    const anomalyData = this.generateAnomaly(type);
    
    const metrics = {
      focus: Math.round(this.currentValues.focus),
      stress: Math.round(this.currentValues.stress),
      activity: Math.round(this.currentValues.activity),
      engagement: Math.round(this.currentValues.engagement)
    };

    const dataPoint = {
      type: 'METRIC_UPDATE',
      timestamp: Date.now(),
      metrics,
      anomaly: anomalyData
    };

    this.subscribers.forEach(cb => cb(dataPoint));
  }

  // Generate initial historical seed data to prevent empty charts on startup
  generateHistory(count = 50) {
    const history = [];
    let mockTime = this.time - (count * 0.1);
    
    // Copy current values to avoid mutating state
    let focus = this.currentValues.focus;
    let stress = this.currentValues.stress;
    let activity = this.currentValues.activity;
    let engagement = this.currentValues.engagement;

    for (let i = 0; i < count; i++) {
      mockTime += 0.1;
      
      const focusWave = Math.sin(mockTime * 0.5) * 5;
      const focusWalk = (Math.random() - 0.5) * 4;
      focus = Math.max(15, Math.min(100, focus + focusWalk + (focusWave * 0.1)));

      const stressInverse = (70 - focus) * 0.15;
      const stressWalk = (Math.random() - 0.5) * 5 + stressInverse;
      stress = Math.max(5, Math.min(100, stress + stressWalk));

      const activityWalk = (Math.random() - 0.5) * 8;
      activity = Math.max(10, Math.min(100, activity + activityWalk));

      const engagementWalk = (Math.random() - 0.5) * 3;
      engagement = Math.max(20, Math.min(100, engagement + engagementWalk));

      // Calculate timestamp in the past
      const offsetMs = (count - i) * this.tickRate;
      history.push({
        timestamp: Date.now() - offsetMs,
        metrics: {
          focus: Math.round(focus),
          stress: Math.round(stress),
          activity: Math.round(activity),
          engagement: Math.round(engagement)
        },
        anomaly: null
      });
    }

    return history;
  }
}

// Export single instance
export const dataEngine = new MockDataStreamEngine();
