# Mind Metric — Advanced Real-Time Cognitive Analytics Console

Mind Metric is a responsive, client-side real-time data analytics dashboard designed to visualize cognitive telemetry metrics (Focus Score, Stress Level, Activity Index, Engagement Rate). 

Designed with a decoupled **Publisher-Subscriber architecture**, the interface is completely swap-ready. It can transition from simulated client-side telemetry to live physical EEG headbands (e.g. Muse) or eye-tracking streams with zero UI code refactoring.

---

## 🚀 Interactive Features List

### 1. Dynamic Simulation Presets (Profiles)
Change baseline simulation profiles on the fly via the Settings control panel. Metrics smoothly transition between targets using leaky integration walks:
- **Balanced Default**: Default baseline parameters.
- **Deep Focus Mode**: Shifts telemetry toward high focus and low stress.
- **High Stress Overload**: Shifts telemetry toward high stress and fatigue focus dips.
- **Calm Recovery State**: Shifts telemetry toward relaxed stress levels and low activity.

### 2. Interactive Biofeedback Breathing Trainer
Engage in a 4-4-4 box breathing task directly inside the console (Inhale, Hold, Exhale). Completing breathing cycles injects live positive offsets (`+3` Focus, `-5` Stress) directly back into the telemetry stream, providing real-time visual feedback on charts and gauges.

### 3. Natively Synthesized Ambient Soundscapes
Plays focus-assisting white noise, rain, and binaural beats natively using the browser's Web Audio API. Cutoff filter frequencies and pitch offsets dynamically adjust based on your current live Focus Score.

### 4. Micro-Break & Stretch Guide
A full-screen break overlay modal that triggers when neural stress runs high, or when manually launched. Guides users through quick physical stretches (neck release, shoulder rolls, wrist flexors) with countdown timers to release muscular tension.

### 5. Timeline Annotations (Notes)
Type annotations directly into the input HUD to attach contextual comments (e.g. "coffee kicked in", "phone call distraction") directly to the current chart timestamp. Notes render as interactive dashed marker lines directly on the streaming line area chart.

### 6. Daily Goals & Performance Streaks
Tracks target minutes spent in an optimal flow state, visualizing daily goals completions and showing streaks metrics.

### 7. Calendar Scheduling Overlay
Injects scheduling overlay markings (e.g. Standup Sync, Code Review) directly onto the charts to show how scheduled tasks correlate with focus levels.

### 8. Dynamic Visual Themes
Toggle dynamic UI themes inside the settings dashboard:
- **Space Console**: Slate-indigo dark HUD.
- **Neon Cyberpunk**: Pink neon borders, violet shadows, yellow highlights.
- **Matrix Digital**: Black terminal console with phosphor green layouts.

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
