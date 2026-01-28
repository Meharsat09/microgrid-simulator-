"""
Rule-Based Scheduler
Implements explainable, data-driven scheduling logic.

Key Principles:
- NO hard-coded hour-based decisions
- Dynamic price analysis (compare to daily average)
- Battery discharged only when price > average
- Grid preferred during low-price periods
- Solar always used first
"""

from typing import Dict, List
from models.battery import Battery


class RuleBasedScheduler:
    """
    Data-driven rule-based energy scheduler with explainable decisions.
    
    Decision Logic:
    1. ALWAYS use solar to meet load first (renewable priority)
    2. Store excess solar in battery (if space available)
    3. For remaining load deficit:
       - If price > daily_avg: Discharge battery (save money)
       - If price <= daily_avg: Use grid (preserve battery for expensive hours)
    4. Grid is used as needed based on economic optimization
    
    All decisions are data-driven and explainable.
    """
    
    def __init__(self, price_profile: List[float] = None):
        """
        Initialize scheduler with price awareness.
        
        Args:
            price_profile: Optional 24-hour price profile for computing daily average.
                          If not provided, average will be computed on first call.
        """
        self.price_profile = price_profile
        self.daily_avg_price = None
        
        # Compute daily average if profile provided
        if price_profile and len(price_profile) == 24:
            self.daily_avg_price = sum(price_profile) / len(price_profile)
    
    def set_price_profile(self, price_profile: List[float]):
        """
        Set or update the price profile and compute daily average.
        
        Args:
            price_profile: 24-hour price profile ($/kWh)
        """
        if len(price_profile) != 24:
            raise ValueError("Price profile must have exactly 24 hours")
        
        self.price_profile = price_profile
        self.daily_avg_price = sum(price_profile) / len(price_profile)
    
    def get_daily_avg_price(self) -> float:
        """Get the computed daily average price."""
        if self.daily_avg_price is None:
            raise ValueError("Price profile not set. Call set_price_profile() first.")
        return self.daily_avg_price
    
    def schedule_hour(
        self,
        hour: int,
        load: float,
        solar: float,
        battery: Battery,
        price: float,
        look_ahead_hours: int = 0
    ) -> Dict:
        """
        Make data-driven scheduling decision for one hour.
        
        Args:
            hour: Current hour (0-23) - used only for logging, NOT for decisions
            load: Load demand (kWh)
            solar: Solar generation (kWh)
            battery: Battery object
            price: Current grid price ($/kWh)
            look_ahead_hours: Hours remaining in simulation (not used in Phase-1)
            
        Returns:
            Dictionary with scheduling decisions and explanations:
            - solar_used_kwh: Solar energy used
            - battery_charged_kwh: Energy charged to battery
            - battery_discharged_kwh: Energy discharged from battery
            - grid_used_kwh: Grid energy imported
            - solar_curtailed_kwh: Solar energy wasted
            - decision_type: Type of decision made
            - explanation: List of human-readable decision reasons
            - (legacy fields for backward compatibility)
        """
        if self.daily_avg_price is None:
            raise ValueError(
                "Daily average price not computed. "
                "Call set_price_profile() before scheduling."
            )
        
        # Initialize decision tracking
        explanation = []
        decision_type = "UNKNOWN"
        
        # Track energy flows
        solar_used = 0.0
        battery_charged = 0.0
        battery_discharged = 0.0
        grid_used = 0.0
        solar_curtailed = 0.0
        
        # Get current battery state
        battery_soc_pct = battery.get_soc_percentage()
        available_discharge = battery.get_available_discharge_capacity()
        available_charge = battery.get_available_charge_capacity()
        
        # Classify current price relative to daily average
        price_relative = (price - self.daily_avg_price) / self.daily_avg_price * 100
        is_expensive = price > self.daily_avg_price
        is_cheap = price <= self.daily_avg_price
        
        explanation.append(
            f"Grid price: ${price:.3f}/kWh "
            f"(daily avg: ${self.daily_avg_price:.3f}/kWh, "
            f"{'+' if price_relative >= 0 else ''}{price_relative:.1f}%)"
        )
        
        # =====================================================================
        # RULE 1: ALWAYS use solar to meet load first (renewable priority)
        # =====================================================================
        solar_used = min(solar, load)
        remaining_load = load - solar_used
        remaining_solar = solar - solar_used
        
        if solar_used > 0:
            explanation.append(
                f"Solar directly supplies {solar_used:.2f} kWh to load "
                f"(renewable priority)"
            )
        
        # =====================================================================
        # RULE 2: Store excess solar in battery (if space available)
        # =====================================================================
        if remaining_solar > 0 and available_charge > 0:
            battery_charged = min(remaining_solar, available_charge)
            actual_charged = battery.charge(battery_charged)
            battery_charged = actual_charged
            remaining_solar -= battery_charged
            
            explanation.append(
                f"Excess solar charges battery: {battery_charged:.2f} kWh "
                f"(SoC: {battery_soc_pct:.1f}% → {battery.get_soc_percentage():.1f}%)"
            )
        
        # =====================================================================
        # RULE 3: Curtail remaining solar if battery is full
        # =====================================================================
        if remaining_solar > 0:
            solar_curtailed = remaining_solar
            explanation.append(
                f"Solar curtailed: {solar_curtailed:.2f} kWh (battery full, no load)"
            )
        
        # =====================================================================
        # RULE 4: Handle load deficit with SMART battery/grid strategy
        # =====================================================================
        if remaining_load > 0:
            # Decision logic based on price and battery availability
            if is_expensive and available_discharge > 0:
                # EXPENSIVE PERIOD: Discharge battery to avoid high grid costs
                battery_discharged = min(remaining_load, available_discharge)
                actual_discharged = battery.discharge(battery_discharged)
                battery_discharged = actual_discharged
                remaining_load -= battery_discharged
                
                explanation.append(
                    f"Battery discharges {battery_discharged:.2f} kWh "
                    f"(EXPENSIVE grid @ ${price:.3f}/kWh > avg ${self.daily_avg_price:.3f}/kWh)"
                )
                explanation.append(
                    f"Battery SoC after discharge: {battery.get_soc_percentage():.1f}%"
                )
                
            elif is_cheap:
                # CHEAP PERIOD: Use grid, preserve battery for expensive hours
                explanation.append(
                    f"Using grid instead of battery "
                    f"(CHEAP period: ${price:.3f}/kWh <= avg ${self.daily_avg_price:.3f}/kWh)"
                )
                explanation.append(
                    f"Preserving battery (SoC: {battery_soc_pct:.1f}%) for expensive periods"
                )
            
            else:
                # EXPENSIVE but battery empty/unavailable
                explanation.append(
                    f"Battery unavailable "
                    f"(SoC: {battery_soc_pct:.1f}%, available: {available_discharge:.2f} kWh)"
                )
            
            # Use grid for any remaining load
            if remaining_load > 0:
                grid_used = remaining_load
                explanation.append(
                    f"Grid supplies remaining {grid_used:.2f} kWh at ${price:.3f}/kWh"
                )
        
        # =====================================================================
        # Determine decision type based on actual energy flows (for visualization)
        # Decision type is inferred dynamically from the final state, NOT hardcoded
        # =====================================================================
        
        # Priority-based classification (check most specific conditions first)
        if battery_discharged > 0:
            # Battery was discharged to meet load (may also have solar/grid)
            decision_type = "BATTERY_DISCHARGE"
        
        elif battery_charged > 0:
            # Excess solar stored in battery
            decision_type = "SOLAR_TO_BATTERY"
        
        elif solar_used > 0 and grid_used > 0:
            # Both solar and grid used (solar insufficient alone)
            decision_type = "SOLAR_PLUS_GRID"
        
        elif grid_used > 0 and battery_discharged == 0:
            # Only grid used (no solar, or solar curtailed, battery not discharged)
            decision_type = "GRID_SUPPLY"
        
        elif solar_used > 0 and grid_used == 0 and battery_discharged == 0:
            # Solar met entire load, no battery/grid needed
            decision_type = "SOLAR_ONLY"
        
        else:
            # Edge case fallback (e.g., zero load)
            decision_type = "NO_FLOW"
        
        # Add decision summary
        explanation.insert(
            0,
            f"Decision: {decision_type} | Load: {load:.2f} kWh, Solar: {solar:.2f} kWh"
        )
        
        # Return structured decision with both new and legacy formats
        return {
            # New structured format
            "solar_used_kwh": round(solar_used, 3),
            "battery_charged_kwh": round(battery_charged, 3),
            "battery_discharged_kwh": round(battery_discharged, 3),
            "grid_used_kwh": round(grid_used, 3),
            "solar_curtailed_kwh": round(solar_curtailed, 3),
            "decision_type": decision_type,
            "explanation": explanation,
            
            # Legacy format for backward compatibility
            "solar_to_load": round(solar_used, 3),
            "solar_to_battery": round(battery_charged, 3),
            "solar_curtailed": round(solar_curtailed, 3),
            "battery_to_load": round(battery_discharged, 3),
            "grid_to_load": round(grid_used, 3),
            "grid_export": 0.0,  # Not implemented in Phase-1
            "battery_charge": round(battery_charged, 3),
            "battery_discharge": round(battery_discharged, 3),
            "decision_reason": " | ".join(explanation)
        }
    
    def calculate_baseline_grid(
        self,
        load: float,
        solar: float
    ) -> float:
        """
        Calculate baseline grid usage (no battery, solar used directly).
        
        Args:
            load: Load demand (kWh)
            solar: Solar generation (kWh)
            
        Returns:
            Grid energy required (kWh)
        """
        # Simple baseline: use solar first, then grid
        solar_used = min(solar, load)
        grid_needed = max(0, load - solar_used)
        
        return round(grid_needed, 3)
