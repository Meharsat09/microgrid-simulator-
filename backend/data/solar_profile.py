"""
Solar Generation Profile
Provides deterministic hourly solar generation for 24 hours.
Assumes a typical clear sunny day with bell curve pattern.
"""

def get_solar_profile() -> list[float]:
    """
    Returns 24-hour solar generation in kWh per hour.
    
    Pattern:
    - Night (0-5, 20-23): 0.0 kWh
    - Sunrise (6-7): 0.5-1.5 kWh
    - Morning (8-10): 2.0-3.5 kWh
    - Noon peak (11-13): 4.0-5.0 kWh
    - Afternoon (14-17): 3.5-2.0 kWh
    - Sunset (18-19): 1.0-0.3 kWh
    
    Assumes ~6kW solar panel system with good sun exposure.
    
    Returns:
        List of 24 hourly solar generation values (kWh)
    """
    solar_profile = [
        # Hour 0-5: Night (no solar)
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        
        # Hour 6-7: Sunrise
        0.5, 1.5,
        
        # Hour 8-10: Morning rise
        2.5, 3.5, 4.0,
        
        # Hour 11-13: Peak (noon)
        4.8, 5.0, 4.8,
        
        # Hour 14-17: Afternoon decline
        4.2, 3.8, 3.0, 2.0,
        
        # Hour 18-19: Sunset
        1.0, 0.3,
        
        # Hour 20-23: Night (no solar)
        0.0, 0.0, 0.0, 0.0
    ]
    
    assert len(solar_profile) == 24, "Solar profile must have exactly 24 hours"
    return solar_profile


def get_total_daily_solar() -> float:
    """Calculate total daily solar generation."""
    return sum(get_solar_profile())
