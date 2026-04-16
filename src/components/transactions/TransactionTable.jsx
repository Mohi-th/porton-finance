import React from 'react';
import { ShoppingBag, Coffee, Zap, Briefcase, Utensils, Edit3, Trash2, HeartPulse, Car, Film, Home } from 'lucide-react';

const getMerchantIcon = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('salary') || cat.includes('freelance')) return <Briefcase size={18} />;
  if (cat.includes('food') || cat.includes('dining') || cat.includes('grocer')) return <Utensils size={18} />;
  if (cat.includes('util') || cat.includes('bill')) return <Zap size={18} />;
  if (cat.includes('health') || cat.includes('pharma')) return <HeartPulse size={18} />;
  if (cat.includes('transport') || cat.includes('uber')) return <Car size={18} />;
  if (cat.includes('entertain') || cat.includes('netflix')) return <Film size={18} />;
  if (cat.includes('housing') || cat.includes('rent')) return <Home size={18} />;
  if (cat.includes('life')) return <Coffee size={18} />;
  return <ShoppingBag size={18} />;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(value);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const GRID_COLS = '1.5fr 1fr 1fr 1fr 1fr 100px';

const TransactionRow = React.memo(({ tx, onEdit, onDelete }) => (
  <div className="table-row" style={{ gridTemplateColumns: GRID_COLS, display: 'grid', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }} role="row">
    <div className="merchant-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} role="cell">
      <div className="merchant-icon" data-category={(tx.category || '').toUpperCase()} aria-hidden="true">
        {getMerchantIcon(tx.category)}
      </div>
      <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.merchant || tx.description}</div>
    </div>
    
    <div role="cell">
      <span className="transaction-category" data-category={(tx.category || '').toUpperCase()} style={{ backgroundColor: 'transparent', padding: 0, fontSize: '0.8125rem' }}>
        {tx.category}
      </span>
    </div>

    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }} role="cell">
      {formatDate(tx.date)}
    </div>

    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: tx.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)', whiteSpace: 'nowrap' }} role="cell">
      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
    </div>

     <div style={{ fontWeight: 600, fontSize: '0.875rem', textTransform: 'capitalize', color: tx.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)' }} role="cell">
      {tx.type}
    </div>

    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }} role="cell">
      <button onClick={() => onEdit(tx)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} title="Edit" aria-label={`Edit ${tx.merchant || tx.description}`}>
        <Edit3 size={16} />
      </button>
      <button onClick={() => onDelete(tx._id)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} title="Delete" aria-label={`Delete ${tx.merchant || tx.description}`}>
        <Trash2 size={16} />
      </button>
    </div>
  </div>
));

export const TransactionTable = React.memo(({ transactions, onEdit, onDelete }) => {
  if (!transactions || transactions.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No transactions found.</div>;
  }

  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }} role="table" aria-label="Transactions table">
      {/* Inner wrapper with min-width forces horizontal scroll below 690px */}
      <div style={{ minWidth: '690px', padding: '1rem' }}>
        <div className="table-header" style={{ gridTemplateColumns: GRID_COLS, display: 'grid', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }} role="row">
          <div role="columnheader">TRANSACTION</div>
          <div role="columnheader">CATEGORY</div>
          <div role="columnheader">DATE</div>
          <div role="columnheader">AMOUNT</div>
          <div role="columnheader">TYPE</div>
          <div style={{ textAlign: 'center' }} role="columnheader">ACTIONS</div>
        </div>

        <div role="rowgroup">
          {transactions.map(tx => (
            <TransactionRow key={tx._id} tx={tx} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </div>
    </div>
  );
});
