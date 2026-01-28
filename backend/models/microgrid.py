"""
Microgrid Model
Represents the complete microgrid system including solar, battery, load, and grid connection.
"""

from models.battery import Battery


class Microgrid:
    """
    Microgrid system model.
    
    Components:
    - Solar PV system
    - Battery storage
    - Load demand
    - Grid connection
    
    This is a container class that holds configuration and state.
    """
    
    def __init__(
        self,
        solar_capacity: float,
        battery: Battery,
        grid_connected: bool = True
    ):
        """
        Initialize microgrid system.
        
        Args:
            solar_capacity: Solar PV system capacity in kW
            battery: Battery object with constraints
            grid_connected: Whether grid connection is available
        """
        self.solar_capacity = solar_capacity
        self.battery = battery
        self.grid_connected = grid_connected
        
    def get_config(self) -> dict:
        """
        Get microgrid configuration.
        
        Returns:
            Dictionary with system configuration
        """
        return {
            "solar_capacity_kw": self.solar_capacity,
            "battery_capacity_kwh": self.battery.capacity,
            "battery_max_charge_rate_kw": self.battery.max_charge_rate,
            "battery_max_discharge_rate_kw": self.battery.max_discharge_rate,
            "battery_efficiency": self.battery.efficiency,
            "battery_min_soc": self.battery.min_soc,
            "battery_max_soc": self.battery.max_soc,
            "grid_connected": self.grid_connected
        }
    
    def reset(self):
        """Reset microgrid to initial state."""
        self.battery.reset()
