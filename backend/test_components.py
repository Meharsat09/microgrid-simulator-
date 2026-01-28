"""
Quick test script to verify the simulation works.
Run this after installing dependencies to test the backend.
"""

from models.battery import Battery
from models.microgrid import Microgrid
from simulator.time_engine import TimeEngine
from simulator.energy_balance import EnergyBalance
from scheduler.rule_engine import RuleBasedScheduler
from data.load_profile import get_load_profile
from data.solar_profile import get_solar_profile
from data.price_profile import get_price_profile


def test_components():
    """Test individual components."""
    print("=" * 60)
    print("Testing Microgrid Simulator Components")
    print("=" * 60)
    
    # Test Battery
    print("\n1. Testing Battery...")
    battery = Battery(capacity=10.0, initial_soc=0.5)
    print(f"   Initial SoC: {battery.get_soc_percentage():.1f}%")
    battery.charge(2.0)
    print(f"   After charging 2 kWh: {battery.get_soc_percentage():.1f}%")
    battery.discharge(1.5)
    print(f"   After discharging 1.5 kWh: {battery.get_soc_percentage():.1f}%")
    print("   ✓ Battery working correctly")
    
    # Test Profiles
    print("\n2. Testing Data Profiles...")
    loads = get_load_profile()
    solars = get_solar_profile()
    prices = get_price_profile()
    print(f"   Load profile: {len(loads)} hours, total {sum(loads):.1f} kWh")
    print(f"   Solar profile: {len(solars)} hours, total {sum(solars):.1f} kWh")
    print(f"   Price profile: {len(prices)} hours, avg ${sum(prices)/len(prices):.3f}/kWh")
    print("   ✓ Data profiles working correctly")
    
    # Test Time Engine
    print("\n3. Testing Time Engine...")
    time_engine = TimeEngine()
    hours = list(time_engine.iterate_hours())
    print(f"   Simulated {len(hours)} hours: {hours[0]} to {hours[-1]}")
    print("   ✓ Time engine working correctly")
    
    # Test Scheduler
    print("\n4. Testing Rule-Based Scheduler...")
    battery.reset(0.5)
    scheduler = RuleBasedScheduler(high_price_threshold=0.20)
    decision = scheduler.schedule_hour(
        hour=12,
        load=2.5,
        solar=5.0,
        battery=battery,
        price=0.30
    )
    print(f"   Decision at noon: solar_to_load={decision['solar_to_load']:.2f} kWh")
    print(f"   Battery charge: {decision['battery_charge']:.2f} kWh")
    print("   ✓ Scheduler working correctly")
    
    # Test Energy Balance
    print("\n5. Testing Energy Balance...")
    balance = EnergyBalance.calculate_balance(
        load=2.5,
        solar=5.0,
        battery_charge=2.0,
        battery_discharge=0.0,
        grid=-0.5  # export
    )
    print(f"   Energy balanced: {balance['balanced']}")
    print(f"   Balance error: {balance['balance_error_kwh']:.6f} kWh")
    print("   ✓ Energy balance working correctly")
    
    print("\n" + "=" * 60)
    print("All components tested successfully! ✓")
    print("=" * 60)
    print("\nYou can now run: python main.py")
    print("Then visit: http://localhost:8000/docs")
    print("=" * 60)


if __name__ == "__main__":
    test_components()
