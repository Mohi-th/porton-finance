import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import './AIInsightCard.css';

export const AIInsightCard = React.memo(({ data }) => {
  const { trackEvent } = useAnalytics();

  if (!data) return null;

  return (
    <div className="insight-card" role="region" aria-label="AI Strategy Insight">
      <div className="badge">Pro Strategy Insight</div>
      <h2 className="text-h2" style={{ marginBottom: '1rem', color: '#fff' }}>
        {data.title}
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '2rem', maxWidth: '85%', lineHeight: 1.6 }}>
        {data.description}
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {data.actions.map((action, index) => (
          <button 
            key={index}
            className={index === 0 ? "btn btn-primary" : "btn btn-secondary"}
            onClick={() => trackEvent('execute_strategy', { actionName: action })}
            aria-label={action}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
});
