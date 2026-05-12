import React from 'react';
import StatCard from './StatCard';

export default function StatGrid({ data }) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '20px', 
      marginBottom: '30px' 
    }}>
      {/* We use data?.views || 0 so it always has a fallback number to show! */}
      <StatCard 
        title="Total Views" 
        targetNumber={data?.views || 0} 
        delta={data?.deltas?.views || 0} 
      />
      <StatCard 
        title="Profile Visits" 
        targetNumber={data?.visits || 0} 
        delta={data?.deltas?.visits || 0} 
      />
      <StatCard 
        title="Followers" 
        targetNumber={data?.followers || 0} 
        delta={data?.deltas?.followers || 0} 
      />
      <StatCard 
        title="Interactions" 
        targetNumber={data?.interactions || 0} 
        delta={data?.deltas?.interactions || 0} 
      />
    </div>
  );
}