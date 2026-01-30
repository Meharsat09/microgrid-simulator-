# Microgrid Simulator + Daily Energy Scheduler

**Clean, explainable, time-based (24-hour) microgrid simulation backend with rule-based scheduling and optional weather uncertainty handling.**

---

## Overview

This hackathon project simulates a **grid-connected microgrid** with **solar PV, battery storage, and utility grid interaction** over a 24-hour horizon.

The system performs **hourly energy scheduling** using deterministic, rule-based logic to minimize electricity costs, maximize renewable usage, and maintain strict physical validity.

Every operational decision is logged with a **human-readable explanation**, making the simulator transparent, interpretable, and suitable for decision-support analysis.

An optional **Weather Uncertainty / Forecast Error module** introduces realistic deviations between forecasted and actual solar generation, demonstrating how microgrid controllers adapt under imperfect information.

---

## Features

- **24-hour hourly simulation** (deterministic time steps)
- **Rule-based scheduling** with clear priority logic
- **Battery management** with realistic constraints  
  (SoC limits, charge/discharge limits, efficiency)
- **Strict energy balance enforcement** at every timestep
- **Cost optimization** using Time-of-Use (TOU) pricing
- **Baseline vs optimized cost comparison**
- **Carbon emissions tracking** and savings estimation
- **Explainable AI-style decision logs** for every hour
- **FastAPI REST API** for frontend and integration
- **Optional weather uncertainty modeling** (forecast vs actual solar)

---

## Architecture


```
microgrid-simulator/
├── frontend/                          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.jsx        # Project overview, features, capabilities
│   │   │   ├── Dashboard.jsx          # Simulation results dashboard
│   │   │   ├── Charts/
│   │   │   │   ├── EnergyFlowChart.jsx
│   │   │   │   ├── BatterySoCChart.jsx
│   │   │   │   └── ForecastVsActual.jsx
│   │   │   └── Controls/
│   │   │       └── WeatherUncertaintyToggle.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── Product.jsx
│   │   ├── services/
│   │   │   └── api.js                 # REST API calls to backend
│   │   └── App.jsx
│   └── public/
│       └── videos/                    # Background & UI assets
│
├── backend/                           # FastAPI backend
│   ├── main.py                        # FastAPI app & /simulate endpoint
│   ├── models/
│   │   ├── battery.py                # Battery model with constraints
│   │   └── microgrid.py              # Microgrid system container
│   ├── simulator/
│   │   ├── time_engine.py             # 24-hour time-step manager
│   │   └── energy_balance.py          # Energy conservation validation
│   ├── scheduler/
│   │   ├── rule_engine.py             # Rule-based scheduling logic
│   │   └── optimizer.py               # Stub for Phase-2 optimization
│   ├── uncertainty/
│   │   └── weather.py                 # Forecast vs actual solar modeling
│   ├── metrics/
│   │   ├── cost.py                    # Cost calculation & savings
│   │   └── carbon.py                  # CO₂ emissions tracking
│   ├── explainability/
│   │   └── decision_log.py             # Hourly decision explanations
│   └── data/
│       ├── load_profile.py            # 24-hour load demand profile
│       ├── solar_profile.py           # Solar forecast profile
│       └── price_profile.py           # Time-of-Use grid pricing
│
└── README.md                          # Project documentation

```


---

## Scheduling Logic (Phase-1: Rule-Based)

At every hourly timestep, the controller follows this priority order:

1. **Use solar to meet local load**
2. **Charge battery** using excess solar (if SoC allows)
3. **Discharge battery** during high-price periods (if SoC allows)
4. **Import from grid** as last resort
5. **Curtail solar** if battery is full

This guarantees:
- Physical feasibility
- Cost-aware operation
- Fully explainable decisions

---

## Weather Uncertainty / Forecast Error Handling

### Concept

Real-world microgrids operate with **imperfect solar forecasts**.

This simulator optionally models that reality by separating:

- **Forecast solar generation** → used for planning decisions  
- **Actual solar generation** → used for energy balance & cost


---

### Configurable Forecast Error Levels

- ±10%  → Low uncertainty  
- ±15%  → Medium uncertainty  
- ±20%  → High uncertainty  
- ±30%  → Stress-test scenario  

---

### Operational Behavior

- Battery scheduling uses **forecast solar**
- Energy balance and cost calculations use **actual solar**
- Forecast deviations may trigger:
  - Emergency battery discharge
  - Unexpected grid import
- All corrective actions are logged transparently

---

### Logged Forecast Data (Per Hour)

```json
{
  "hour": 10,
  "forecast_solar_kwh": 3.2,
  "actual_solar_kwh": 2.6,
  "forecast_error_pct": -18.7
}
```

## Installation

```bash
# Install dependencies
pip install -r requirements.txt
```

## Usage

### Start the server

```bash
python main.py
```

Server runs at: `http://localhost:8000`

### API Documentation

Interactive docs: `http://localhost:8000/docs`

### Run simulation

```bash
# Default simulation
curl -X POST http://localhost:8000/simulate \
  -H "Content-Type: application/json" \
  -d '{}'

# Custom configuration
curl -X POST http://localhost:8000/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "solar_capacity": 6.0,
    "battery": {
      "capacity": 10.0,
      "min_soc": 0.2,
      "max_soc": 0.95,
      "initial_soc": 0.5,
      "max_charge_rate": 5.0,
      "max_discharge_rate": 5.0,
      "efficiency": 0.95
    },
    "grid_carbon_intensity": 0.42,
    "weather_uncertainty": {
      "enabled": true,
      "error_range_pct": 20
    }
  }'

```

## API Response

The `/simulate` endpoint returns:

- **hourly_results**: 24 hours of detailed data
  - Energy flows (solar, battery, grid)
  - Load demand
  - Forecast & actual solar
  - Battery charge/discharge
  - Battery SoC timeline
  - Cost per hour (₹)
  - Emissions per hour
  - Human-readable explanation
  
- **summary**: Aggregate metrics
  - Total load & solar generation
  - Total cost (optimized vs baseline) (₹)
  - Cost savings (₹, %)
  - CO2 savings (kg, %)
  - Renewable energy usage (%)
  - Total grid import/export

## Default Configuration

- **Solar**: 6 kW system
- **Battery**: 10 kWh capacity, 5 kW charge/discharge rate
- **SoC range**: 20-95% (for battery health)
- **Efficiency**: 95% round-trip
- **Grid carbon intensity**: 0.42 kg CO2/kWh (US average)

## Example Output

```json
{
  "success": true,
  "message": "Simulation completed successfully",
  "summary": {
    "total_load_kwh": 54.5,
    "total_solar_forecast_kwh": 60.2,
    "total_solar_actual_kwh": 55.6,
    "renewable_usage_pct": 74.8,
    "weather_uncertainty_enabled": true,
    "forecast_error_range_pct": 15,
    "cost": {
      "optimized_cost_inr": 232.40,  // ₹
      "baseline_cost_inr": 1041.65,  // ₹
      "absolute_savings_inr": 809.25,  // ₹
      "percentage_savings": 77.7
    },
    "carbon": {
      "optimized_emissions_kg": 9.85,
      "baseline_emissions_kg": 13.72,
      "absolute_savings_kg": 3.87,
      "percentage_savings": 28.2
    }
  },
  "hourly_results": [
    {
      "hour": 6,
      "time": "6:00 AM",
      "load_kwh": 2.0,
      "forecast_solar_kwh": 0.6,
      "actual_solar_kwh": 0.5,
      "forecast_error_pct": -16.7,
      "battery_soc_pct": 58.0,
      "grid_import_kwh": 1.5,
      "decision": "SOLAR_PLUS_GRID",
      "cost_inr": 12.45,
      "explanation": "At 6:00 AM, load is 2.00 kWh. Forecasted solar was 0.60 kWh, but actual generation dropped to 0.50 kWh due to forecast error (-16.7%). Battery discharge was avoided to preserve SoC. Remaining demand was met by grid import. Energy balanced."
    },
    {
      "hour": 12,
      "time": "12:00 PM",
      "load_kwh": 3.8,
      "forecast_solar_kwh": 5.2,
      "actual_solar_kwh": 4.6,
      "forecast_error_pct": -11.5,
      "battery_soc_pct": 95.0,
      "grid_import_kwh": 0.0,
      "decision": "SOLAR_ONLY",
      "cost_inr": -6.64,
      "explanation": "At 12:00 PM, solar generation exceeded load. Despite lower-than-forecast output, solar fully met demand and excess energy was curtailed as battery was at maximum SoC. Energy balanced."
    },
    {
      "hour": 19,
      "time": "7:00 PM",
      "load_kwh": 4.2,
      "forecast_solar_kwh": 0.4,
      "actual_solar_kwh": 0.3,
      "forecast_error_pct": -25.0,
      "battery_soc_pct": 20.0,
      "grid_import_kwh": 1.63,
      "decision": "BATTERY_PLUS_GRID",
      "cost_inr": 47.41,
      "explanation": "At 7:00 PM, solar output was significantly lower than forecast. Battery discharged to minimum SoC limit (20%). Remaining deficit was supplied by grid import due to forecast deviation. Energy balanced."
    }
    // ... remaining hours (0–23)
  ]
}

```

## Key Assumptions

- **Decision support simulator**, not a detailed power-flow solver
- **Hourly time steps** (1-hour energy quantities)
- **Perfect forecasts** (solar, load, price known in advance)
- **No grid export limits** (net metering assumed)
- **Linear battery efficiency** (no degradation over 24 hours)
- **Deterministic profiles** (no stochasticity)

## Technology Stack

- **Python 3.10+**
- **FastAPI** - Modern web framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **No database** - Stateless simulation
- **No external APIs** - Self-contained

## Future Enhancements 

- Optimization-based scheduling (LP, MPC, DP)
- Multi-day simulation
- Weather uncertainty
- Demand response integration
- Real-time price forecasting
- Multiple battery units
- EV charging integration

## License

This is a hackathon project for educational purposes.

## Contact

Project: Microgrid Simulator Control System
Event: VLabs Hackathon 2026
