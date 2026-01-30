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
    <ResponsiveContainer width="100%" height={440}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 60, bottom: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="hour"
          label={{ value: 'Hour (0–23)', position: 'insideBottom', offset: -25, style: { fill: '#FBBF24', fontWeight: 700, fontSize: 14, textAnchor: 'middle' } }}
          tick={{ fill: '#FBBF24', fontSize: 14, fontWeight: 700 }}
          tickLine={{ stroke: '#FBBF24' }}
          stroke="#FBBF24"
          height={60}
        />
        <YAxis
          label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft', style: { fill: '#FBBF24', fontWeight: 700, fontSize: 14, textAnchor: 'middle' } }}
          tick={{ fill: '#FBBF24', fontSize: 14, fontWeight: 700 }}
          tickLine={{ stroke: '#FBBF24' }}
          stroke="#FBBF24"
        />
        <Tooltip
          formatter={(value) => `${value} kWh`}
          labelFormatter={(label) => `Hour ${label}`}
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '6px',
            fontFamily: 'Inter, sans-serif',
            color: '#F9FAFB'
          }}
          labelStyle={{ color: '#F9FAFB', fontWeight: 600 }}
        />
        <Legend
          wrapperStyle={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            color: '#F9FAFB',
            paddingTop: '20px'
          }}
        />
        <Bar dataKey="solar" stackId="a" fill="#FBBF24" name="Solar Generation" radius={[0, 0, 0, 0]} />
        <Bar dataKey="batteryDischarge" stackId="a" fill="#F59E0B" name="Battery Storage" radius={[0, 0, 0, 0]} />
        <Bar dataKey="gridImport" stackId="a" fill="#6B7280" name="Grid Import" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EnergyUsageChart;
