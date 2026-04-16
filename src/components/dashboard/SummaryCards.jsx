import React from 'react';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const SummaryCards = React.memo(({ data }) => {
  if (!data) return null;

  return (
    <section className="summary-grid" aria-label="Financial summary">
      <div className="card">
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 600 }}>Total Net Worth</div>
        <div className="text-h1" style={{ marginBottom: '1rem' }}>{formatCurrency(data.netWorth.value)}</div>
        <div className="mobile-only" style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '10px', marginBottom: '0.75rem' }}>
          <div style={{ width: '70%', height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '10px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className={data.netWorth.isPositive ? 'text-success' : 'text-danger'}>
              {data.netWorth.isPositive ? '↗' : '↘'} {data.netWorth.trend}%
            </span>
            <span className="desktop-only" style={{ color: 'var(--text-muted)' }}>{data.netWorth.trendText}</span>
          </div>
          <span className="mobile-only" style={{ color: 'var(--color-primary)' }}>70%</span>
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 600 }}>Monthly Spending</div>
        <div className="text-h1" style={{ marginBottom: '1rem' }}>{formatCurrency(data.spending.value)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
          <span className={!data.spending.isPositive ? 'text-danger' : 'text-success'}>
            {!data.spending.isPositive ? '↗' : '↘'} {data.spending.trend}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>{data.spending.trendText}</span>
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 600 }}>Total Income</div>
        <div className="text-h1" style={{ marginBottom: '1rem' }}>{formatCurrency(data.savings.value)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
          <span className={data.savings.isPositive ? 'text-success' : 'text-danger'}>
            {data.savings.isPositive ? '✓' : '✗'} {data.savings.statusText}
          </span>
        </div>
      </div>
    </section>
  );
});
