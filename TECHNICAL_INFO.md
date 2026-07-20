# 📚 Vedra BI — Technical Documentation

> **Version:** 1.0.0 | **Last Updated:** 2025 | **Author:** Vedra BI Team

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Module Reference](#2-module-reference)
3. [Data Flow](#3-data-flow)
4. [State Management](#4-state-management)
5. [Chart Engine Details](#5-chart-engine-details)
6. [Authentication Flow](#6-authentication-flow)
7. [Firebase Configuration](#7-firebase-configuration)
8. [AI Integration (Gemini)](#8-ai-integration-gemini)
9. [Performance Architecture](#9-performance-architecture)
10. [CDN & Dependency Loading](#10-cdn--dependency-loading)
11. [Export System](#11-export-system)
12. [Drag-and-Drop System](#12-drag-and-drop-system)
13. [Filter Engine](#13-filter-engine)
14. [Error Handling](#14-error-handling)
15. [Environment Variables Reference](#15-environment-variables-reference)
16. [Deployment Guide](#16-deployment-guide)
17. [Python Backend (Optional)](#17-python-backend-optional)
18. [Browser API Usage](#18-browser-api-usage)
19. [Coding Standards](#19-coding-standards)
20. [Glossary](#20-glossary)

---

## 1. System Architecture

### Overview

Vedra BI follows a **modular, event-driven architecture** where all JavaScript modules communicate through a shared state store rather than direct coupling. This allows individual components to be updated or replaced without cascading changes.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                        │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ index.html│  │login.html│  │edit_data │  │  CSS Modules │   │
│  │ Dashboard │  │  Auth    │  │  .html   │  │  core/custom │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────────────┘   │
│       │              │              │                            │
│  ┌────▼──────────────▼──────────────▼──────────────────────┐   │
│  │                    ES Module Layer                        │   │
│  │  main.js ─► charts.js ─► chart/*.js                     │   │
│  │  filter.js ─► DataHandler.js ─► UIHandler.js            │   │
│  │  chat.js ─► cdnManager.js ─► dynamicLoader.js           │   │
│  │  drag_drop.js ─► reportExporter.js ─► utils.js          │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                          │                                       │
│  ┌───────────────────────▼───────────────────────────────────┐  │
│  │                    State Store Layer                       │  │
│  │   DataHandler.js  │  UIHandler.js  │  DataTracker.js      │  │
│  └───────────────────────┬───────────────────────────────────┘  │
└──────────────────────────┼─────────────────────────────────────-┘
                           │
         ┌─────────────────┼──────────────────┐
         ▼                 ▼                  ▼
  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐
  │  Firebase   │  │  Gemini AI   │  │  Express Server  │
  │  Auth +     │  │  REST API    │  │  (Node.js)       │
  │  Firestore  │  │              │  │  Optional Python │
  └─────────────┘  └──────────────┘  └──────────────────┘
```

### Page Structure

| Page | File | Purpose |
|------|------|---------|
| Dashboard | `index.html` | Main BI interface with charts, filters, AI chat |
| Authentication | `login.html` | Login / Sign-up / Guest entry |
| Data Editor | `edit_data.html` | Luckysheet spreadsheet interface |

---

## 2. Module Reference

### `src/js/main.js` — Entry Point & Orchestrator

The entry point that initializes all subsystems in the correct order:

```
1. Firebase SDK init
2. Auth state listener
3. DataHandler.initData()
4. UIHandler setup
5. Filter initialization
6. Chart rendering (plotAll)
7. Drag-drop initialization
8. AI chat setup
```

**Exports:** None (side-effects only at startup)

---

### `src/js/main_handlers.js` — Global Event Handlers

Registers all document-level event listeners:
- Sidebar toggle / collapse
- Dashboard switcher
- Background/theme selector
- Lock mode toggle
- Keyboard shortcuts

---

### `src/js/charts.js` — Chart Lifecycle Manager

Manages the complete chart object lifecycle.

| Function | Signature | Description |
|----------|-----------|-------------|
| `plotAll` | `() => void` | Re-renders every chart in `visualizations[]` |
| `addChartToDashboard` | `(config: ChartConfig) => void` | Adds chart, assigns container |
| `removeChart` | `(id: string) => void` | Destroys ECharts instance + DOM element |
| `initializeChartPreview` | `(config) => void` | Renders preview in sidebar |
| `discardActivePreviewChart` | `() => void` | Removes preview instance |

**ChartConfig shape:**

```javascript
{
  type: 'bar' | 'line' | 'pie' | 'radar' | 'scatter' |
        'gauge' | 'funnel' | 'tree_map' | 'bar3d' | 'line3d',
  xAxis: string,       // Header name for X axis
  yAxis: string,       // Header name for Y axis
  title: string,       // Display title
  color: string[],     // Optional color palette
  effect: string,      // Visual effect key
}
```

---

### `src/store/DataHandler.js` — Core Data Operations

The single source of truth for all data state.

**Exported State:**

```javascript
export let rawData     = [];   // Original uploaded data (rows as objects)
export let filteredData = [];  // Currently active/filtered data
export let headers     = [];   // Column header strings
```

**Key Functions:**

```javascript
initData()                   // Fetch from Firebase or localStorage on startup
handleFile(file)             // Parse CSV/Excel/JSON into rawData
saveUserDataToFirebase()     // Debounced (2s) push to Firestore
applyFiltersAndSort()        // Recalculate filteredData from rawData + activeFilters
resetFiltersAndShowAllData() // Clear filters, filteredData = rawData
exportToCSV()                // Trigger browser CSV download
clearAllData()               // Wipe rawData, filteredData, and Firebase copy
getDataStats()               // Returns { rows, cols, nullCount, numericCols }
```

---

### `src/store/UIHandler.js` — UI State Management

Centralizes all UI state:
- Active dashboard index
- Sidebar open/closed
- Theme / background selection
- Lock mode state
- Active modal

---

### `src/store/DataTracker.js` — Performance Monitoring

Tracks:
- Render time per chart
- Filter operation duration
- Firebase read/write latency
- Memory usage estimates

Exposes `getPerformanceReport()` for debug mode.

---

### `src/js/filter.js` — Data Filtering Engine

```javascript
// Active filter state
let activeFilters = {
  columnFilters: {},    // { "ColumnName": ["val1", "val2"] }
  dateRange: { col: null, from: null, to: null },
  numericRange: { col: null, min: null, max: null },
  textSearch: '',
  sort: { col: null, dir: 'asc' }
};
```

All filter mutations call `applyFiltersAndSort()` then `plotAll()`.

---

### `src/js/chat.js` — AI Chat Interface

```javascript
sendChatMessage(message: string) → Promise<void>
// Sends message + current data context to Gemini API
// Streams response into chat UI

generateSummary() → Promise<string>
// Generates a statistical summary of current filteredData

clearChatHistory() → void
// Resets conversation array and clears UI
```

**Context injection:** Each Gemini request includes:
- `headers[]`
- First 100 rows of `filteredData`
- Current chart count
- Active filter description

---

### `src/js/cdnManager.js` — Resilient CDN Loader

Attempts to load each dependency from primary CDN, falls back to secondary on failure. Implements retry with exponential backoff.

```javascript
const CDN_SOURCES = {
  echarts: ['https://cdn.jsdelivr.net/...', 'https://unpkg.com/...'],
  luckysheet: ['https://cdn.jsdelivr.net/...'],
  plotly: ['https://cdn.plot.ly/...', 'https://cdn.jsdelivr.net/...'],
};
```

---

### `src/js/reportExporter.js` — Export Engine

| Function | Output |
|----------|--------|
| `exportPDF()` | html2canvas + jsPDF — full dashboard snapshot |
| `exportPNG()` | html2canvas — dashboard PNG download |
| `exportCSV()` | PapaParse unparse — filtered data as CSV |
| `exportExcel()` | SheetJS XLSX — native Excel format |

---

## 3. Data Flow

### Upload Flow

```
User selects file
    │
    ▼
handleFile(file)
    │
    ├──► CSV? → PapaParse.parse()
    ├──► Excel? → SheetJS.read()
    └──► JSON? → JSON.parse()
    │
    ▼
Validate headers + sanitize values
    │
    ▼
rawData = parsed rows
filteredData = [...rawData]
headers = Object.keys(rawData[0])
    │
    ▼
saveUserDataToFirebase() [debounced 2s]
    │
    ▼
plotAll() → re-render all charts
```

### Filter Flow

```
User interacts with filter UI
    │
    ▼
Update activeFilters object
    │
    ▼
applyFiltersAndSort()
    │
    ├──► Apply column filters (exact / multi-select)
    ├──► Apply date range
    ├──► Apply numeric range
    ├──► Apply text search (case-insensitive)
    └──► Apply sort
    │
    ▼
filteredData = result
    │
    ▼
plotAll() → re-render all charts with new data
```

---

## 4. State Management

Vedra BI does **not** use a framework-level state manager (no Redux, no Vuex). Instead, it uses:

1. **Module-level exports** — `rawData`, `filteredData`, `headers` in `DataHandler.js`
2. **UIHandler singleton** — DOM-coupled state
3. **localStorage** — Persisted preferences (theme, filter state, dashboard layout)
4. **Firebase Firestore** — Cloud-persisted user data

### localStorage Keys

| Key | Type | Purpose |
|-----|------|---------|
| `vbi_rawData` | JSON string | Offline fallback for data |
| `vbi_activeFilters` | JSON string | Persist filters across sessions |
| `vbi_dashboards` | JSON string | Dashboard names & chart configs |
| `vbi_theme` | string | Active theme name |
| `vbi_chatHistory` | JSON string | AI conversation history |

---

## 5. Chart Engine Details

### Renderer Selection

| Chart Type | Renderer |
|-----------|----------|
| Bar, Line, Pie, Doughnut | ECharts SVG |
| Radar, Scatter, Gauge, Funnel | ECharts Canvas |
| Tree Map | ECharts Canvas |
| 3D Bar, 3D Line | ECharts-GL (WebGL) |
| Professional overlays | Plotly.js |

### Chart Template Files (`src/chart/*.js`)

Each file exports a single function `getOption(data, headers, config)` that returns an ECharts option object. This pure-function design makes testing and customization straightforward.

### Effect System

Effects are post-render CSS/DOM manipulations:

```javascript
const EFFECTS = {
  glow: (container) => container.style.boxShadow = '0 0 20px rgba(96,165,250,0.6)',
  shadow: (container) => container.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
  rotate3d: (container) => /* CSS 3D perspective transform */,
  neon: (container) => /* multi-layer box-shadow neon effect */,
};
```

---

## 6. Authentication Flow

```
User opens login.html
    │
    ├──── Email/Password ──► firebase.auth().signInWithEmailAndPassword()
    ├──── Google OAuth ────► GoogleAuthProvider + signInWithPopup()
    ├──── Guest Demo ──────► firebase.auth().signInAnonymously()
    └──── OTP (test) ──────► simulated OTP via timeout
    │
    ▼
onAuthStateChanged(user)
    │
    ├── user exists ──► redirect to index.html + initData()
    └── no user ──────► show login form
```

**Session Persistence:**
```javascript
firebase.auth().setPersistence(
  rememberMe ? firebase.auth.Auth.Persistence.LOCAL   // 30 days
             : firebase.auth.Auth.Persistence.SESSION  // tab only
);
```

---

## 7. Firebase Configuration

### Firestore Document Structure

```
users/
  {uid}/
    data/
      rawData: [...rows]
      headers: [...]
      lastModified: Timestamp
    dashboards/
      {dashId}/
        name: string
        charts: [ChartConfig]
        layout: [LayoutItem]
    preferences/
      theme: string
      filters: {...activeFilters}
      chatHistory: [...]

public/
  templates/
    {templateId}/
      name: string
      data: [...sample rows]
```

---

## 8. AI Integration (Gemini)

### API Call Structure

```javascript
const payload = {
  contents: [{
    parts: [{
      text: buildPrompt(userMessage, contextData)
    }]
  }],
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  }
};

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
  { method: 'POST', body: JSON.stringify(payload) }
);
```

### Context Builder

```javascript
function buildPrompt(message, context) {
  return `
You are a BI assistant for Vedra BI.
Data columns: ${context.headers.join(', ')}
Sample data (first 5 rows): ${JSON.stringify(context.sampleData)}
Active filters: ${JSON.stringify(context.filters)}
Current charts: ${context.chartCount}

User question: ${message}
Answer in the same language the user used (Hindi or English).
  `;
}
```

### Agent Mode Commands

When Agent Mode is enabled, the AI recognizes structured commands:

| Command Pattern | Action |
|----------------|--------|
| `"Add [type] chart for [column]"` | Calls `addChartToDashboard()` |
| `"Apply [effect] to chart [N]"` | Calls effect applicator |
| `"Filter by [column] = [value]"` | Updates `activeFilters` |
| `"Export PDF"` | Calls `exportPDF()` |

---

## 9. Performance Architecture

### Virtual Scrolling

For datasets >10,000 rows, the data table uses a virtual scroll implementation:
- Only renders visible rows + 20px buffer
- Row height: 36px fixed
- Recalculates on scroll with `requestAnimationFrame`

### Batch Operations

```javascript
// Prevents UI blocking during large dataset operations
function batchProcess(array, batchSize, processFn) {
  let index = 0;
  function processBatch() {
    const batch = array.slice(index, index + batchSize);
    processFn(batch);
    index += batchSize;
    if (index < array.length) requestAnimationFrame(processBatch);
  }
  requestAnimationFrame(processBatch);
}
```

### Debounce Strategy

| Operation | Debounce Delay |
|-----------|---------------|
| Text search filter | 300ms |
| Auto-save to Firebase | 2000ms |
| Chart resize observer | 150ms |
| Sidebar collapse animation | 50ms |

---

## 10. CDN & Dependency Loading

### Load Order

```
1. Bootstrap CSS (sync)
2. Bootstrap Icons (sync)
3. Bootstrap JS (deferred)
4. Firebase SDK (deferred, module)
5. ECharts (lazy, on first chart render)
6. ECharts-GL (lazy, only when 3D chart added)
7. Luckysheet (lazy, on edit_data.html only)
8. Plotly (lazy, on professional chart types)
9. PapaParse (lazy, on CSV file upload)
10. SheetJS (lazy, on Excel file upload)
11. jsPDF + html2canvas (lazy, on PDF export)
```

### Fallback Chain (cdnManager.js)

```
Primary CDN → Secondary CDN → Local cache (if available) → Error notification
```

---

## 11. Export System

### PDF Export Implementation

```javascript
async function exportPDF() {
  const dashboard = document.getElementById('dashboard-container');
  const canvas = await html2canvas(dashboard, {
    scale: 2,           // 2x resolution for retina
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#0f172a'
  });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('landscape', 'mm', 'a4');
  pdf.addImage(imgData, 'PNG', 10, 10, 277, 180);
  pdf.save('vedra-bi-report.pdf');
}
```

### Excel Export Implementation

```javascript
function exportExcel() {
  const ws = XLSX.utils.json_to_sheet(filteredData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, 'vedra-bi-export.xlsx');
}
```

---

## 12. Drag-and-Drop System

### Implementation

Uses the native **HTML5 Drag and Drop API** with custom ghost element positioning.

```javascript
// Container structure
{
  id: string,           // Unique container ID
  x: number,           // CSS left (px)
  y: number,           // CSS top (px)
  width: number,       // CSS width (px)
  height: number,      // CSS height (px)
  chartId: string,     // Bound chart ID
}
```

### Resize

Custom resize handles (8-point: N, NE, E, SE, S, SW, W, NW) implemented via `mousedown` + `mousemove` tracking.

### Lock Mode

When Lock Mode is enabled:
- `pointer-events: none` on all drag handles
- Resize handles hidden via CSS
- Position changes ignored in event handlers

---

## 13. Filter Engine

### Filter Evaluation Order

```
1. Column filters (exact match / inclusion)
2. Date range filter
3. Numeric range filter
4. Full-text search (across all string columns)
5. Sort (stable sort with column + direction)
```

### Performance

For datasets >100,000 rows, filter operations run in a **Web Worker** (if available) to prevent UI thread blocking.

---

## 14. Error Handling

### Global Error Boundary

```javascript
window.addEventListener('error', (event) => {
  if (DEBUG) console.error('[VedrBI Error]', event.error);
  showToast('Something went wrong. Please refresh.', 'error');
  DataTracker.logError(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  if (DEBUG) console.error('[VedrBI Promise]', event.reason);
  showToast('Network or async error occurred.', 'warning');
});
```

### Firebase Error Codes

| Code | Meaning | User Message |
|------|---------|-------------|
| `auth/wrong-password` | Bad credentials | "Incorrect password" |
| `auth/user-not-found` | No account | "No account found" |
| `auth/network-request-failed` | No internet | "Check connection" |
| `firestore/permission-denied` | Security rule | "Access denied" |
| `firestore/quota-exceeded` | Quota limit | "Storage limit reached" |

---

## 15. Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_FIREBASE_API_KEY` | ✅ | Firebase project API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | ✅ | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | ✅ | Firestore project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | ✅ | Firebase Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ✅ | FCM sender ID |
| `VITE_FIREBASE_APP_ID` | ✅ | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | ⬜ | Analytics (optional) |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `PORT` | ⬜ | Express server port (default: 3000) |

---

## 16. Deployment Guide

### Vite Production Build

```bash
npm run build
# Output: dist/ directory (fully static)
```

### Static Hosting (Firebase Hosting)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Public directory: dist
# Single-page app: Yes
firebase deploy
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## 17. Python Backend (Optional)

For datasets larger than 50MB, an optional Python backend handles data processing:

### Setup

```bash
pip install flask pandas numpy
python backend/server.py
```

### Endpoints

| Endpoint | Method | Payload | Response |
|----------|--------|---------|----------|
| `/api/upload-large-data` | POST | `{ data: [...rows], headers: [...] }` | `{ success: true, id: string }` |
| `/api/filter-large-data` | POST | `{ id: string, filters: {...} }` | `{ data: [...filtered] }` |

### Activation

Set `VITE_USE_PYTHON_BACKEND=true` in `.env.local` to route large dataset operations to the Python server.

---

## 18. Browser API Usage

| API | Used For |
|-----|---------|
| `File API` | File upload reading |
| `Blob API` | CSV/Excel download |
| `localStorage` | Persistent UI preferences |
| `IndexedDB` | (Future) large dataset local cache |
| `Web Workers` | Heavy filter operations |
| `Intersection Observer` | Lazy chart rendering |
| `Resize Observer` | Chart container resize detection |
| `Drag and Drop API` | Dashboard layout |
| `Canvas API` | PDF/PNG export (via html2canvas) |
| `WebGL` | 3D chart rendering (ECharts-GL) |

---

## 19. Coding Standards

### JavaScript

- **Module system:** ES Modules (`import`/`export`) only — no CommonJS
- **Async:** `async/await` preferred over `.then()` chains
- **Comments:** English for logic; Hindi acceptable for UI strings
- **No TypeScript** in `.js` files — use JSDoc for type hints
- **Formatting:** Prettier (`.prettierrc` in root)

### CSS

- **Methodology:** BEM-lite (block__element--modifier)
- **Variables:** CSS custom properties (`--color-primary`, etc.) in `core.css`
- **Responsive:** Mobile-first using Bootstrap breakpoints
- **Dark theme:** Overrides via `dark_theam.css` class toggled on `<body>`

### File Naming

- `camelCase.js` for modules
- `snake_case.css` for stylesheets
- `PascalCase.js` for class-based modules (none currently)

---

## 20. Glossary

| Term | Definition |
|------|-----------|
| **rawData** | The complete parsed dataset as uploaded, never mutated by filters |
| **filteredData** | The currently active subset of rawData after applying all filters |
| **visualization** | A single chart object `{ id, type, config, echartInstance }` |
| **container** | A draggable/resizable `<div>` that hosts one visualization |
| **dashboard** | A named collection of containers and their layout |
| **effect** | A CSS/WebGL visual enhancement applied to a chart container |
| **Agent Mode** | AI chat mode where the assistant can directly mutate app state |
| **CDN fallback** | The process of retrying a dependency load from an alternative URL |

---

<div align="center">

**Vedra BI Technical Documentation**
`gametidhaval980@gmail.com` · [GitHub](https://github.com/gametidhaval980/vedra-bi)

</div>
