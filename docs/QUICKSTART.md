# Quick Start Guide

## Installation & Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Test Components

```bash
python test_components.py
```

Expected output: All components should pass ✓

### 3. Start the Server

```bash
python main.py
```

Server will start at: `http://localhost:8000`

### 4. Test the API

#### Option A: Using the browser

Visit: `http://localhost:8000/docs`

Click on `/simulate` → "Try it out" → "Execute"

#### Option B: Using curl

```bash
curl -X POST http://localhost:8000/simulate \
  -H "Content-Type: application/json" \
  -d '{}'
```

#### Option C: Using Python

```python
import requests

response = requests.post(
    "http://localhost:8000/simulate",
    json={}
)

print(response.json())
```

## API Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `POST /simulate` - Run 24-hour simulation
- `GET /docs` - Interactive documentation

## Example Request

```json
{
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
}
```

## What to Expect

The simulation returns:
- 24 hours of detailed results
- Energy flows per hour
- Battery state timeline
- Cost breakdown
- CO2 emissions
- Human-readable explanations
- Summary with savings metrics

## Troubleshooting

### Import Errors

Make sure you're in the project root directory:
```bash
cd c:\Users\mehar\OneDrive\Desktop\Vlabs_hack
```

### Port Already in Use

Change the port in [main.py](main.py):
```python
uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
```

### Missing Dependencies

Reinstall:
```bash
pip install --upgrade -r requirements.txt
```

## Next Steps for Hackathon Demo

1. **Test different scenarios**:
   - Large battery vs small battery
   - High solar capacity
   - Different price thresholds

2. **Analyze results**:
   - Cost savings percentage
   - Renewable usage percentage
   - CO2 reduction

3. **Prepare demo**:
   - Show before/after comparison
   - Highlight explainability feature
   - Show hour-by-hour decisions

4. **Future improvements** (if time permits):
   - Add more realistic load profiles
   - Implement demand response
   - Add optimization-based scheduling (Phase-2)

## Architecture Overview

```
Data Profiles → Scheduler → Simulator → Metrics → API Response
     ↓              ↓           ↓          ↓
   24-hr        Rule-based   Energy    Cost &
   patterns     decisions    balance   Carbon
```

## Key Features for Demo

✅ **Explainable AI**: Every hour has human-readable explanation
✅ **Energy Balance**: Verified at every time step
✅ **Cost Savings**: Quantified vs baseline
✅ **Carbon Impact**: CO2 reduction calculated
✅ **Clean Code**: Modular, documented, hackathon-friendly

Good luck with your hackathon! 🚀
