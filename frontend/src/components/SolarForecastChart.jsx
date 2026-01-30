import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SolarForecastChart = ({ data }) => {
    // Check if weather uncertainty is enabled
    const hasUncertainty = data.some(item => item.forecast_solar_kwh !== null);

    if (!hasUncertainty) {
        return null; // Don't render if uncertainty is disabled
    }

    const chartData = data.map(item => ({
        hour: item.hour,
        forecast: item.forecast_solar_kwh ? parseFloat(item.forecast_solar_kwh.toFixed(2)) : 0,
        actual: item.actual_solar_kwh ? parseFloat(item.actual_solar_kwh.toFixed(2)) : 0,
        error: item.forecast_error_pct ? parseFloat(item.forecast_error_pct.toFixed(1)) : 0
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const forecast = payload.find(p => p.dataKey === 'forecast')?.value || 0;
            const actual = payload.find(p => p.dataKey === 'actual')?.value || 0;
            const error = chartData[label]?.error || 0;

            return (
                <div className="bg-white border-2 border-gray-200 rounded-lg p-3 shadow-lg">
                    <p className="text-black font-bold mb-2">Hour {label}</p>
                    <p className="text-amber-600 text-sm font-semibold">
                        <span className="font-bold">Forecast:</span> {forecast.toFixed(2)} kWh
                    </p>
                    <p className="text-amber-500 text-sm font-semibold">
                        <span className="font-bold">Actual:</span> {actual.toFixed(2)} kWh
                    </p>
                    <p className={`text-sm font-bold mt-1 ${error < 0 ? 'text-red-600' : error > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                        Error: {error > 0 ? '+' : ''}{error.toFixed(1)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={360}>
            <LineChart
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
                    label={{ value: 'Solar Generation (kWh)', angle: -90, position: 'insideLeft', style: { fill: '#F59E0B', fontWeight: 700, fontSize: 14, textAnchor: 'middle' } }}
                    tick={{ fill: '#000000', fontSize: 14, fontWeight: 700 }}
                    tickLine={{ stroke: '#F59E0B' }}
                    stroke="#F59E0B"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    wrapperStyle={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#000000',
                        paddingTop: '20px'
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#FCD34D"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Forecast Solar"
                    dot={{ fill: '#FCD34D', r: 3 }}
                />
                <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    name="Actual Solar"
                    dot={{ fill: '#F59E0B', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#F59E0B' }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default SolarForecastChart;
