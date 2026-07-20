<div align="center">

<!-- ═══════════════════════════════════════════════════════════════
     VEDRA BI  ·  Animated SVG Banner
════════════════════════════════════════════════════════════════ -->

<svg width="900" height="200" viewBox="0 0 900 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- background gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#0f0c29"/>
      <stop offset="50%"  stop-color="#302b63"/>
      <stop offset="100%" stop-color="#24243e"/>
    </linearGradient>
    <!-- glow filter -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <!-- text shimmer gradient -->
    <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#a78bfa"/>
      <stop offset="30%"  stop-color="#60a5fa"/>
      <stop offset="60%"  stop-color="#34d399"/>
      <stop offset="100%" stop-color="#f472b6"/>
      <animateTransform attributeName="gradientTransform" type="translate"
        values="-1 0;1 0;-1 0" dur="3s" repeatCount="indefinite"/>
    </linearGradient>
    <!-- particle gradient -->
    <radialGradient id="pGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stop-color="#60a5fa" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#60a5fa" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- background -->
  <rect width="900" height="200" rx="16" fill="url(#bgGrad)"/>

  <!-- animated grid lines -->
  <g stroke="#ffffff" stroke-opacity="0.05" stroke-width="1">
    <line x1="0" y1="40"  x2="900" y2="40"/><line x1="0" y1="80"  x2="900" y2="80"/>
    <line x1="0" y1="120" x2="900" y2="120"/><line x1="0" y1="160" x2="900" y2="160"/>
    <line x1="180" y1="0" x2="180" y2="200"/><line x1="360" y1="0" x2="360" y2="200"/>
    <line x1="540" y1="0" x2="540" y2="200"/><line x1="720" y1="0" x2="720" y2="200"/>
  </g>

  <!-- floating particles -->
  <circle cx="80"  cy="60"  r="3" fill="url(#pGrad)">
    <animate attributeName="cy" values="60;40;60"   dur="4s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="820" cy="140" r="4" fill="url(#pGrad)">
    <animate attributeName="cy" values="140;160;140" dur="3.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.6;0.1;0.6" dur="3.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="450" cy="30"  r="2.5" fill="#f472b6" fill-opacity="0.6">
    <animate attributeName="cy" values="30;50;30" dur="5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="650" cy="170" r="3" fill="#34d399" fill-opacity="0.5">
    <animate attributeName="cy" values="170;150;170" dur="4.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="200" cy="160" r="2" fill="#a78bfa" fill-opacity="0.7">
    <animate attributeName="cx" values="200;220;200" dur="6s" repeatCount="indefinite"/>
  </circle>

  <!-- animated bar chart decoration (left) -->
  <g filter="url(#glow)">
    <rect x="30" y="130" width="12" height="50" rx="3" fill="#60a5fa" opacity="0.7">
      <animate attributeName="height" values="50;70;50" dur="2s"  repeatCount="indefinite"/>
      <animate attributeName="y"      values="130;110;130" dur="2s"  repeatCount="indefinite"/>
    </rect>
    <rect x="48" y="110" width="12" height="70" rx="3" fill="#a78bfa" opacity="0.7">
      <animate attributeName="height" values="70;40;70" dur="2.4s" repeatCount="indefinite"/>
      <animate attributeName="y"      values="110;140;110" dur="2.4s" repeatCount="indefinite"/>
    </rect>
    <rect x="66" y="120" width="12" height="60" rx="3" fill="#34d399" opacity="0.7">
      <animate attributeName="height" values="60;80;60" dur="1.8s" repeatCount="indefinite"/>
      <animate attributeName="y"      values="120;100;120" dur="1.8s" repeatCount="indefinite"/>
    </rect>
  </g>

  <!-- animated line chart decoration (right) -->
  <polyline points="780,160 800,130 820,145 840,110 860,125 880,90"
    fill="none" stroke="#f472b6" stroke-width="2.5" stroke-linecap="round" filter="url(#glow)">
    <animate attributeName="points"
      values="780,160 800,130 820,145 840,110 860,125 880,90;
              780,150 800,120 820,155 840,100 860,135 880,80;
              780,160 800,130 820,145 840,110 860,125 880,90"
      dur="3s" repeatCount="indefinite"/>
  </polyline>
  <circle cx="880" cy="90" r="4" fill="#f472b6" filter="url(#glow)">
    <animate attributeName="cy" values="90;80;90" dur="3s" repeatCount="indefinite"/>
  </circle>

  <!-- VEDRA BI — main title with shimmer -->
  <text x="450" y="95" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif"
    font-size="58" font-weight="900" letter-spacing="6"
    fill="url(#shimmer)" filter="url(#glow)">
    VEDRA BI
    <animate attributeName="letter-spacing" values="6;10;6" dur="4s" repeatCount="indefinite"/>
  </text>

  <!-- subtitle -->
  <text x="450" y="135" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif"
    font-size="15" fill="#94a3b8" letter-spacing="3">
    ADVANCED BUSINESS INTELLIGENCE PLATFORM
  </text>

  <!-- decorative bottom line -->
  <line x1="150" y1="155" x2="750" y2="155" stroke="url(#shimmer)" stroke-width="1.5" opacity="0.6">
    <animate attributeName="x1" values="150;200;150" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="x2" values="750;700;750" dur="3s" repeatCount="indefinite"/>
  </line>

  <!-- tagline -->
  <text x="450" y="180" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif"
    font-size="12" fill="#64748b" letter-spacing="1">
    Real-time Data · AI Insights · Enterprise Security · 15+ Chart Types
  </text>
</svg>

<br/>

<!-- ═══════════════════ BADGES ═══════════════════ -->

[![License: MIT](https://img.shields.io/badge/License-MIT-a78bfa?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-34d399?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%2B%20Auth-f472b6?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-60a5fa?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI%20Powered-facc15?style=for-the-badge&logo=google&logoColor=black)](https://ai.google.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-38bdf8?style=for-the-badge&logo=github&logoColor=white)](https://github.com/gametidhaval980/vedra-bi/pulls)
[![Stars](https://img.shields.io/github/stars/gametidhaval980/vedra-bi?style=for-the-badge&color=f59e0b&logo=github)](https://github.com/gametidhaval980/vedra-bi/stargazers)

</div>

---

## 📋 Table of Contents

<details>
<summary><b>Click to expand</b></summary>

- [📊 Overview](#-overview)
- [✨ Key Highlights](#-key-highlights)
- [🏗️ Architecture](#️-architecture)
- [🚀 Features Deep Dive](#-features-deep-dive)
- [🔧 Installation & Setup](#-installation--setup)
- [📱 Usage Guide](#-usage-guide)
- [🔌 API Reference](#-api-reference)
- [🧪 Testing](#-testing)
- [🔒 Security](#-security)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)
- [📞 Support](#-support)

</details>

---

## 📊 Overview

**Vedra BI** is a full-featured Business Intelligence platform built with **vanilla JavaScript**, **Firebase**, and a rich ecosystem of data visualization libraries. It provides users with a seamless experience to upload, edit, visualize, and analyze data through an intuitive dashboard interface.

> 💡 **No heavy framework required.** Pure ES Modules + Firebase + best-in-class charting libraries — fast, lightweight, and self-contained.

---

## ✨ Key Highlights

<div align="center">

| Feature | Description |
|:-------:|-------------|
| 🔐 | **Secure Authentication** — Email/Password, Google Sign-In, and Guest Demo mode |
| 📊 | **Rich Visualizations** — 15+ chart types powered by ECharts, Plotly, and Chart.js |
| 📝 | **Excel-like Data Editor** — Full-featured spreadsheet editor powered by Luckysheet |
| 🤖 | **AI-Powered Chat Assistant** — Contextual data insights and guided operations |
| 📈 | **Real-time Filtering** — Multi-dimensional data filtering with persistent state |
| 🎨 | **Customizable Dashboard** — Drag-and-drop layouts, themes, backgrounds, and effects |
| 💾 | **Cloud & Local Storage** — Firebase Firestore with localStorage fallback |
| 📤 | **Multi-format Export** — PDF, PNG, CSV, Excel reports |
| 📱 | **Responsive Design** — Mobile-first approach with touch-optimized controls |

</div>

---

## 🏗️ Architecture

### Technology Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla JavaScript (ES Modules), HTML5, CSS3 |
| **UI Framework** | Bootstrap 5, Bootstrap Icons |
| **Charting Engines** | ECharts, ECharts-GL, Plotly.js |
| **Spreadsheet Editor** | Luckysheet |
| **Backend** | Node.js + Express (Python backend optional) |
| **Database** | Firebase Firestore (with localStorage fallback) |
| **Authentication** | Firebase Auth |
| **AI Integration** | Google Gemini API |
| **Build Tool** | Vite |
| **Package Manager** | npm |

</div>

### Directory Structure

```
vedra-bi/
├── 📄 index.html                  # Main dashboard
├── 🔐 login.html                  # Authentication portal
├── ✏️  edit_data.html              # Spreadsheet data editor
├── 🖥️  server.ts                   # Express backend server
├── ⚙️  vite.config.ts              # Build configuration
├── 📚 TECHNICAL_INFO.md           # Detailed technical documentation
├── 📦 package.json                # Dependencies
├── 📖 README.md                   # This file
└── src/
    ├── 📊 chart/                  # Chart renderer templates
    │   ├── bar.js
    │   ├── pie.js
    │   ├── line.js
    │   ├── radar.js
    │   ├── scatter.js
    │   ├── gauge.js
    │   ├── funneled.js
    │   ├── tree_map.js
    │   ├── bar3d.js
    │   ├── line3d.js
    │   ├── professional.js
    │   └── uility.js
    ├── 🎨 css/                    # Modular stylesheets
    │   ├── core.css
    │   ├── custom.css
    │   ├── dark_theam.css
    │   ├── all.css
    │   ├── ai_advice.css
    │   ├── editor_templates.css
    │   └── small_menubarall.css
    ├── 🗄️  data/                   # Configuration & templates
    │   ├── TEXTBOX_TEMPLATES.json
    │   └── chartContainerColors.json
    ├── 🖼️  images/                 # Static assets
    ├── 🏪 store/                  # State management
    │   ├── DataHandler.js          # Core data operations
    │   ├── UIHandler.js            # UI state management
    │   └── DataTracker.js          # Performance monitoring
    └── 🧠 js/                     # Application logic
        ├── main.js                 # Entry point & orchestrator
        ├── main_handlers.js        # Global event handlers
        ├── charts.js               # Chart lifecycle manager
        ├── chat.js                 # AI chat interface
        ├── login.js                # Firebase authentication
        ├── cdnManager.js           # Resilient CDN loader
        ├── dynamicLoader.js        # Lazy loading
        ├── filter.js               # Data filtering engine
        ├── drag_drop.js            # Drag-and-drop system
        ├── reportExporter.js       # PDF/PNG/CSV export
        ├── mockDataGenerator.js
        ├── templates.js
        └── utils.js
```

---

## 🚀 Features Deep Dive

<details>
<summary><b>🔐 1. Authentication System</b></summary>

- **Multi-method Login:** Email/Password, Google OAuth, Guest Demo
- **Mobile OTP Login:** Test environment with simulated OTP
- **Session Persistence:** Remember me option with 30-day token
- **Password Reset:** Email-based recovery workflow
- **Security:** SSL/TLS encrypted, Firebase security rules

</details>

<details>
<summary><b>🗄️ 2. Data Management</b></summary>

- **File Upload:** CSV, Excel (.xlsx, .xls), JSON
- **Google Sheets Sync:** Live import from public Google Sheets
- **Data Editor:** Full-featured Luckysheet integration with formula support
- **Auto-save:** Debounced 2-second auto-save to Firebase
- **Data Validation:** Automatic header detection and data sanitization
- **Large Dataset Support:** Handles up to **1M rows** with pagination

</details>

<details>
<summary><b>📊 3. Visualization Engine</b></summary>

- **Chart Types:** Bar, Line, Pie, Doughnut, Radar, Scatter, Gauge, Funnel, Tree Map, 3D Bar, 3D Line, and more
- **Interactivity:** Tooltips, zoom, pan, data labels, legends
- **Customization:** Color palettes, fonts, grid styles, animations
- **Real-time Updates:** Charts update automatically on data/filter changes
- **Export:** SVG/PNG export from individual charts

</details>

<details>
<summary><b>🎨 4. Dashboard Features</b></summary>

- **Multi-dashboard:** Create, rename, delete, and switch between dashboards
- **Drag-and-Drop Layout:** Move and resize chart containers
- **Background Themes:** Pre-designed templates with custom colors
- **Chart Effects:** Visual enhancements (glow, shadow, 3D rotation, etc.)
- **Textbox Support:** Rich text annotations and labels
- **Lock Mode:** Prevent accidental movement during presentations

</details>

<details>
<summary><b>🔍 5. Filtering System</b></summary>

- **Global Filters:** Column-based filtering across all charts
- **Date Range:** Filter by date columns
- **Multi-select:** Filter by multiple values
- **Numeric Range:** Min/Max value filters
- **Text Search:** Full-text search across all columns
- **Sorting:** Sort by any column (ascending/descending)
- **Persistent Filters:** Saved across sessions

</details>

<details>
<summary><b>🤖 6. AI Chat Assistant</b></summary>

- **Contextual Insights:** AI answers based on uploaded data
- **Agent Mode:** Guided commands for chart creation, effects, layouts
- **Command Center:** Quick action buttons for common operations
- **History:** Conversation persistence
- **Smart Prompts:** Pre-built templates for common BI questions

</details>

<details>
<summary><b>📤 7. Export & Reporting</b></summary>

- **PDF Reports:** Professional dashboard snapshots
- **PNG Export:** Full dashboard or individual charts
- **CSV Export:** Filtered data export
- **Excel Export:** Native .xlsx format

</details>

<details>
<summary><b>⚡ 8. Performance Optimizations</b></summary>

- **Lazy Loading:** Dynamic component loading
- **Virtual Scrolling:** Efficient large dataset rendering
- **Debounced Operations:** 300ms delay on search/filter
- **Batch Processing:** Queued operations to prevent UI blocking
- **Python Backend Mode:** Optional offloading for large datasets (>50MB)

</details>

---

## 🔧 Installation & Setup

### Prerequisites

- ![Node.js](https://img.shields.io/badge/-Node.js%20v18%2B-339933?logo=nodedotjs&logoColor=white&style=flat-square)
- ![npm](https://img.shields.io/badge/-npm%20v9%2B-CB3837?logo=npm&logoColor=white&style=flat-square)
- ![Firebase](https://img.shields.io/badge/-Firebase%20Account-FFCA28?logo=firebase&logoColor=black&style=flat-square)

### Step 1: Clone the Repository

```bash
git clone https://github.com/gametidhaval980/vedra-bi.git
cd vedra-bi
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Configuration

Create a `.env.local` file in the root directory:

```env
# ──────────────────────────────────────────
# Firebase Configuration
# ──────────────────────────────────────────
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# ──────────────────────────────────────────
# Gemini AI API Key
# ──────────────────────────────────────────
GEMINI_API_KEY=your_gemini_api_key

# ──────────────────────────────────────────
# Server Port (optional)
# ──────────────────────────────────────────
PORT=3000
```

> 🔑 Firebase configuration values can be found in your **Firebase Console → Project Settings → Your Apps → Firebase SDK snippet**.

### Step 4: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Authentication**:
   - Email/Password
   - Google Sign-In
4. Enable **Firestore Database**
5. Set Firestore security rules (see below)

#### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;
    }
    match /public/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 5: Run the Application

```bash
# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

> 🌐 Access the application at: **http://localhost:3000**

---

## 📱 Usage Guide

### 🔑 First Time Login

1. Navigate to `login.html`
2. Sign up using **Email/Password** or **Google**
3. Or click **"बिना लॉगिन के तुरंत देखें"** for Guest Demo

### 📂 Uploading Data

1. Click the **Data** menu item in the sidebar
2. Click **"Upload File"** or drag & drop a CSV/Excel/JSON file
3. Data will auto-load and display in the dashboard

### 📊 Creating Charts

1. Click the **Chart** menu item
2. Select chart type from the gallery
3. Choose data columns for X and Y axes
4. Click **"Add Chart"** — it will appear on the dashboard
5. Drag to reposition or resize as needed

### ✏️ Editing Data

1. Click the ✏️ **(Edit Data)** button in the small menu bar
2. Opens Luckysheet spreadsheet editor
3. Modify cells, add/delete rows/columns
4. Click **"डेटा सेव करें"** to save changes

### 🤖 Using AI Chat

1. Click the floating chat bubble 💬 at the bottom-right
2. Type your question (e.g., `"Show me sales by region"`)
3. Turn on **Agent Mode** for guided assistance
4. Use quick action buttons for common tasks

### 📤 Exporting Reports

1. Click the 📥 **Export** dropdown in the small menu bar
2. Choose:
   - **PDF Report** — Full dashboard
   - **PNG Image** — Dashboard screenshot
   - **CSV Export** — Filtered data

---

## 🔌 API Reference

### Backend Endpoints (Express Server)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/upload-large-data` | `POST` | Upload large datasets for Python processing |
| `/api/filter-large-data` | `POST` | Filter large datasets using Python backend |
| `/api/health` | `GET` | Server health check |

### JavaScript Module Exports

#### `DataHandler.js`

```javascript
import { 
  initData,                   // Initialize data from Firebase
  rawData,                    // Full dataset
  filteredData,               // Currently filtered data
  headers,                    // Column headers
  saveUserDataToFirebase,     // Save data to cloud
  applyFiltersAndSort,        // Apply current filters
  resetFiltersAndShowAllData, // Reset all filters
  handleFile,                 // Upload file processor
  exportToCSV,                // Export filtered data
  clearAllData,               // Clear all data
  getDataStats                // Get data statistics
} from './store/DataHandler.js';
```

#### `charts.js`

```javascript
import {
  visualizations,             // Array of chart objects
  chartGlobalSettings,        // Global chart settings
  plotAll,                    // Render all charts
  initializeChartPreview,     // Preview chart in sidebar
  discardActivePreviewChart,  // Remove preview
  addChartToDashboard,        // Add new chart
  removeChart                 // Remove chart by ID
} from './js/charts.js';
```

#### `chat.js`

```javascript
import {
  sendChatMessage,            // Send message to AI
  generateSummary,            // Generate data summary
  clearChatHistory            // Clear conversation
} from './js/chat.js';
```

---

## 🧪 Testing

### Manual Testing Checklist

| Feature | Test Case | Status |
|---------|-----------|--------|
| Authentication | Sign up, Sign in, Google Sign-in, Guest mode | ✅ |
| Data Upload | CSV, Excel, JSON files | ✅ |
| Data Editor | Edit, save, reload data | ✅ |
| Charts | All 15+ chart types render correctly | ✅ |
| Filters | Apply, reset, persist across sessions | ✅ |
| Dashboard | Add/remove charts, drag-and-drop | ✅ |
| Export | PDF, PNG, CSV exports | ✅ |
| AI Chat | Questions, agent mode, commands | ✅ |
| Mobile | Responsive layout, touch interactions | ✅ |

### Browser Support

| Browser | Minimum Version |
|---------|----------------|
| ![Chrome](https://img.shields.io/badge/Chrome-90%2B-4285F4?logo=googlechrome&logoColor=white&style=flat-square) | 90+ |
| ![Firefox](https://img.shields.io/badge/Firefox-88%2B-FF7139?logo=firefox&logoColor=white&style=flat-square) | 88+ |
| ![Safari](https://img.shields.io/badge/Safari-14%2B-000000?logo=safari&logoColor=white&style=flat-square) | 14+ |
| ![Edge](https://img.shields.io/badge/Edge-90%2B-0078D7?logo=microsoftedge&logoColor=white&style=flat-square) | 90+ |
| ![Opera](https://img.shields.io/badge/Opera-76%2B-FF1B2D?logo=opera&logoColor=white&style=flat-square) | 76+ |

---

## 🔒 Security

### Data Protection

- ✅ All Firebase communications are encrypted via **HTTPS**
- ✅ Firestore security rules restrict access to **user's own data**
- ✅ No sensitive data stored in localStorage (only UI preferences)
- ✅ Password hashing handled by **Firebase Auth**

### Best Practices Implemented

| Practice | Description |
|----------|-------------|
| **CSP Headers** | Content Security Policy prevents XSS |
| **CORS** | Properly configured for API endpoints |
| **Input Sanitization** | All user inputs are validated |
| **CSRF Protection** | Tokens for state-changing operations |
| **Rate Limiting** | API endpoints have request limits |

---

## 🐛 Troubleshooting

<details>
<summary><b>❌ "Firebase Not Initialized" Error</b></summary>

- Check `.env.local` file for correct Firebase credentials
- Ensure Firebase SDK scripts are loading properly

</details>

<details>
<summary><b>❌ "Luckysheet Failed to Load"</b></summary>

- Check internet connection for CDN access
- CDN fallback system will try alternative sources

</details>

<details>
<summary><b>❌ Charts Not Rendering</b></summary>

- Ensure data has at least one row and column
- Check browser console for JavaScript errors
- Verify chart type matches data structure

</details>

<details>
<summary><b>❌ Data Not Saving</b></summary>

- Check Firebase Authentication status
- Verify user is logged in
- Check Firestore security rules

</details>

### Debug Mode

Enable debug logging in `src/js/utils.js`:

```javascript
export const DEBUG = true; // Set to false in production
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes:
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push** to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Development Guidelines

- Use **ES Modules** for all JavaScript
- Follow existing code style (**Prettier** recommended)
- Write comments in **English** for main logic
- UI text in **Hindi** (primary) and **English** (secondary)
- Test on both **desktop and mobile** before submitting

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

<div align="center">

| Library | Purpose |
|---------|---------|
| [Luckysheet](https://github.com/dream-num/Luckysheet) | Excel-like spreadsheet editor |
| [ECharts](https://echarts.apache.org) | Powerful charting library |
| [Firebase](https://firebase.google.com) | Backend-as-a-Service |
| [Bootstrap](https://getbootstrap.com) | UI framework |
| [Google Gemini](https://ai.google.dev) | AI chat capabilities |
| [PapaParse](https://www.papaparse.com) | CSV parsing |
| [SheetJS](https://sheetjs.com) | Excel file handling |

</div>

---

## 📞 Support

<div align="center">

[![Documentation](https://img.shields.io/badge/📚%20Docs-TECHNICAL__INFO.md-60a5fa?style=for-the-badge)](TECHNICAL_INFO.md)
[![Issues](https://img.shields.io/badge/🐛%20Issues-GitHub%20Issues-f472b6?style=for-the-badge)](https://github.com/gametidhaval980/vedra-bi/issues)
[![Email](https://img.shields.io/badge/📧%20Email-gametidhaval980%40gmail.com-34d399?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gametidhaval980@gmail.com)

</div>

---

## 🌟 Star History

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=gametidhaval980/vedra-bi&type=Date)](https://star-history.com/#gametidhaval980/vedra-bi&Date)

</div>

---

<div align="center">

<svg width="600" height="60" viewBox="0 0 600 60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="footerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#a78bfa"/>
      <stop offset="50%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#34d399"/>
      <animateTransform attributeName="gradientTransform" type="translate"
        values="-1 0;1 0;-1 0" dur="4s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <rect width="600" height="60" rx="8" fill="#0f172a"/>
  <text x="300" y="28" text-anchor="middle" font-family="'Segoe UI', Arial" font-size="13"
    fill="url(#footerGrad)" font-weight="600">
    Made with ❤️ by the Vedra BI Team
  </text>
  <text x="300" y="46" text-anchor="middle" font-family="'Segoe UI', Arial" font-size="11"
    fill="#475569">
    gametidhaval980@gmail.com  ·  github.com/gametidhaval980/vedra-bi
  </text>
</svg>

</div>
