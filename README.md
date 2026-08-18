# Mind Metric — Real-Time Cognitive Analytics Dashboard

Mind Metric is a responsive, client-side real-time data analytics dashboard that visualizes simulated cognitive telemetry metrics (Focus Score, Stress Level, Activity Index, Engagement Rate). 

Designed with a decoupled **Publisher-Subscriber architecture**, the interface is completely swap-ready. It can transition from simulated client-side telemetry to live physical EEG headbands (e.g. Muse) or eye-tracking streams with zero UI code refactoring.

---

## 🚀 Advanced Features

### 1. Dynamic Simulation Presets (Profiles)
Change baseline simulation profiles on the fly via the Settings control panel. Metrics smoothly transition between targets using leaky integration walks:
- **Balanced Default**: Default baseline parameters.
- **Deep Focus Mode**: Shifts telemetry toward high focus and low stress.
- **High Stress Overload**: Shifts telemetry toward high stress and fatigue focus dips.
- **Calm Recovery State**: Shifts telemetry toward relaxed stress levels and low activity.

### 2. Interactive Biofeedback Breathing Trainer
Engage in a 4-4-4 box breathing task directly inside the console (Inhale, Hold, Exhale). Completing breathing cycles injects live positive offsets (`+3` Focus, `-5` Stress) directly back into the telemetry stream, providing real-time visual feedback on charts and gauges.

### 3. Dynamic Visual Themes
Toggle dynamic UI themes inside the settings dashboard:
- **Space Console**: Slate-indigo dark HUD.
- **Neon Cyberpunk**: Pink neon borders, violet shadows, yellow highlights.
- **Matrix Digital**: Black terminal console with phosphor green layouts.

### 4. Synthesized Audio Notifications
Synthesizes telemetry alarms purely in the browser using the **Web Audio API**:
- Double Sawtooth Beep on critical stress limit crossings.
- Triangle Warning Chime on focus drops.
- Dual Ascending Sine Chime on flow state entries.

### 5. Session Data Export
Download current rolling session telemetry data directly as a `.json` file for local offline analysis.

---

## 🛠️ Tech Stack
- **Framework**: React (Functional Components & Hooks)
- **Styling**: Tailwind CSS (Utility-only setup)
- **Charts**: Recharts (Streaming line areas, gauges, donut distributions, benchmarks)
- **Icons**: Lucide React
- **Data Stream**: In-memory subscription data engine

---

## 📦 Getting Started

### Installation
```bash
npm install
```

### Run the Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```
