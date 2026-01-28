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
      const result = await runSimulation();
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Running simulation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 text-xl font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchSimulationData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Microgrid Simulator Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            24-hour energy optimization analysis
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Summary Cards */}
        <SummaryCards
          baselineCost={data.baseline_total_cost}
          optimizedCost={data.optimized_total_cost}
          savings={data.total_cost_savings}
          savingsPercentage={data.savings_percentage}
        />

        {/* Battery State of Charge */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Battery State of Charge
          </h2>
          <BatterySoCChart data={data.hourly_results} />
        </div>

        {/* Energy Usage */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Energy Usage by Hour
          </h2>
          <EnergyUsageChart data={data.hourly_results} />
        </div>

        {/* Decision Timeline */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Decision Timeline
          </h2>
          <DecisionTimeline data={data.hourly_results} />
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center">
          <button
            onClick={fetchSimulationData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium shadow-sm"
          >
            Run New Simulation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
