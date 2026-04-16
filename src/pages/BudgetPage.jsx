import React, { useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentMonthBreakdown } from '../store/slices/transactionSlice';
import { Header } from '../components/layout/Header';
import { formatCurrency } from '../utils/formatters';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAnalytics } from '../hooks/useAnalytics';
import { Target, TrendingDown, ShieldCheck, AlertTriangle, Edit3, X, Save, Plus } from 'lucide-react';
import { DEFAULT_BUDGET_LIMITS, CHART_COLORS, ALL_CATEGORIES } from '../utils/constants';
import './BudgetPage.css';

export default function BudgetPage() {
  const { breakdown: currentMonthBreakdown, totalExpenses } = useSelector(selectCurrentMonthBreakdown);
  const { trackEvent } = useAnalytics();

  // Persist budget limits in localStorage
  const [budgetLimits, setBudgetLimits] = useLocalStorage('proton_budget_limits', DEFAULT_BUDGET_LIMITS);

  // Modal state
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');

  const budgetItems = useMemo(() => {
    // Get all categories from both budget limits and actual spending
    const allCategories = new Set([
      ...Object.keys(budgetLimits),
      ...currentMonthBreakdown.map(c => c.category)
    ]);

    return Array.from(allCategories).map((category, i) => {
      const spent = currentMonthBreakdown.find(c => c.category === category);
      const amount = spent ? spent.amount : 0;
      const limit = budgetLimits[category] || 3000;
      const percentage = Math.min((amount / limit) * 100, 100);
      const isOver = amount > limit;
      return {
        category,
        amount,
        limit,
        percentage,
        isOver,
        remaining: limit - amount,
        color: CHART_COLORS[i % CHART_COLORS.length],
      };
    }).sort((a, b) => b.amount - a.amount);
  }, [currentMonthBreakdown, budgetLimits]);

  const totalBudget = useMemo(() => {
    return Object.values(budgetLimits).reduce((s, v) => s + v, 0);
  }, [budgetLimits]);

  const totalRemaining = totalBudget - totalExpenses;
  const overallPct = totalBudget > 0 ? Math.min((totalExpenses / totalBudget) * 100, 100) : 0;
  const overBudgetCount = budgetItems.filter(b => b.isOver).length;

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Handlers
  const handleEditBudget = useCallback((category, currentLimit) => {
    setEditingCategory(category);
    setEditValue(currentLimit.toString());
    trackEvent('cta_click', { action: 'edit_budget', category });
  }, [trackEvent]);

  const handleSaveBudget = useCallback(() => {
    const val = parseInt(editValue, 10);
    if (!isNaN(val) && val > 0) {
      setBudgetLimits(prev => ({ ...prev, [editingCategory]: val }));
      trackEvent('cta_click', { action: 'save_budget', category: editingCategory, limit: val });
    }
    setEditingCategory(null);
    setEditValue('');
  }, [editingCategory, editValue, setBudgetLimits, trackEvent]);

  const handleAddCategory = useCallback(() => {
    const val = parseInt(newLimit, 10);
    const categoryToUse = newCategory === 'CUSTOM_OTHER' ? customCategory.trim() : newCategory.trim();
    
    if (categoryToUse && !isNaN(val) && val > 0) {
      setBudgetLimits(prev => ({ ...prev, [categoryToUse]: val }));
      trackEvent('cta_click', { action: 'add_budget', category: categoryToUse, limit: val });
    }
    setShowAddModal(false);
    setNewCategory('');
    setCustomCategory('');
    setNewLimit('');
  }, [newCategory, customCategory, newLimit, setBudgetLimits, trackEvent]);

  const handleDeleteBudget = useCallback((category) => {
    setBudgetLimits(prev => {
      const updated = { ...prev };
      delete updated[category];
      return updated;
    });
    trackEvent('cta_click', { action: 'delete_budget', category });
  }, [setBudgetLimits, trackEvent]);

  const handleResetDefaults = useCallback(() => {
    setBudgetLimits(DEFAULT_BUDGET_LIMITS);
    trackEvent('cta_click', { action: 'reset_budgets' });
  }, [setBudgetLimits, trackEvent]);

  // Input styles
  const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.875rem' };

  return (
    <div className="main-content budget-page">
      <Header />
      <main role="main">
        <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }} aria-label="Budget overview">
          <div>
            <h1 className="text-h1">Budget Tracking</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {currentMonth} — Set and monitor your spending limits.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.25rem', borderRadius: '24px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem' }}>
              <Plus size={14} /> Add Category
            </button>
            <button onClick={handleResetDefaults} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1rem', borderRadius: '24px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem' }}>
              Reset Defaults
            </button>
          </div>
        </section>

        {/* Summary Cards */}
        <section className="summary-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }} aria-label="Budget summary">
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3B82F618', color: '#3B82F6' }}><Target size={18} /></div>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Budget</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatCurrency(totalBudget)}</div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FB718518', color: '#FB7185' }}><TrendingDown size={18} /></div>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Spent This Month</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: overallPct > 90 ? 'var(--color-danger)' : 'var(--text-primary)' }}>{formatCurrency(totalExpenses)}</div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: totalRemaining >= 0 ? '#34D39918' : '#EF444418', color: totalRemaining >= 0 ? '#34D399' : '#EF4444' }}><ShieldCheck size={18} /></div>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Remaining</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: totalRemaining >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{formatCurrency(totalRemaining)}</div>
          </div>
        </section>

        {/* Overall Progress */}
        <section className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }} aria-label="Overall budget progress">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Overall Budget Usage</span>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: overallPct > 90 ? 'var(--color-danger)' : overallPct > 70 ? 'var(--color-warning)' : 'var(--color-success)' }}>{overallPct.toFixed(0)}%</span>
          </div>
          <div role="progressbar" aria-valuenow={Math.round(overallPct)} aria-valuemin={0} aria-valuemax={100} style={{ width: '100%', height: '10px', backgroundColor: 'var(--bg-input)', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{ width: `${overallPct}%`, height: '100%', borderRadius: '100px', backgroundColor: overallPct > 90 ? 'var(--color-danger)' : overallPct > 70 ? 'var(--color-warning)' : 'var(--color-success)', transition: 'width 0.6s ease' }} />
          </div>
          {overBudgetCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--color-danger)' }}>
              <AlertTriangle size={14} />
              <span>{overBudgetCount} categor{overBudgetCount === 1 ? 'y is' : 'ies are'} over budget</span>
            </div>
          )}
        </section>

        {/* Per-Category Budgets */}
        <section aria-label="Category budgets">
          <h3 className="text-h3" style={{ marginBottom: '1rem' }}>Category Budgets</h3>
          {budgetItems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {budgetItems.map(item => (
                <div key={item.category} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.category}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem' }}>
                      <span style={{ color: item.isOver ? 'var(--color-danger)' : 'var(--text-secondary)', fontWeight: 600 }}>{formatCurrency(item.amount)}</span>
                      <span style={{ color: 'var(--text-muted)' }}>/ {formatCurrency(item.limit)}</span>
                      <button onClick={() => handleEditBudget(item.category, item.limit)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} aria-label={`Edit ${item.category} budget`}>
                        <Edit3 size={14} />
                      </button>
                    </div>
                  </div>
                  <div role="progressbar" aria-valuenow={Math.round(item.percentage)} aria-valuemin={0} aria-valuemax={100} style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-input)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ width: `${item.percentage}%`, height: '100%', borderRadius: '100px', backgroundColor: item.isOver ? 'var(--color-danger)' : item.color, transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    {item.isOver ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 500 }}>
                        <AlertTriangle size={12} /> Over by {formatCurrency(Math.abs(item.remaining))}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {formatCurrency(item.remaining)} remaining
                      </div>
                    )}
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.percentage.toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              <p>No budget categories set. Click "Add Category" to get started.</p>
            </div>
          )}
        </section>
      </main>

      {/* Edit Budget Modal */}
      {editingCategory && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setEditingCategory(null)}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
          <div className="card" style={{ position: 'relative', width: '100%', maxWidth: '400px', padding: '2rem', zIndex: 1 }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setEditingCategory(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={16} /></button>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Edit Budget Limit</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Set the monthly budget for <strong>{editingCategory}</strong></p>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Limit (₹)</label>
              <input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveBudget()} style={inputStyle} autoFocus min="100" step="500" />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => { handleDeleteBudget(editingCategory); setEditingCategory(null); }} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-danger)', backgroundColor: 'transparent', color: 'var(--color-danger)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>Remove</button>
              <button onClick={handleSaveBudget} className="btn-primary" style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Save size={14} /> Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowAddModal(false)}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
          <div className="card" style={{ position: 'relative', width: '100%', maxWidth: '400px', padding: '2rem', zIndex: 1 }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={16} /></button>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Add Budget Category</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category Name</label>
              <select 
                value={newCategory} 
                onChange={e => setNewCategory(e.target.value)} 
                style={inputStyle} 
                autoFocus
              >
                <option value="">Select Category</option>
                {ALL_CATEGORIES
                  .filter(cat => !budgetLimits[cat]) // Only show categories that don't have a budget yet
                  .map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                <option value="CUSTOM_OTHER">--- Custom Other ---</option>
              </select>
            </div>
            {newCategory === 'CUSTOM_OTHER' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Custom Category Name</label>
                <input 
                  type="text" 
                  value={customCategory}
                  placeholder="e.g. Pet Care" 
                  style={inputStyle} 
                  onChange={e => setCustomCategory(e.target.value)}
                />
              </div>
            )}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Limit (₹)</label>
              <input type="number" value={newLimit} onChange={e => setNewLimit(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddCategory()} placeholder="5000" style={inputStyle} min="100" step="500" />
            </div>
            <button 
              onClick={handleAddCategory} 
              disabled={(!newCategory.trim() || (newCategory === 'CUSTOM_OTHER' && !customCategory.trim())) || !newLimit} 
              className="btn-primary" 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                border: 'none', 
                cursor: 'pointer', 
                fontWeight: 600, 
                fontSize: '0.875rem', 
                opacity: ((!newCategory.trim() || (newCategory === 'CUSTOM_OTHER' && !customCategory.trim())) || !newLimit) ? 0.5 : 1 
              }}
            >
              Add Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
