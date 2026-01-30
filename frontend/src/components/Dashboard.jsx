import React, { useState, useEffect } from 'react';
import { runSimulation } from '../services/api';
import SummaryCards from './SummaryCards';
import BatterySoCChart from './BatterySoCChart';
import EnergyUsageChart from './EnergyUsageChart';
import DecisionTimeline from './DecisionTimeline';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSimulationData();
  }, []);

  const fetchSimulationData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate varied scenario parameters for each refresh
      const solarVariation = 0.85 + Math.random() * 0.3; // 85-115% of base capacity
      const batteryCapacityVariation = 0.9 + Math.random() * 0.2; // 90-110% of base capacity
      const initialSocVariation = 0.3 + Math.random() * 0.4; // 30-70% initial charge
      const gridCarbonVariation = 0.35 + Math.random() * 0.15; // 0.35-0.50 kg CO2/kWh
      
      const scenarioConfig = {
        solar_capacity: 6.0 * solarVariation,
        battery: {
          capacity: 10.0 * batteryCapacityVariation,
          min_soc: 0.2,
          max_soc: 0.95,
          max_charge_rate: 5.0,
          max_discharge_rate: 5.0,
          efficiency: 0.95,
          initial_soc: initialSocVariation
        },
        grid_carbon_intensity: gridCarbonVariation
      };
      
      const result = await runSimulation(scenarioConfig);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch simulation data');
      console.error('Error fetching simulation:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-scada-bg">
        <div className="text-center select-none">
          <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-amber-500 border-t-transparent"></div>
          <p className="mt-6 text-scada-text text-base font-medium">Running simulation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-scada-bg">
        <div className="bg-scada-surface border border-red-500/50 rounded p-8 max-w-md select-none">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-scada-text">Simulation Error</h2>
          </div>
          <p className="text-scada-textMuted mb-6">{error}</p>
          <button
            onClick={fetchSimulationData}
            className="w-full bg-amber-500 hover:bg-amber-600 text-scada-bg px-6 py-3 rounded font-semibold transition-colors"
          >
            Retry Simulation
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-scada-bg">
      {/* Control Room Header */}
      <div className="bg-white border-b-3 border-amber-500 sticky top-0 z-10 select-none shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-7 lg:py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-500 rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
                  Operational Results
                </h1>
              </div>
              <p className="text-sm text-gray-700 font-bold">
                24-Hour Microgrid Control System Analysis
              </p>
            </div>
            <button
              onClick={fetchSimulationData}
              className="hidden md:flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-scada-bg px-5 py-2.5 rounded font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="space-y-8 lg:space-y-10">
          {/* Summary Cards */}
          <section>
            <SummaryCards
              baselineCost={data.baseline_total_cost}
              optimizedCost={data.optimized_total_cost}
              savings={data.total_cost_savings}
              savingsPercentage={data.savings_percentage}
            />
          </section>

          {/* Battery State of Charge */}
          <section key={`battery-${data.optimized_total_cost}`} className="bg-scada-surface rounded border-2 border-gray-700 p-6 lg:p-8 shadow-[0_0_15px_rgba(0,0,0,0.5),0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(0,0,0,0.7),0_0_40px_rgba(255,255,255,0.15)] hover:border-gray-600 transition-all duration-300 animate-fadeIn">
            <h2 className="text-xl lg:text-2xl font-semibold text-scada-text mb-10 select-none">
              Battery State of Charge
            </h2>
            <div className="w-full">
              <BatterySoCChart key={`soc-chart-${data.optimized_total_cost}`} data={data.hourly_results} />
            </div>
          </section>

          {/* Energy Usage */}
          <section key={`energy-${data.optimized_total_cost}`} className="bg-scada-surface rounded border-2 border-gray-700 p-6 lg:p-8 shadow-[0_0_15px_rgba(0,0,0,0.5),0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(0,0,0,0.7),0_0_40px_rgba(255,255,255,0.15)] hover:border-gray-600 transition-all duration-300 animate-fadeIn">
            <h2 className="text-xl lg:text-2xl font-semibold text-scada-text mb-10 select-none">
              Hourly Energy Flow Analysis
            </h2>
            <div className="w-full">
              <EnergyUsageChart key={`energy-chart-${data.optimized_total_cost}`} data={data.hourly_results} />
            </div>
          </section>

          {/* Decision Timeline */}
          <section key={`timeline-${data.optimized_total_cost}`} className="bg-scada-surface rounded border border-scada-border p-6 lg:p-8">
            <h2 className="text-xl lg:text-2xl font-semibold text-scada-text mb-6 select-none">
              Operational Decision Timeline
            </h2>
            <div className="w-full">
              <DecisionTimeline key={`timeline-table-${data.optimized_total_cost}`} data={data.hourly_results} />
            </div>
          </section>

          {/* Mobile Refresh Button */}
          <div className="flex justify-center md:hidden">
            <button
              onClick={fetchSimulationData}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-scada-bg px-6 py-3 rounded font-semibold transition-colors w-full max-w-xs select-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Run New Simulation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
