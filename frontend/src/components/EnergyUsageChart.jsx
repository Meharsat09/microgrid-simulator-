import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EnergyUsageChart = ({ data }) => {
  const chartData = data.map(item => ({
    hour: item.hour,
    gridImport: parseFloat(item.grid_import_kwh.toFixed(2)),
    solar: parseFloat(item.solar_kwh.toFixed(2)),
    batteryDischarge: parseFloat(item.battery_discharge_kwh.toFixed(2))
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="hour" 
          label={{ value: 'Hour', position: 'insideBottom', offset: -5 }}
        />
        <YAxis 
          label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          formatter={(value) => `${value} kWh`}
          labelFormatter={(label) => `Hour ${label}`}
        />
        <Legend />
        <Bar dataKey="solar" stackId="a" fill="#fbbf24" name="Solar" />
        <Bar dataKey="batteryDischarge" stackId="a" fill="#f97316" name="Battery" />
        <Bar dataKey="gridImport" stackId="a" fill="#6b7280" name="Grid" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EnergyUsageChart;
