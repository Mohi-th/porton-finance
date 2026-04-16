import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Coffee, Zap, Briefcase, Utensils, HeartPulse, Car, Film, GraduationCap, Home } from 'lucide-react';
import './RecentActivity.css';

const getMerchantIcon = (category) => {
  const cat = (category || '').toUpperCase();
  if (cat.includes('SALARY') || cat.includes('FREELANCE')) return <Briefcase size={18} />;
  if (cat.includes('FOOD') || cat.includes('DINING') || cat.includes('GROCER')) return <Utensils size={18} />;
  if (cat.includes('UTIL') || cat.includes('ELECTRIC')) return <Zap size={18} />;
  if (cat.includes('HEALTH') || cat.includes('PHARMA')) return <HeartPulse size={18} />;
  if (cat.includes('TRANSPORT') || cat.includes('UBER')) return <Car size={18} />;
  if (cat.includes('ENTERTAIN') || cat.includes('NETFLIX')) return <Film size={18} />;
  if (cat.includes('EDUCATION')) return <GraduationCap size={18} />;
  if (cat.includes('HOUSING') || cat.includes('RENT')) return <Home size={18} />;
  if (cat.includes('LIFE')) return <Coffee size={18} />;
  return <ShoppingBag size={18} />;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Math.abs(value));
};

const ActivityRow = React.memo(({ tx }) => (
  <div className="table-row" role="row">
    <div className="merchant-info" role="cell">
      <div className="merchant-icon" data-category={tx.category} aria-hidden="true">
        {getMerchantIcon(tx.category)}
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{tx.merchant}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.date}</div>
      </div>
    </div>
    <div className="desktop-only" role="cell">
      <span className="transaction-category" data-category={tx.category}>{tx.category}</span>
    </div>
    <div className="transaction-status desktop-only" role="cell">
      <div className={`status-dot ${tx.status.toLowerCase()}`}></div>
      <span style={{ color: tx.status === 'CLEARED' ? 'var(--color-success)' : 'var(--text-secondary)' }}>{tx.status}</span>
    </div>
    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }} role="cell">
      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: tx.amount >= 0 ? 'var(--color-success)' : 'var(--text-primary)' }}>
        {tx.amount >= 0 ? '+' : '-'}{formatCurrency(tx.amount)}
      </div>
    </div>
  </div>
));

export const RecentActivity = React.memo(({ activity }) => {
  const navigate = useNavigate();

  if (!activity || activity.length === 0) {
    return (
      <div style={{ padding: '1rem' }}>
        <h3 className="text-h3" style={{ marginBottom: '1rem' }}>Recent Transactions</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
          No transactions yet. Add your first one!
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', backgroundColor: 'transparent' }} role="region" aria-label="Recent transactions">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 className="text-h3">Recent Transactions</h3>
        <button 
          onClick={() => navigate('/transactions')}
          style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="View all transactions"
        >
          View All
        </button>
      </div>

      <div className="table-header desktop-only" role="row">
        <div role="columnheader">MERCHANT</div>
        <div role="columnheader">CATEGORY</div>
        <div role="columnheader">STATUS</div>
        <div style={{ textAlign: 'right' }} role="columnheader">AMOUNT</div>
      </div>

      <div role="rowgroup">
        {activity.map(tx => (
          <ActivityRow key={tx.id} tx={tx} />
        ))}
      </div>
    </div>
  );
});
