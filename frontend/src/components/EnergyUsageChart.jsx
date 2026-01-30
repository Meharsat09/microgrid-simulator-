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
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="hour"
          label={{ value: 'Hour (0–23)', position: 'insideBottom', offset: -25, style: { fill: '#F59E0B', fontWeight: 700, fontSize: 14, textAnchor: 'middle' } }}
          tick={{ fill: '#000000', fontSize: 14, fontWeight: 700 }}
          tickLine={{ stroke: '#F59E0B' }}
          stroke="#F59E0B"
          height={60}
        />
        <YAxis
          label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft', style: { fill: '#F59E0B', fontWeight: 700, fontSize: 14, textAnchor: 'middle' } }}
          tick={{ fill: '#000000', fontSize: 14, fontWeight: 700 }}
          tickLine={{ stroke: '#F59E0B' }}
          stroke="#F59E0B"
        />
        <Tooltip
          formatter={(value) => `${value} kWh`}
          labelFormatter={(label) => `Hour ${label}`}
          contentStyle={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #E5E7EB',
            borderRadius: '8px',
            fontFamily: 'Inter, sans-serif',
            color: '#000000'
          }}
          labelStyle={{ color: '#000000', fontWeight: 600 }}
        />
        <Legend
          wrapperStyle={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            color: '#000000',
            paddingTop: '20px'
          }}
        />
        <Bar dataKey="solar" stackId="a" fill="#FCD34D" name="Solar Generation" radius={[0, 0, 0, 0]} />
        <Bar dataKey="batteryDischarge" stackId="a" fill="#F59E0B" name="Battery Storage" radius={[0, 0, 0, 0]} />
        <Bar dataKey="gridImport" stackId="a" fill="#9CA3AF" name="Grid Import" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EnergyUsageChart;
