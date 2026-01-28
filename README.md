# Microgrid Simulator + Daily Energy Scheduler

**Clean, explainable, time-based (24-hour) microgrid simulation backend with rule-based scheduling.**

## Overview

This hackathon project simulates a microgrid with solar panels, battery storage, and grid connection over 24 hours. It uses rule-based scheduling to minimize electricity costs and maximize renewable energy usage while providing explainable decisions for every hour.

## Features

- ✅ **24-hour hourly simulation** (deterministic, no randomness)
- ✅ **Rule-based scheduling** with clear priority logic
- ✅ **Battery management** with realistic constraints (SoC, charge/discharge limits)
- ✅ **Energy balance** verification at every time step
- ✅ **Cost optimization** with Time-of-Use pricing
- ✅ **Carbon emissions tracking** and savings calculation
- ✅ **Explainable AI** - human-readable decision explanations for each hour
- ✅ **FastAPI REST API** for easy integration

## Architecture

```
backend/
├── main.py                    # FastAPI application & /simulate endpoint
├── models/
│   ├── battery.py            # Battery model with constraints
│   └── microgrid.py          # Microgrid system container
├── simulator/
│   ├── time_engine.py        # 24-hour time step manager
│   └── energy_balance.py     # Energy conservation calculator
├── scheduler/
│   ├── rule_engine.py        # Rule-based scheduling logic
│   └── optimizer.py          # Stub for Phase-2 optimization
├── metrics/
│   ├── cost.py               # Cost calculation & savings
│   └── carbon.py             # CO2 emissions tracking
├── explainability/
│   └── decision_log.py       # Human-readable decision explanations
└── data/
    ├── load_profile.py       # 24-hour load demand profile
    ├── solar_profile.py      # 24-hour solar generation profile
    └── price_profile.py      # 24-hour grid price profile (TOU)
```

## Scheduling Logic (Phase-1: Rule-Based)

Priority order:
1. **Use solar to meet load** (renewable first)
2. **Charge battery** with excess solar
3. **Discharge battery** during high-price hours (if SoC allows)
4. **Import from grid** as last resort
5. **Curtail solar** if battery is full

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
    "high_price_threshold": 0.20,
    "grid_carbon_intensity": 0.42
  }'
```

## API Response

The `/simulate` endpoint returns:

- **hourly_results**: 24 hours of detailed data
  - Energy flows (solar, battery, grid)
  - Battery SoC timeline
  - Cost per hour
  - Emissions per hour
  - Human-readable explanation
  
- **summary**: Aggregate metrics
  - Total cost (optimized vs baseline)
  - Cost savings ($, %)
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
    "total_solar_kwh": 60.2,
    "renewable_usage_pct": 78.5,
    "cost": {
      "optimized_cost": 6.42,
      "baseline_cost": 8.95,
      "absolute_savings": 2.53,
      "percentage_savings": 28.3
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
      "hour": 0,
      "time": "12:00 AM",
      "load_kwh": 0.8,
      "solar_kwh": 0.0,
      "battery_soc_pct": 45.2,
      "explanation": "At 12:00 AM, load is 0.80 kWh and solar is 0.00 kWh. Discharging 0.80 kWh from battery due to load deficit (SoC: 45.2%). Battery SoC: 45.2%. Energy balanced."
    }
    // ... 23 more hours
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

## Future Enhancements (Phase-2)

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

Built for VLabs Hackathon 2026
