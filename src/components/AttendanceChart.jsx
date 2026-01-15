import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                padding: '12px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
                <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>{label}</p>
                <p style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>
                    Attendance: <span style={{ fontWeight: 700 }}>{payload[0].value}%</span>
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {payload[0].payload.attended} / {payload[0].payload.total} Lectures
                </p>
            </div>
        );
    }
    return null;
};

const AttendanceChart = ({ data }) => {
    // Transform data for chart if not already
    // data struct: { name, attended, total, color }
    const chartData = data.map(d => ({
        name: d.name.split(' ')[0], // Short name
        fullName: d.name,
        percentage: d.total > 0 ? Math.round((d.attended / d.total) * 100) : 0,
        attended: d.attended,
        total: d.total
    }));

    return (
        <div className="glass" style={{ padding: '2rem', borderRadius: '32px', height: '400px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ color: 'var(--text-primary)' }}>Attendance Analytics</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 600 }}>Safe Zone &gt; 75%</span>
                    <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', fontWeight: 600 }}>Critical &lt; 75%</span>
                </div>
            </div>

            <div style={{ flex: 1, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-hover)', opacity: 0.5 }} />
                        <Bar dataKey="percentage" radius={[6, 6, 0, 0]} animationDuration={1500}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.percentage >= 75 ? '#10b981' : '#f43f5e'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AttendanceChart;
