# Weather Uncertainty / Forecast Error Feature

## Overview
This feature adds realistic weather forecast uncertainty to the microgrid simulator, making it more representative of real-world operations where solar generation forecasts are never 100% accurate.

## Key Features

### 1. **Optional Activation**
- Weather uncertainty is **disabled by default**
- Existing deterministic simulation behavior is preserved when OFF
- No breaking changes to existing functionality

### 2. **Realistic Forecast Modeling**
The simulator now models two separate values for solar generation:
- **Forecast Solar**: What the system *predicts* will be available (used for scheduling decisions)
- **Actual Solar**: What *actually* happens (used for energy balance calculations)

### 3. **Statistical Error Generation**
- Uses normal distribution (`random.normalvariate(0, σ)`) for realistic forecast errors
- Configurable error range: ±10%, ±15%, ±20%, ±30%
- Errors are independent for each hour, simulating realistic forecast variability

### 4. **Decision Impact Tracking**
- System detects when forecast errors > 5% cause operational changes
- **Forecast corrections** are logged in the Decision Timeline
- Visual warnings highlight hours where forecasts led to suboptimal decisions

## How It Works

### Backend Logic (main.py)

```python
# Planning Phase (uses forecast)
forecast_solar = base_solar * (1 + random.normalvariate(0, σ))
decision = optimize_schedule_based_on(forecast_solar)

# Reality Phase (uses actual)
actual_solar = base_solar * (1 + random.normalvariate(0, σ))
energy_balance = calculate_using(actual_solar)

# Detect corrections
if abs(forecast_solar - actual_solar) / actual_solar > 0.05:
    log_forecast_correction()
```

### Frontend Components

1. **Weather Uncertainty Controls** (Dashboard.jsx)
   - Checkbox: Enable/Disable feature
   - Dropdown: Select error range (±10% to ±30%)
   - Apply button: Refresh simulation with new settings

2. **Solar Forecast vs Actual Chart** (SolarForecastChart.jsx)
   - **Yellow dashed line**: Forecast (what was predicted)
   - **Amber solid line**: Actual (what happened)
   - Custom tooltip showing forecast, actual, and error %
   - Only visible when weather uncertainty is enabled

3. **Decision Timeline Warnings** (DecisionTimeline.jsx)
   - Amber warning icon appears for hours with significant forecast errors
   - Shows "Forecast Correction" message explaining the impact
   - Helps identify when poor forecasts led to suboptimal decisions

## Usage Instructions

### For Users:
1. Check "Enable Weather Uncertainty" in the top controls panel
2. Select desired error range (±15% is realistic for day-ahead solar forecasts)
3. Click "Apply" to run new simulation
4. Observe the "Solar Forecast vs Actual" chart to see divergence
5. Check Decision Timeline for amber warnings showing forecast corrections

### For Developers:
- Backend API accepts: `enable_weather_uncertainty` (bool) and `forecast_error_range` (float 0-0.5)
- Hourly results include: `forecast_solar_kwh`, `actual_solar_kwh`, `forecast_error_pct`, `forecast_correction`
- All fields are optional - missing when feature is disabled
- Backward compatible: existing clients see no changes

## Real-World Accuracy

Typical solar forecast accuracy:
- **Day-ahead forecasts**: ±10-20% RMSE (Root Mean Square Error)
- **Intraday forecasts**: ±5-15% RMSE
- **Hour-ahead forecasts**: ±3-10% RMSE

The ±15% default setting represents realistic day-ahead forecast uncertainty.

## Technical Details

### Data Flow
```
Backend generates → forecast_solar (for decisions) & actual_solar (for reality)
                 ↓
Frontend receives → hourly_results with both values
                 ↓
Dashboard renders → SolarForecastChart (visualization)
                 ↓
DecisionTimeline → Shows warnings when |error| > 5%
```

### Styling Consistency
- Uses existing SCADA theme colors (#F59E0B amber)
- Matches chart styling (dark background, amber axes)
- Consistent section borders and shadows
- No changes to existing components when feature is OFF

## Benefits

1. **Educational**: Shows impact of forecast uncertainty on operations
2. **Realistic**: Better represents real-world grid operations
3. **Safe**: No breaking changes, optional activation
4. **Visual**: Clear visualization of forecast vs reality
5. **Actionable**: Highlights specific hours where forecasts caused issues

## Future Enhancements (Optional)
- Add temporal correlation (consecutive hours have related errors)
- Support different error distributions (Laplace, Beta)
- Include weather-dependent error ranges (cloudy days = higher uncertainty)
- Add forecast skill metrics (RMSE, MAE, R²)
