"""
Energy Balance Calculator
Ensures energy conservation at every time step.
"""

from typing import Dict


class EnergyBalance:
    """
    Calculates energy flows and ensures balance at each hour.
    
    Energy Balance Equation:
    Load = Solar + Battery_Discharge - Battery_Charge + Grid
    
    Or rearranged:
    Grid = Load - Solar - Battery_Discharge + Battery_Charge
    """
    
    @staticmethod
    def calculate_balance(
        load: float,
        solar: float,
        battery_charge: float,
        battery_discharge: float,
        grid: float
    ) -> Dict[str, float]:
        """
        Calculate energy balance and verify conservation.
        
        Args:
            load: Energy demand (kWh)
            solar: Solar generation (kWh)
            battery_charge: Energy charged to battery (kWh)
            battery_discharge: Energy discharged from battery (kWh)
            grid: Grid import (positive) or export (negative) (kWh)
            
        Returns:
            Dictionary with energy flows and balance check
        """
        # Energy supplied
        supply = solar + battery_discharge + max(0, grid)
        
        # Energy consumed
        consumption = load + battery_charge + abs(min(0, grid))
        
        # Balance error (should be near zero)
        balance_error = supply - consumption
        
        return {
            "load_kwh": round(load, 3),
            "solar_kwh": round(solar, 3),
            "battery_charge_kwh": round(battery_charge, 3),
            "battery_discharge_kwh": round(battery_discharge, 3),
            "grid_import_kwh": round(max(0, grid), 3),
            "grid_export_kwh": round(abs(min(0, grid)), 3),
            "net_grid_kwh": round(grid, 3),
            "total_supply_kwh": round(supply, 3),
            "total_consumption_kwh": round(consumption, 3),
            "balance_error_kwh": round(balance_error, 3),
            "balanced": abs(balance_error) < 0.001  # Tolerance for floating point
        }
    
    @staticmethod
    def calculate_required_grid(
        load: float,
        solar: float,
        battery_discharge: float,
        battery_charge: float
    ) -> float:
        """
        Calculate required grid energy to balance the system.
        
        Args:
            load: Energy demand (kWh)
            solar: Solar generation (kWh)
            battery_discharge: Energy discharged from battery (kWh)
            battery_charge: Energy charged to battery (kWh)
            
        Returns:
            Required grid energy (positive = import, negative = export)
        """
        # Grid must make up the difference
        grid = load + battery_charge - solar - battery_discharge
        
        return round(grid, 3)
    
    @staticmethod
    def validate_flows(
        solar: float,
        battery_charge: float,
        battery_discharge: float,
        grid: float
    ) -> bool:
        """
        Validate that energy flows are physically possible.
        
        Args:
            solar: Solar generation (kWh)
            battery_charge: Battery charge (kWh)
            battery_discharge: Battery discharge (kWh)
            grid: Grid import/export (kWh)
            
        Returns:
            True if flows are valid
        """
        # Check non-negative (except grid can be negative for export)
        if solar < 0 or battery_charge < 0 or battery_discharge < 0:
            return False
        
        # Battery cannot charge and discharge simultaneously
        if battery_charge > 0 and battery_discharge > 0:
            return False
        
        return True
    
    @staticmethod
    def calculate_renewable_usage(
        solar_used: float,
        battery_discharge: float,
        total_load: float
    ) -> float:
        """
        Calculate percentage of load met by renewable sources.
        
        Args:
            solar_used: Solar energy used directly (kWh)
            battery_discharge: Battery discharge (stored solar) (kWh)
            total_load: Total load (kWh)
            
        Returns:
            Renewable percentage (0-100)
        """
        if total_load <= 0:
            return 0.0
        
        renewable_energy = solar_used + battery_discharge
        percentage = (renewable_energy / total_load) * 100
        
        return min(100.0, round(percentage, 1))
