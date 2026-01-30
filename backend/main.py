"""
Microgrid Simulator + Daily Energy Scheduler
FastAPI Backend - Phase 1 (Rule-based scheduling)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
import uvicorn

# Import modules
from models.battery import Battery
from models.microgrid import Microgrid
from simulator.time_engine import TimeEngine
from simulator.energy_balance import EnergyBalance
from scheduler.rule_engine import RuleBasedScheduler
from metrics.cost import CostCalculator
from metrics.carbon import CarbonCalculator
from explainability.decision_log import DecisionLogger
from data.load_profile import get_load_profile
from data.solar_profile import get_solar_profile
from data.price_profile import get_price_profile


# Initialize FastAPI
app = FastAPI(
    title="Microgrid Simulator API",
    description="Clean, explainable, time-based microgrid simulation with rule-based scheduling",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004"
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Request models
class BatteryConfig(BaseModel):
    """Battery configuration parameters."""
    capacity: float = Field(10.0, gt=0, description="Battery capacity in kWh")
    min_soc: float = Field(0.2, ge=0, le=1, description="Minimum state of charge (0-1)")
    max_soc: float = Field(0.95, ge=0, le=1, description="Maximum state of charge (0-1)")
    max_charge_rate: float = Field(5.0, gt=0, description="Maximum charge rate in kW")
    max_discharge_rate: float = Field(5.0, gt=0, description="Maximum discharge rate in kW")
    efficiency: float = Field(0.95, ge=0, le=1, description="Round-trip efficiency (0-1)")
    initial_soc: float = Field(0.5, ge=0, le=1, description="Initial state of charge (0-1)")


class SimulationRequest(BaseModel):
    """Simulation request parameters."""
    solar_capacity: float = Field(6.0, gt=0, description="Solar PV capacity in kW")
    battery: BatteryConfig = Field(default_factory=BatteryConfig, description="Battery configuration")
    grid_carbon_intensity: float = Field(0.42, gt=0, description="Grid carbon intensity (kg CO2/kWh)")


# Response models
class HourlyResult(BaseModel):
    """Results for one hour of simulation."""
    hour: int
    time: str
    load_kwh: float
    solar_kwh: float
    battery_soc_pct: float
    grid_import_kwh: float
    grid_export_kwh: float
    battery_charge_kwh: float
    battery_discharge_kwh: float
    cost_usd: float
    emissions_kg: float
    decision_type: str
    explanation: str


class SimulationResponse(BaseModel):
    """Complete simulation results."""
    success: bool
    message: str
    config: Dict
    hourly_results: List[HourlyResult]
    summary: Dict
    baseline_total_cost: float
    optimized_total_cost: float
    total_cost_savings: float
    savings_percentage: float


# Core simulation function
def run_simulation(config: SimulationRequest) -> Dict:
    """
    Run 24-hour microgrid simulation.
    
    Args:
        config: Simulation configuration
        
    Returns:
        Dictionary with complete simulation results
    """
    # Initialize components
    battery = Battery(
        capacity=config.battery.capacity,
        min_soc=config.battery.min_soc,
        max_soc=config.battery.max_soc,
        max_charge_rate=config.battery.max_charge_rate,
        max_discharge_rate=config.battery.max_discharge_rate,
        efficiency=config.battery.efficiency,
        initial_soc=config.battery.initial_soc
    )
    
    microgrid = Microgrid(
        solar_capacity=config.solar_capacity,
        battery=battery,
        grid_connected=True
    )
    
    time_engine = TimeEngine()
    cost_calc = CostCalculator()
    carbon_calc = CarbonCalculator(grid_intensity=config.grid_carbon_intensity)
    decision_logger = DecisionLogger()
    
    # Get profiles
    loads = get_load_profile()
    solars = get_solar_profile()
    prices = get_price_profile()
    
    # Validate profiles
    assert len(loads) == 24, "Load profile must have 24 hours"
    assert len(solars) == 24, "Solar profile must have 24 hours"
    assert len(prices) == 24, "Price profile must have 24 hours"
    
    # Initialize scheduler with price profile for dynamic analysis
    scheduler = RuleBasedScheduler(price_profile=prices)
    daily_avg_price = scheduler.get_daily_avg_price()
    
    # Storage for results
    hourly_results = []
    
    # Simulate each hour
    for hour in time_engine.iterate_hours():
        load = loads[hour]
        solar = solars[hour]
        price = prices[hour]
        
        # Make scheduling decision
        decision = scheduler.schedule_hour(
            hour=hour,
            load=load,
            solar=solar,
            battery=battery,
            price=price,
            look_ahead_hours=time_engine.get_hours_remaining()
        )
        
        # Calculate energy balance
        grid_energy = EnergyBalance.calculate_required_grid(
            load=load,
            solar=solar,
            battery_discharge=decision["battery_discharge"],
            battery_charge=decision["battery_charge"]
        )
        
        energy_balance = EnergyBalance.calculate_balance(
            load=load,
            solar=solar,
            battery_charge=decision["battery_charge"],
            battery_discharge=decision["battery_discharge"],
            grid=grid_energy
        )
        
        # Calculate cost
        cost_info = cost_calc.calculate_hourly_cost(
            grid_import=energy_balance["grid_import_kwh"],
            grid_export=energy_balance["grid_export_kwh"],
            price=price
        )
        
        # Calculate emissions
        carbon_info = carbon_calc.calculate_hourly_emissions(
            grid_import=energy_balance["grid_import_kwh"],
            grid_export=energy_balance["grid_export_kwh"]
        )
        
        # Log decision
        decision_logger.log_decision(
            hour=hour,
            decision=decision,
            energy_balance=energy_balance,
            battery_soc=battery.get_soc_percentage(),
            price=price,
            load=load,
            solar=solar
        )
        
        # Store result (including decision_type from scheduler)
        hourly_results.append({
            "hour": hour,
            "load_kwh": load,
            "solar_kwh": solar,
            "price_per_kwh": price,
            "decision": decision,
            "decision_type": decision.get("decision_type", "UNKNOWN"),  # Propagate from scheduler
            "energy_balance": energy_balance,
            "cost": cost_info,
            "carbon": carbon_info,
            "battery_soc_pct": battery.get_soc_percentage()
        })
    
    # Calculate summary metrics
    total_cost_info = cost_calc.calculate_total_cost(hourly_results)
    total_carbon_info = carbon_calc.calculate_total_emissions(hourly_results)
    
    # Calculate PURE GRID-ONLY baseline (no solar, no battery, no optimization)
    baseline_cost = cost_calc.calculate_baseline_cost(loads, prices)
    
    # Optional: Calculate baseline WITH solar but WITHOUT battery (for comparison)
    baseline_with_solar_cost = cost_calc.calculate_baseline_with_solar_cost(loads, solars, prices)
    
    # Carbon baseline (grid-only scenario)
    baseline_emissions = carbon_calc.calculate_baseline_emissions(loads, solars)
    
    # Calculate savings compared to pure grid-only baseline
    cost_savings = cost_calc.calculate_savings(
        optimized_cost=total_cost_info["net_cost"],
        baseline_cost=baseline_cost
    )
    
    carbon_savings = carbon_calc.calculate_savings(
        optimized_emissions=total_carbon_info["net_emissions_kg"],
        baseline_emissions=baseline_emissions
    )
    
    # Calculate renewable usage
    total_load = sum(loads)
    total_solar = sum(solars)
    total_grid_import = total_cost_info["total_grid_import_kwh"]
    renewable_used = total_load - total_grid_import
    renewable_percentage = (renewable_used / total_load * 100) if total_load > 0 else 0
    
    return {
        "config": microgrid.get_config(),
        "hourly_results": hourly_results,
        "decisions": decision_logger.export_decisions(),
        "summary": {
            "total_load_kwh": round(total_load, 2),
            "total_solar_kwh": round(total_solar, 2),
            "renewable_usage_pct": round(renewable_percentage, 1),
            "daily_avg_price": round(daily_avg_price, 3),
            
            # Explicit baseline comparison metrics (from computed cost_savings)
            "baseline_total_cost": cost_savings["baseline_total_cost"],
            "optimized_total_cost": cost_savings["optimized_total_cost"],
            "total_cost_savings": cost_savings["total_cost_savings"],
            "savings_percentage": cost_savings["savings_percentage"],
            
            "baseline_comparison": {
                "pure_grid_only_cost": round(baseline_cost, 2),
                "with_solar_no_battery_cost": round(baseline_with_solar_cost, 2),
                "with_optimization_cost": round(total_cost_info["net_cost"], 2),
                "explanation": cost_savings.get("explanation", "")
            },
            "cost": cost_savings,
            "carbon": carbon_savings,
            "grid": {
                "total_import_kwh": total_cost_info["total_grid_import_kwh"],
                "total_export_kwh": total_cost_info["total_grid_export_kwh"]
            }
        }
    }


# API Endpoints
@app.get("/")
def read_root():
    """Root endpoint with API information."""
    return {
        "message": "Microgrid Simulator API - Phase 1",
        "version": "1.0.0",
        "endpoints": {
            "/simulate": "POST - Run 24-hour simulation",
            "/health": "GET - Health check",
            "/docs": "GET - Interactive API documentation"
        }
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Microgrid Simulator",
        "version": "1.0.0"
    }


@app.post("/simulate", response_model=SimulationResponse)
def simulate(request: SimulationRequest):
    """
    Run 24-hour microgrid simulation with rule-based scheduling.
    
    Returns complete hourly results with explainable decisions,
    cost analysis, carbon savings, and renewable usage percentage.
    """
    try:
        # Run simulation
        results = run_simulation(request)
        
        # Format hourly results for response
        hourly_response = []
        for i, result in enumerate(results["hourly_results"]):
            decision = results["decisions"][i]
            hourly_response.append(HourlyResult(
                hour=result["hour"],
                time=decision["time"],
                load_kwh=round(result["load_kwh"], 3),
                solar_kwh=round(result["solar_kwh"], 3),
                battery_soc_pct=round(result["battery_soc_pct"], 1),
                grid_import_kwh=round(result["energy_balance"]["grid_import_kwh"], 3),
                grid_export_kwh=round(result["energy_balance"]["grid_export_kwh"], 3),
                battery_charge_kwh=round(result["decision"]["battery_charge"], 3),
                battery_discharge_kwh=round(result["decision"]["battery_discharge"], 3),
                cost_usd=round(result["cost"]["net_cost"], 4),
                emissions_kg=round(result["carbon"]["net_emissions_kg"], 3),
                decision_type=result["decision_type"],  # From scheduler output
                explanation=decision["explanation"]
            ))
        
        return SimulationResponse(
            success=True,
            message="Simulation completed successfully",
            config=results["config"],
            hourly_results=hourly_response,
            summary=results["summary"],
            baseline_total_cost=results["summary"]["baseline_total_cost"],
            optimized_total_cost=results["summary"]["optimized_total_cost"],
            total_cost_savings=results["summary"]["total_cost_savings"],
            savings_percentage=results["summary"]["savings_percentage"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")


# Main entry point
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
