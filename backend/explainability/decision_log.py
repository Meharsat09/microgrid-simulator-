"""
Decision Logger
Creates human-readable explanations for scheduling decisions.
"""

from typing import Dict, List


class DecisionLogger:
    """
    Logs and formats explainable decisions for each time step.
    """
    
    def __init__(self):
        """Initialize decision logger."""
        self.decisions = []
    
    def log_decision(
        self,
        hour: int,
        decision: Dict,
        energy_balance: Dict,
        battery_soc: float,
        price: float,
        load: float,
        solar: float
    ):
        """
        Log a decision for one hour.
        
        Args:
            hour: Hour number (0-23)
            decision: Scheduling decision dictionary
            energy_balance: Energy balance dictionary
            battery_soc: Battery state of charge (%)
            price: Grid price ($/kWh)
            load: Load demand (kWh)
            solar: Solar generation (kWh)
        """
        # Create explanation
        explanation = self._create_explanation(
            hour, decision, energy_balance, battery_soc, price, load, solar
        )
        
        self.decisions.append({
            "hour": hour,
            "explanation": explanation,
            "decision_reason": decision.get("decision_reason", ""),
            "battery_soc_pct": round(battery_soc, 1),
            "price_per_kwh": round(price, 3)
        })
    
    def _create_explanation(
        self,
        hour: int,
        decision: Dict,
        energy_balance: Dict,
        battery_soc: float,
        price: float,
        load: float,
        solar: float
    ) -> str:
        """
        Create human-readable explanation.
        
        Args:
            hour: Hour number
            decision: Decision dictionary
            energy_balance: Energy balance dictionary
            battery_soc: Battery SoC (%)
            price: Grid price
            load: Load demand
            solar: Solar generation
            
        Returns:
            Human-readable explanation string
        """
        time_str = self._format_hour(hour)
        
        # Build explanation parts
        parts = []
        
        # Load and solar situation
        parts.append(f"At {time_str}, load is {load:.2f} kWh and solar is {solar:.2f} kWh.")
        
        # Energy flow summary
        solar_to_load = decision.get("solar_to_load", 0)
        battery_charge = decision.get("battery_charge", 0)
        battery_discharge = decision.get("battery_discharge", 0)
        grid_import = energy_balance.get("grid_import_kwh", 0)
        
        if solar_to_load > 0:
            parts.append(f"Solar directly meets {solar_to_load:.2f} kWh of load.")
        
        if battery_charge > 0:
            parts.append(f"Charging battery with {battery_charge:.2f} kWh.")
        
        if battery_discharge > 0:
            parts.append(f"Discharging {battery_discharge:.2f} kWh from battery.")
        
        if grid_import > 0:
            parts.append(f"Importing {grid_import:.2f} kWh from grid at ${price:.3f}/kWh.")
        
        # Battery state
        parts.append(f"Battery SoC: {battery_soc:.1f}%.")
        
        # Energy balance check
        if energy_balance.get("balanced", False):
            parts.append("Energy balanced.")
        else:
            parts.append(f"⚠️ Balance error: {energy_balance.get('balance_error_kwh', 0):.3f} kWh")
        
        return " ".join(parts)
    
    def _format_hour(self, hour: int) -> str:
        """
        Format hour as readable time.
        
        Args:
            hour: Hour (0-23)
            
        Returns:
            Formatted time string (e.g., "8:00 AM")
        """
        if hour == 0:
            return "12:00 AM"
        elif hour < 12:
            return f"{hour}:00 AM"
        elif hour == 12:
            return "12:00 PM"
        else:
            return f"{hour - 12}:00 PM"
    
    def get_all_decisions(self) -> List[Dict]:
        """
        Get all logged decisions.
        
        Returns:
            List of decision dictionaries
        """
        return self.decisions
    
    def get_summary(self) -> str:
        """
        Get summary of all decisions.
        
        Returns:
            Summary string
        """
        if not self.decisions:
            return "No decisions logged."
        
        summary_parts = [
            f"Total hours simulated: {len(self.decisions)}",
            f"Decision log available for hours 0-{len(self.decisions)-1}"
        ]
        
        return "\n".join(summary_parts)
    
    def reset(self):
        """Clear all logged decisions."""
        self.decisions = []
    
    def export_decisions(self) -> List[Dict]:
        """
        Export decisions in structured format for API response.
        
        Returns:
            List of decision records
        """
        return [
            {
                "hour": d["hour"],
                "time": self._format_hour(d["hour"]),
                "explanation": d["explanation"],
                "decision_reason": d["decision_reason"],
                "battery_soc_pct": d["battery_soc_pct"],
                "price_per_kwh": d["price_per_kwh"]
            }
            for d in self.decisions
        ]
