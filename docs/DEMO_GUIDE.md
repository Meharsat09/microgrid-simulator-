# 🔋 Microgrid Simulator + Daily Energy Scheduler

## 🚀 Quick Start

### Backend (FastAPI)
```bash
# Already running at http://localhost:8000
python main.py
```

### Frontend (React Dashboard)
```bash
# Already running at http://localhost:3000
cd frontend
npm run dev
```

## 📊 Access the Dashboard

**Frontend Dashboard:** http://localhost:3000  
**Backend API Docs:** http://localhost:8000/docs

## ✨ Features

### Dashboard Components

1. **Summary Cards** (Top)
   - 📉 Baseline Cost (grid-only)
   - 📊 Optimized Cost (with microgrid)
   - 💰 Total Savings (in $)
   - 📈 Savings Percentage (%)

2. **Battery State of Charge Chart**
   - Line chart showing battery SoC (0-100%) across 24 hours
   - Blue line with data points

3. **Energy Usage Chart**
   - Stacked bar chart showing energy sources per hour
   - 🟡 Yellow: Solar
   - 🟠 Orange: Battery
   - ⚫ Gray: Grid

4. **Decision Timeline Table**
   - Color-coded hourly decisions
   - Explanations for each decision
   - Cost breakdown per hour

## 🎨 Color Coding

- **GRID_SUPPLY** → Gray (no alternative available)
- **SOLAR_ONLY** → Yellow (100% renewable)
- **SOLAR_TO_BATTERY** → Green (storing excess solar)
- **BATTERY_DISCHARGE** → Orange (using stored energy)
- **SOLAR_AND_BATTERY** → Blue (combined sources)
- **SOLAR_AND_GRID** → Purple (grid supplement)

## 📡 API Integration

The dashboard automatically fetches from:
- **Endpoint:** POST http://localhost:8000/simulate
- **Response includes:**
  - `baseline_total_cost` (top-level field)
  - `optimized_total_cost` (top-level field)
  - `total_cost_savings` (top-level field)
  - `savings_percentage` (top-level field)
  - `hourly_results` (24 hours of data)
  - `summary` (aggregate metrics)

## 🔧 Tech Stack

### Backend
- FastAPI 0.115.0
- Python 3.13
- Rule-based scheduling (deterministic)
- Modular architecture

### Frontend
- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- Recharts (visualization)
- Axios (API calls)

## 🎯 For Hackathon Judges

The dashboard provides:
- ✅ Clear cost comparison (baseline vs optimized)
- ✅ Visual energy flow representation
- ✅ Explainable AI decisions
- ✅ Real-time data from backend
- ✅ Clean, professional UI
- ✅ No mocked data (all API-driven)

## 🔄 Refresh Data

Click **"Run New Simulation"** button at the bottom to fetch fresh data.

## 📝 Notes

- Backend must be running before frontend
- CORS is enabled for local development
- Auto-reload enabled for both servers
- No authentication required (hackathon demo)

## 🐛 Troubleshooting

**Frontend can't connect to backend:**
- Verify backend is running at http://localhost:8000
- Check browser console for CORS errors

**Backend errors:**
- Check all Python dependencies are installed: `pip install -r requirements.txt`
- Verify Python 3.13 is active

**Charts not displaying:**
- Ensure data is loading (check Network tab)
- Verify API response structure matches expected format

## 🎓 Project Structure

```
Vlabs_hack/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── models/                 # Battery, Microgrid
├── simulator/              # Time engine, Energy balance
├── scheduler/              # Rule-based scheduling
├── metrics/                # Cost, Carbon calculations
├── explainability/         # Decision logging
├── data/                   # Load, Solar, Price profiles
└── frontend/               # React dashboard
    ├── src/
    │   ├── components/     # Dashboard, Charts, Cards
    │   ├── services/       # API integration
    │   └── App.jsx
    └── package.json
```

## 🏆 Demo Ready!

Both servers are running and ready for demonstration.
Open http://localhost:3000 to view the dashboard.
