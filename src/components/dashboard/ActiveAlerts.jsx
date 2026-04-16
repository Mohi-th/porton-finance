import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import './ActiveAlerts.css';

const getIcon = (type) => {
  switch(type) {
    case 'danger': return <AlertTriangle size={16} />;
    case 'warning': return <AlertCircle size={16} />;
    case 'info': return <Info size={16} />;
    default: return <Info size={16} />;
  }
};

export const ActiveAlerts = React.memo(({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div style={{ paddingLeft: '0.5rem' }}>
        <h3 className="text-h3" style={{ marginBottom: '1.25rem' }}>Active Alerts</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No active alerts.</p>
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: '0.5rem' }} role="region" aria-label="Active alerts">
      <h3 className="text-h3" style={{ marginBottom: '1.25rem' }}>Active Alerts</h3>
      <div className="alerts-list" role="list">
        {alerts.map((alert) => (
          <div key={alert.id} className="alert-item" role="listitem">
            <div className={`alert-icon ${alert.type}`} aria-hidden="true">
              {getIcon(alert.type)}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{alert.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{alert.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
