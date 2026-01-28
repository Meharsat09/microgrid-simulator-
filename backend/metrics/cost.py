"""
Cost Calculator
Calculates electricity costs and savings.
"""

from typing import List, Dict


class CostCalculator:
    """
    Calculate electricity costs for different scenarios.
    """
    
    @staticmethod
    def calculate_hourly_cost(
        grid_import: float,
        grid_export: float,
        price: float,
        export_price_ratio: float = 0.5
    ) -> Dict[str, float]:
        """
        Calculate cost for one hour.
        
        Args:
            grid_import: Energy imported from grid (kWh)
            grid_export: Energy exported to grid (kWh)
            price: Grid import price ($/kWh)
            export_price_ratio: Export price as fraction of import price
            
        Returns:
            Dictionary with cost breakdown
        """
        import_cost = grid_import * price
        export_revenue = grid_export * price * export_price_ratio
        net_cost = import_cost - export_revenue
        
        return {
            "import_cost": round(import_cost, 4),
            "export_revenue": round(export_revenue, 4),
            "net_cost": round(net_cost, 4)
        }
    
    @staticmethod
    def calculate_total_cost(
        hourly_results: List[Dict]
    ) -> Dict[str, float]:
        """
        Calculate total daily costs.
        
        Args:
            hourly_results: List of hourly simulation results
            
        Returns:
            Dictionary with total cost metrics
        """
        total_import_cost = 0.0
        total_export_revenue = 0.0
        total_grid_import = 0.0
        total_grid_export = 0.0
        
        for result in hourly_results:
            cost_info = result.get("cost", {})
            total_import_cost += cost_info.get("import_cost", 0.0)
            total_export_revenue += cost_info.get("export_revenue", 0.0)
            
            # Track energy
            balance = result.get("energy_balance", {})
            total_grid_import += balance.get("grid_import_kwh", 0.0)
            total_grid_export += balance.get("grid_export_kwh", 0.0)
        
        net_cost = total_import_cost - total_export_revenue
        
        return {
            "total_import_cost": round(total_import_cost, 2),
            "total_export_revenue": round(total_export_revenue, 2),
            "net_cost": round(net_cost, 2),
            "total_grid_import_kwh": round(total_grid_import, 2),
            "total_grid_export_kwh": round(total_grid_export, 2)
        }
    
    @staticmethod
    def calculate_baseline_cost(
        loads: List[float],
        prices: List[float]
    ) -> float:
        """
        Calculate baseline cost (PURE GRID-ONLY, no battery, no optimization).
        
        Baseline scenario: ALL load met exclusively by grid power.
        - No battery charging or discharging
        - No solar utilization
        - No optimization
        
        This represents the cost if the user had NO microgrid system at all.
        
        Args:
            loads: Hourly load demands (kWh)
            prices: Hourly grid prices ($/kWh)
            
        Returns:
            Total baseline cost ($)
        """
        total_cost = 0.0
        
        # For each hour, ALL load is met by grid (no solar, no battery)
        for load, price in zip(loads, prices):
            # Baseline: 100% grid usage
            baseline_grid_kwh = load
            cost = baseline_grid_kwh * price
            total_cost += cost
        
        return round(total_cost, 2)
    
    @staticmethod
    def calculate_baseline_with_solar_cost(
        loads: List[float],
        solars: List[float],
        prices: List[float]
    ) -> float:
        """
        Calculate baseline cost WITH solar but WITHOUT battery.
        
        This represents having solar panels but no battery storage.
        Use this for comparison when evaluating battery value specifically.
        
        Args:
            loads: Hourly load demands (kWh)
            solars: Hourly solar generation (kWh)
            prices: Hourly grid prices ($/kWh)
            
        Returns:
            Total cost with solar but no battery ($)
        """
        total_cost = 0.0
        
        for load, solar, price in zip(loads, solars, prices):
            # Use solar first, buy rest from grid
            solar_used = min(solar, load)
            grid_needed = max(0, load - solar_used)
            
            # Excess solar not stored (wasted without battery)
            cost = grid_needed * price
            total_cost += cost
        
        return round(total_cost, 2)
    
    @staticmethod
    def calculate_savings(
        optimized_cost: float,
        baseline_cost: float
    ) -> Dict[str, float]:
        """
        Calculate cost savings compared to baseline.
        
        Args:
            optimized_cost: Cost with microgrid optimization
            baseline_cost: Baseline cost (pure grid-only)
            
        Returns:
            Dictionary with savings metrics and explanation
        """
        absolute_savings = baseline_cost - optimized_cost
        
        if baseline_cost > 0:
            percentage_savings = (absolute_savings / baseline_cost) * 100
        else:
            percentage_savings = 0.0
        
        # Generate human-readable explanation
        if absolute_savings > 0:
            explanation = (
                f"This scheduler reduced daily energy cost by "
                f"{percentage_savings:.1f}% (${absolute_savings:.2f}) "
                f"compared to a pure grid-only baseline."
            )
        elif absolute_savings < 0:
            explanation = (
                f"Warning: Optimized cost is ${abs(absolute_savings):.2f} higher "
                f"than baseline. System may need tuning."
            )
        else:
            explanation = "Optimized cost equals baseline (no savings achieved)."
        
        return {
            "baseline_total_cost": round(baseline_cost, 2),
            "optimized_total_cost": round(optimized_cost, 2),
            "total_cost_savings": round(absolute_savings, 2),
            "savings_percentage": round(percentage_savings, 1),
            "explanation": explanation,
            # Legacy fields for backward compatibility
            "optimized_cost": round(optimized_cost, 2),
            "baseline_cost": round(baseline_cost, 2),
            "absolute_savings": round(absolute_savings, 2),
            "percentage_savings": round(percentage_savings, 1)
        }
