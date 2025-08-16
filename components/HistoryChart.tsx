import React from 'react';
import { HistoricalDataPoint } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HistoryChartProps {
    data: HistoricalDataPoint[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
    return (
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 h-64 sm:h-80">
            <h3 className="text-lg font-medium text-slate-300 mb-4">Historia (Temp / Wilgotność)</h3>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 20,
                        left: -10,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="#ef4444" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(30, 41, 59, 0.8)',
                            borderColor: '#475569'
                        }}
                        labelStyle={{ color: '#cbd5e1' }}
                        isAnimationActive={false}
                    />
                    <Legend wrapperStyle={{fontSize: "14px"}} />
                    <Line yAxisId="left" type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
                    <Line yAxisId="right" type="monotone" dataKey="humidity" name="Wilgotność (%)" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default React.memo(HistoryChart);