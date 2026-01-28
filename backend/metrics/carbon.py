"""
Carbon Emissions Calculator
Calculates CO2 emissions and savings.
"""

from typing import List, Dict


class CarbonCalculator:
    """
    Calculate carbon emissions from grid electricity.
    
    Assumes grid electricity has carbon intensity.
    Solar and battery are considered zero-emission.
    """
    
    # Default grid carbon intensity (kg CO2 per kWh)
    # US average: ~0.42 kg CO2/kWh
    # Can vary by region and time
    DEFAULT_GRID_INTENSITY = 0.42
    
    def __init__(self, grid_intensity: float = DEFAULT_GRID_INTENSITY):
        """
        Initialize carbon calculator.
        
        Args:
            grid_intensity: Grid carbon intensity in kg CO2 per kWh
        """
        self.grid_intensity = grid_intensity
    
    def calculate_hourly_emissions(
        self,
        grid_import: float,
        grid_export: float = 0.0
    ) -> Dict[str, float]:
        """
        Calculate emissions for one hour.
        
        Args:
            grid_import: Energy imported from grid (kWh)
            grid_export: Energy exported to grid (kWh) - reduces emissions
            
        Returns:
            Dictionary with emissions data
        """
        # Emissions from grid import
        import_emissions = grid_import * self.grid_intensity
        
        # Credit for grid export (avoided emissions)
        export_credit = grid_export * self.grid_intensity
        
        # Net emissions
        net_emissions = import_emissions - export_credit
        
        return {
            "import_emissions_kg": round(import_emissions, 3),
            "export_credit_kg": round(export_credit, 3),
            "net_emissions_kg": round(net_emissions, 3)
        }
    
    def calculate_total_emissions(
        self,
        hourly_results: List[Dict]
    ) -> Dict[str, float]:
        """
        Calculate total daily emissions.
        
        Args:
            hourly_results: List of hourly simulation results
            
        Returns:
            Dictionary with total emissions metrics
        """
        total_import_emissions = 0.0
        total_export_credit = 0.0
        
        for result in hourly_results:
            carbon_info = result.get("carbon", {})
            total_import_emissions += carbon_info.get("import_emissions_kg", 0.0)
            total_export_credit += carbon_info.get("export_credit_kg", 0.0)
        
        net_emissions = total_import_emissions - total_export_credit
        
        return {
            "total_import_emissions_kg": round(total_import_emissions, 2),
            "total_export_credit_kg": round(total_export_credit, 2),
            "net_emissions_kg": round(net_emissions, 2),
            "grid_intensity_kg_per_kwh": self.grid_intensity
        }
    
    def calculate_baseline_emissions(
        self,
        loads: List[float],
        solars: List[float]
    ) -> float:
        """
        Calculate baseline emissions (grid-only, no battery).
        
        Args:
            loads: Hourly load demands (kWh)
            solars: Hourly solar generation (kWh)
            
        Returns:
            Total baseline emissions (kg CO2)
        """
        total_emissions = 0.0
        
        for load, solar in zip(loads, solars):
            # Use solar first, buy rest from grid
            solar_used = min(solar, load)
            grid_needed = max(0, load - solar_used)
            
            # Only grid energy produces emissions
            emissions = grid_needed * self.grid_intensity
            total_emissions += emissions
        
        return round(total_emissions, 2)
    
    def calculate_savings(
        self,
        optimized_emissions: float,
        baseline_emissions: float
    ) -> Dict[str, float]:
        """
        Calculate emissions savings.
        
        Args:
            optimized_emissions: Emissions with battery scheduling
            baseline_emissions: Emissions without battery
            
        Returns:
            Dictionary with savings metrics
        """
        absolute_savings = baseline_emissions - optimized_emissions
        
        if baseline_emissions > 0:
            percentage_savings = (absolute_savings / baseline_emissions) * 100
        else:
            percentage_savings = 0.0
        
        return {
            "optimized_emissions_kg": round(optimized_emissions, 2),
            "baseline_emissions_kg": round(baseline_emissions, 2),
            "absolute_savings_kg": round(absolute_savings, 2),
            "percentage_savings": round(percentage_savings, 1)
        }
    
    def format_emissions(self, emissions_kg: float) -> str:
        """
        Format emissions in human-readable units.
        
        Args:
            emissions_kg: Emissions in kg CO2
            
        Returns:
            Formatted string with appropriate units
        """
        if emissions_kg < 1:
            return f"{emissions_kg * 1000:.0f} g CO2"
        elif emissions_kg < 1000:
            return f"{emissions_kg:.1f} kg CO2"
        else:
            return f"{emissions_kg / 1000:.2f} tonnes CO2"
