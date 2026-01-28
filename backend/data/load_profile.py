"""
Load Profile Generator
Provides deterministic hourly load demand for 24 hours.
Represents typical household/small commercial daily pattern.
"""

def get_load_profile() -> list[float]:
    """
    Returns 24-hour load demand in kWh per hour.
    
    Pattern:
    - Low during night (0-5): 0.5-1.0 kWh
    - Morning rise (6-8): 1.5-3.0 kWh
    - Day moderate (9-16): 2.0-2.5 kWh
    - Evening peak (17-22): 3.0-4.5 kWh
    - Night decline (23): 1.5 kWh
    
    Returns:
        List of 24 hourly load values (kWh)
    """
    load_profile = [
        # Hour 0-5: Night (low consumption)
        0.8, 0.6, 0.5, 0.5, 0.6, 1.0,
        
        # Hour 6-8: Morning rise
        2.0, 3.0, 2.5,
        
        # Hour 9-16: Day (moderate, people at work)
        2.0, 2.2, 2.5, 2.8, 2.5, 2.3, 2.0, 2.2,
        
        # Hour 17-22: Evening peak (people home, cooking, entertainment)
        3.5, 4.5, 4.2, 3.8, 3.5, 3.0,
        
        # Hour 23: Night decline
        1.5
    ]
    
    assert len(load_profile) == 24, "Load profile must have exactly 24 hours"
    return load_profile


def get_total_daily_load() -> float:
    """Calculate total daily energy demand."""
    return sum(get_load_profile())
