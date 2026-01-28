"""
Battery Energy Storage System Model
Handles battery state, constraints, and charge/discharge operations.
"""

class Battery:
    """
    Battery model with capacity, SoC constraints, and charge/discharge limits.
    
    Attributes:
        capacity: Total battery capacity (kWh)
        min_soc: Minimum state of charge (0-1)
        max_soc: Maximum state of charge (0-1)
        max_charge_rate: Maximum charging power (kW)
        max_discharge_rate: Maximum discharging power (kW)
        efficiency: Round-trip efficiency (0-1)
        current_soc: Current state of charge (kWh)
    """
    
    def __init__(
        self,
        capacity: float,
        min_soc: float = 0.2,
        max_soc: float = 0.95,
        max_charge_rate: float = 5.0,
        max_discharge_rate: float = 5.0,
        efficiency: float = 0.95,
        initial_soc: float = 0.5
    ):
        """
        Initialize battery with constraints.
        
        Args:
            capacity: Total battery capacity in kWh
            min_soc: Minimum SoC fraction (default 20% for battery health)
            max_soc: Maximum SoC fraction (default 95% for battery health)
            max_charge_rate: Max charging power in kW
            max_discharge_rate: Max discharging power in kW
            efficiency: Round-trip efficiency (0.95 = 95%)
            initial_soc: Starting SoC fraction
        """
        self.capacity = capacity
        self.min_soc = min_soc
        self.max_soc = max_soc
        self.max_charge_rate = max_charge_rate
        self.max_discharge_rate = max_discharge_rate
        self.efficiency = efficiency
        
        # Initialize current SoC
        self.current_soc = capacity * initial_soc
        
        # Validate initial state
        self._validate_soc()
    
    def _validate_soc(self):
        """Ensure SoC is within bounds."""
        min_energy = self.capacity * self.min_soc
        max_energy = self.capacity * self.max_soc
        
        if self.current_soc < min_energy:
            self.current_soc = min_energy
        elif self.current_soc > max_energy:
            self.current_soc = max_energy
    
    def get_soc_percentage(self) -> float:
        """Get current SoC as percentage (0-100)."""
        return (self.current_soc / self.capacity) * 100
    
    def get_soc_fraction(self) -> float:
        """Get current SoC as fraction (0-1)."""
        return self.current_soc / self.capacity
    
    def get_available_charge_capacity(self) -> float:
        """
        Calculate how much energy can be charged in next hour.
        
        Returns:
            Available charge capacity in kWh (limited by max_charge_rate and max_soc)
        """
        max_energy = self.capacity * self.max_soc
        available_space = max_energy - self.current_soc
        
        # Limited by both available space and max charge rate
        # Account for efficiency loss during charging
        return min(available_space / self.efficiency, self.max_charge_rate)
    
    def get_available_discharge_capacity(self) -> float:
        """
        Calculate how much energy can be discharged in next hour.
        
        Returns:
            Available discharge capacity in kWh (limited by max_discharge_rate and min_soc)
        """
        min_energy = self.capacity * self.min_soc
        available_energy = self.current_soc - min_energy
        
        # Limited by both available energy and max discharge rate
        # Efficiency loss already accounted for in stored energy
        return min(available_energy, self.max_discharge_rate)
    
    def charge(self, energy: float) -> float:
        """
        Charge battery with specified energy.
        
        Args:
            energy: Energy to charge in kWh
            
        Returns:
            Actual energy charged (may be less due to constraints)
        """
        if energy <= 0:
            return 0.0
        
        # Limit by available capacity
        max_charge = self.get_available_charge_capacity()
        actual_charge = min(energy, max_charge)
        
        # Apply efficiency loss and update SoC
        self.current_soc += actual_charge * self.efficiency
        self._validate_soc()
        
        return actual_charge
    
    def discharge(self, energy: float) -> float:
        """
        Discharge battery by specified energy.
        
        Args:
            energy: Energy to discharge in kWh
            
        Returns:
            Actual energy discharged (may be less due to constraints)
        """
        if energy <= 0:
            return 0.0
        
        # Limit by available capacity
        max_discharge = self.get_available_discharge_capacity()
        actual_discharge = min(energy, max_discharge)
        
        # Update SoC (efficiency already factored in)
        self.current_soc -= actual_discharge
        self._validate_soc()
        
        return actual_discharge
    
    def reset(self, initial_soc: float = 0.5):
        """Reset battery to initial state."""
        self.current_soc = self.capacity * initial_soc
        self._validate_soc()
    
    def get_state(self) -> dict:
        """
        Get current battery state.
        
        Returns:
            Dictionary with current battery state
        """
        return {
            "capacity_kwh": self.capacity,
            "current_soc_kwh": round(self.current_soc, 3),
            "soc_percentage": round(self.get_soc_percentage(), 1),
            "min_soc_percentage": round(self.min_soc * 100, 1),
            "max_soc_percentage": round(self.max_soc * 100, 1),
            "available_charge_capacity_kwh": round(self.get_available_charge_capacity(), 3),
            "available_discharge_capacity_kwh": round(self.get_available_discharge_capacity(), 3)
        }
