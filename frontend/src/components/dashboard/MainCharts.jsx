import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Settings2, GitCompare } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow-card)' }}>
        <p style={{ color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '5px' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, fontSize: '0.9rem', fontWeight: '600' }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function MainCharts({ chartData = [] }) {
  const [xAxis, setXAxis] = useState('week');
  const [yAxis, setYAxis] = useState('followers');
  const [compareMode, setCompareMode] = useState(false); //compare toggle

  const metricLabels = { followers: 'Total Followers', likes: 'Interactions', comments: 'Profile Visits' };

  // For the demo, if Compare Mode is on, we generate a fake secondary line based on the primary data (later change)
  const processedData = compareMode 
    ? chartData.map(d => ({ ...d, compare_metric: Math.floor(d[yAxis] * 0.8) + Math.floor(Math.random() * 50) }))
    : chartData;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '30px' }}>
      
      {/* CHART 1: CUSTOM ANALYSIS & COMPARE MODE */}
      <div className="stat-card" style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings2 size={20} color="var(--accent-primary)" />
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>Custom Analysis</h3>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* The Compare Mode Button */}
            <button 
              onClick={() => setCompareMode(!compareMode)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px', border: `1px solid ${compareMode ? 'var(--accent-primary)' : 'var(--border-color)'}`, backgroundColor: compareMode ? 'rgba(112, 82, 255, 0.1)' : 'transparent', color: compareMode ? 'var(--accent-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
            >
              <GitCompare size={14} /> {compareMode ? 'Comparing' : 'Compare'}
            </button>

            <select className="custom-select" style={{ padding: '6px 10px', fontSize: '0.85rem' }} value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
              <option value="followers">Y: Followers</option>
              <option value="likes">Y: Interactions</option>
              <option value="comments">Y: Visits</option>
            </select>
          </div>
        </div>

        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer>
            <AreaChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDynamic" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/><stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/></linearGradient>
                <linearGradient id="colorCompare" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3}/><stop offset="95%" stopColor="#4ADE80" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis dataKey={xAxis} stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              
              <Area type="monotone" dataKey={yAxis} name={`Current Platform`} stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorDynamic)" />
              
              {/* If compare mode is ON, draw the second line! */}
              {compareMode && (
                <Area type="monotone" dataKey="compare_metric" name={`Competitor / Other Platform`} stroke="#4ADE80" strokeWidth={3} fillOpacity={1} fill="url(#colorCompare)" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 2: ENGAGEMENT BREAKDOWN */}
      <div className="stat-card" style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-color)' }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '1.1rem' }}>Engagement Breakdown</h3>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis dataKey="week" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" align="right" />
              <Bar dataKey="likes" name="Interactions" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="comments" name="Profile Visits" fill="#4ADE80" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}