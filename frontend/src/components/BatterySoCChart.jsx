import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BatterySoCChart = ({ data }) => {
  const chartData = data.map(item => ({
    hour: item.hour,
    soc: parseFloat(item.battery_soc_pct.toFixed(1))
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="hour" 
          label={{ value: 'Hour', position: 'insideBottom', offset: -5 }}
        />
        <YAxis 
          label={{ value: 'State of Charge (%)', angle: -90, position: 'insideLeft' }}
          domain={[0, 100]}
        />
        <Tooltip 
          formatter={(value) => [`${value}%`, 'SoC']}
          labelFormatter={(label) => `Hour ${label}`}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="soc" 
          stroke="#3b82f6" 
          strokeWidth={2}
          name="Battery SoC"
          dot={{ fill: '#3b82f6', r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BatterySoCChart;
