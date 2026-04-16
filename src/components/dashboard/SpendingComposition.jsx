import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SpendingComposition.css';

export const SpendingComposition = React.memo(({ data, editorNote }) => {
  const navigate = useNavigate();

  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '1rem' }}>
        <h3 className="text-h3" style={{ marginBottom: '1rem' }}>Insights</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No spending data yet. Add expenses to see breakdown.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', backgroundColor: 'transparent', border: 'none' }} role="region" aria-label="Spending insights">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 className="text-h3">Insights</h3>
        <button 
          onClick={() => navigate('/insights')}
          style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="View all insights"
        >
          View All
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {data.map(item => (
          <div key={item.id} className="spending-bar-container">
            <div className="spending-bar-header">
              <span style={{ fontWeight: 500 }}>{item.label}</span>
              <span style={{ fontWeight: 600 }}>{item.percentage}%</span>
            </div>
            <div className="spending-bar-track" role="progressbar" aria-valuenow={item.percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`${item.label}: ${item.percentage}%`}>
              <div className="spending-bar-fill" style={{ width: `${item.percentage}%`, backgroundColor: item.color, transition: 'width 0.6s ease' }} />
            </div>
          </div>
        ))}
      </div>

      {editorNote && (
        <div className="note-box">
          <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>EDITOR'S NOTE</div>
          <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.5 }}>"{editorNote}"</div>
        </div>
      )}
    </div>
  );
});
