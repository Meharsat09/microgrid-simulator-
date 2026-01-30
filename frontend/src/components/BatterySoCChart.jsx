import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BatterySoCChart = ({ data }) => {
  const chartData = data.map(item => ({
    hour: item.hour,
    soc: parseFloat(item.battery_soc_pct.toFixed(1))
  }));

  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChart
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
          label={{ value: 'State of Charge (%)', angle: -90, position: 'insideLeft', style: { fill: '#FBBF24', fontWeight: 700, fontSize: 14, textAnchor: 'middle' } }}
          domain={[0, 100]}
          tick={{ fill: '#FBBF24', fontSize: 14, fontWeight: 700 }}
          tickLine={{ stroke: '#FBBF24' }}
          stroke="#FBBF24"
        />
        <Tooltip
          formatter={(value) => [`${value}%`, 'Battery SoC']}
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
        <Line
          type="monotone"
          dataKey="soc"
          stroke="#F59E0B"
          strokeWidth={3}
          name="Battery State of Charge"
          dot={{ fill: '#F59E0B', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#F59E0B' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BatterySoCChart;
