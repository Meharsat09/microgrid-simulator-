# Microgrid Simulator Dashboard

Interactive React dashboard for visualizing 24-hour microgrid simulation results.

## Features

- **Summary Cards**: Baseline vs optimized cost comparison
- **Battery SoC Chart**: Line chart showing battery state of charge
- **Energy Usage Chart**: Stacked bar chart showing energy sources per hour
- **Decision Timeline**: Color-coded table of hourly scheduling decisions

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser at http://localhost:3000

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Recharts
- Axios

## API Integration

Dashboard fetches data from:
- POST http://localhost:8000/simulate

Make sure the backend server is running before starting the frontend.

## Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```
