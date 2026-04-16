import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-input)',
  color: 'var(--text-primary)',
  fontSize: '0.875rem',
};

import { ALL_CATEGORIES } from '../../utils/constants';

export const TransactionModal = ({ isOpen, onClose, transaction, onSave }) => {
  const [formData, setFormData] = useState({
    merchant: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense'
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        merchant: transaction.merchant || transaction.description || '',
        category: transaction.category || '',
        amount: transaction.amount || '',
        date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : '',
        type: transaction.type || 'expense'
      });
    } else {
      setFormData({
        merchant: '',
        category: 'Food & Dining',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense'
      });
    }
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      amount: parseFloat(formData.amount),
      description: formData.merchant
    });
  };

  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2rem', animation: 'fadeIn 0.2s ease-out' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{transaction ? 'Edit Transaction' : 'Add Transaction'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Name / Merchant</label>
            <input
              required
              type="text"
              placeholder="e.g. Amazon, Swiggy"
              value={formData.merchant}
              onChange={e => setFormData({...formData, merchant: e.target.value})}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Amount (₹)</label>
              <input
                required
                type="number"
                step="0.01"
                min="1"
                placeholder="0.00"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                style={inputStyle}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
             <div style={{ flex: 1 }}>
              <label style={labelStyle}>Date</label>
              <input
                required
                type="date"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                style={inputStyle}
              >
                {ALL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.75rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
              {transaction ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
