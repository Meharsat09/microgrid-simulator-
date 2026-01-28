"""
Grid Price Profile
Provides deterministic hourly grid electricity prices for 24 hours.
Based on typical Time-of-Use (TOU) pricing structure.
"""

def get_price_profile() -> list[float]:
    """
    Returns 24-hour grid electricity price in $/kWh.
    
    Pattern (Time-of-Use pricing):
    - Off-peak (0-6, 23): $0.08-0.10/kWh
    - Mid-peak (7-9, 15-17, 22): $0.15-0.18/kWh
    - On-peak (10-14, 18-21): $0.25-0.35/kWh
    
    Higher prices during evening peak demand (18-21) to reflect grid stress.
    
    Returns:
        List of 24 hourly prices ($/kWh)
    """
    price_profile = [
        # Hour 0-6: Off-peak
        0.08, 0.08, 0.08, 0.08, 0.09, 0.09, 0.10,
        
        # Hour 7-9: Mid-peak (morning)
        0.15, 0.18, 0.18,
        
        # Hour 10-14: On-peak (midday high demand)
        0.25, 0.28, 0.30, 0.28, 0.25,
        
        # Hour 15-17: Mid-peak (afternoon)
        0.18, 0.20, 0.22,
        
        # Hour 18-21: On-peak (evening - highest prices)
        0.32, 0.35, 0.33, 0.30,
        
        # Hour 22-23: Mid-peak to off-peak transition
        0.15, 0.10
    ]
    
    assert len(price_profile) == 24, "Price profile must have exactly 24 hours"
    return price_profile


def get_average_price() -> float:
    """Calculate average daily price."""
    return sum(get_price_profile()) / 24
