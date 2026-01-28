"""
Time Engine
Manages 24-hour simulation time steps.
"""

class TimeEngine:
    """
    Manages discrete 24-hour time steps for simulation.
    
    Each time step represents one hour (0-23).
    """
    
    def __init__(self):
        """Initialize time engine at hour 0."""
        self.current_hour = 0
        self.total_hours = 24
    
    def reset(self):
        """Reset to hour 0."""
        self.current_hour = 0
    
    def advance(self):
        """
        Advance to next hour.
        
        Returns:
            True if advanced successfully, False if reached end of day
        """
        if self.current_hour < self.total_hours - 1:
            self.current_hour += 1
            return True
        return False
    
    def get_hour(self) -> int:
        """Get current hour (0-23)."""
        return self.current_hour
    
    def is_day_complete(self) -> bool:
        """Check if simulation day is complete."""
        return self.current_hour >= self.total_hours - 1
    
    def get_hours_remaining(self) -> int:
        """Get number of hours remaining in simulation."""
        return self.total_hours - self.current_hour - 1
    
    def iterate_hours(self):
        """
        Generator to iterate through all 24 hours.
        
        Yields:
            Hour number (0-23)
        """
        self.reset()
        for hour in range(self.total_hours):
            self.current_hour = hour
            yield hour
