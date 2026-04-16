import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, Bell, User, Settings, Moon, Sun, Building, TrendingUp, TrendingDown, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useTheme } from '../../context/ThemeContext';
import { MARKET_DATA } from '../../utils/constants';
import './Header.css';

export const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { trackEvent } = useAnalytics();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  // Navigation tabs
  const tabs = [
    { label: 'Transactions', path: '/transactions' },
    { label: 'Budget', path: '/budget' },
    { label: 'Insights', path: '/insights' },
  ];

  // Search results — filter market data + transactions
  const transactions = useSelector(state => state.transactions.items);

  const searchResults = useMemo(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) return { stocks: [], transactions: [] };

    const q = debouncedSearchTerm.toLowerCase();

    const matchedStocks = MARKET_DATA.filter(s =>
      s.symbol.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.sector.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedTx = transactions.filter(t =>
      (t.merchant || '').toLowerCase().includes(q) ||
      (t.description || '').toLowerCase().includes(q) ||
      (t.category || '').toLowerCase().includes(q)
    ).slice(0, 4);

    return { stocks: matchedStocks, transactions: matchedTx };
  }, [debouncedSearchTerm, transactions]);

  const hasResults = searchResults.stocks.length > 0 || searchResults.transactions.length > 0;

  // Analytics
  useEffect(() => {
    if (debouncedSearchTerm) {
      trackEvent('search', { term: debouncedSearchTerm });
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [debouncedSearchTerm, trackEvent]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleStockClick = useCallback((stock) => {
    setSelectedStock(stock);
    setShowResults(false);
    setSearchTerm('');
    trackEvent('cta_click', { action: 'view_stock', symbol: stock.symbol });
  }, [trackEvent]);

  const handleTabClick = useCallback((path) => {
    navigate(path);
    trackEvent('cta_click', { action: 'header_nav', path });
  }, [navigate, trackEvent]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <>
      <header className="header">
    <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent' }}>
        <Building className="text-primary" size={24} />
      </div>
      <div>
        <div className="logo-text" style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.1 }}>Proton Finance</div>
        <div className="logo-sub" style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wealth Curator</div>
      </div>
    </div>

        {/* Search Bar with Dropdown */}
        <div className="search-bar desktop-only" ref={searchRef} style={{ position: 'relative' }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search stocks, markets, transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => debouncedSearchTerm && setShowResults(true)}
            aria-label="Search stocks and transactions"
          />
          {searchTerm && (
            <button onClick={() => { setSearchTerm(''); setShowResults(false); }} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          )}

          {/* Search Dropdown */}
          {showResults && debouncedSearchTerm && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 12px 40px rgba(0,0,0,0.3)', zIndex: 100, maxHeight: '400px', overflowY: 'auto' }}>
              {!hasResults ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No results for "{debouncedSearchTerm}"</div>
              ) : (
                <>
                  {/* Stock Results */}
                  {searchResults.stocks.length > 0 && (
                    <div>
                      <div style={{ padding: '0.75rem 1rem 0.5rem', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Markets & Stocks</div>
                      {searchResults.stocks.map(stock => (
                        <button key={stock.id} onClick={() => handleStockClick(stock)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', textAlign: 'left', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-input)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: stock.change >= 0 ? 'rgba(52,211,153,0.12)' : 'rgba(251,113,133,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stock.change >= 0 ? '#34D399' : '#FB7185' }}>
                              {stock.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{stock.symbol}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{stock.name}</div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>₹{stock.price.toLocaleString('en-IN')}</div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: stock.change >= 0 ? '#34D399' : '#FB7185' }}>{stock.change >= 0 ? '+' : ''}{stock.change}%</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Transaction Results */}
                  {searchResults.transactions.length > 0 && (
                    <div style={{ borderTop: searchResults.stocks.length > 0 ? '1px solid var(--border-color)' : 'none' }}>
                      <div style={{ padding: '0.75rem 1rem 0.5rem', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Transactions</div>
                      {searchResults.transactions.map(tx => (
                        <button key={tx._id} onClick={() => { navigate('/transactions'); setShowResults(false); setSearchTerm(''); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', textAlign: 'left', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-input)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{tx.merchant}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{tx.category} • {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                          </div>
                          <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: tx.type === 'income' ? '#34D399' : 'var(--text-primary)' }}>
                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="header-tabs desktop-only">
          {tabs.map(tab => (
            <button
              key={tab.path}
              className={`header-tab ${location.pathname === tab.path ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.path)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="header-actions">
          <button style={{ color: 'var(--text-secondary)' }} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button style={{ color: 'var(--text-secondary)' }} aria-label="Notifications">
            <Bell size={20} />
          </button>
          <button className="desktop-only" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', backgroundColor: 'transparent' }}>
            Settings
          </button>
          <div className="desktop-only" style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={16} />
          </div>
        </div>
      </header>

      {/* Stock Detail Modal */}
      {selectedStock && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setSelectedStock(null)}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
          <div className="card" style={{ position: 'relative', width: '100%', maxWidth: '480px', padding: '2rem', zIndex: 1 }} onClick={e => e.stopPropagation()}>
            {/* Close */}
            <button onClick={() => setSelectedStock(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} aria-label="Close">
              <X size={18} />
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: selectedStock.change >= 0 ? 'rgba(52,211,153,0.12)' : 'rgba(251,113,133,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedStock.change >= 0 ? '#34D399' : '#FB7185' }}>
                {selectedStock.change >= 0 ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedStock.symbol}</h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{selectedStock.name}</p>
              </div>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 700 }}>₹{selectedStock.price.toLocaleString('en-IN')}</span>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: selectedStock.change >= 0 ? '#34D399' : '#FB7185' }}>
                {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change}%
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {selectedStock.description}
            </p>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Market Cap', value: selectedStock.marketCap },
                { label: 'P/E Ratio', value: selectedStock.pe },
                { label: '52W High', value: selectedStock.high52w },
                { label: '52W Low', value: selectedStock.low52w },
                { label: 'Sector', value: selectedStock.sector },
                { label: 'Exchange', value: 'NSE' },
              ].map(stat => (
                <div key={stat.label} style={{ padding: '0.75rem', backgroundColor: 'var(--bg-input)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{stat.label}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="btn-primary" onClick={() => { trackEvent('execute_strategy', { symbol: selectedStock.symbol }); setSelectedStock(null); }} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
              Add to Watchlist
            </button>
          </div>
        </div>
      )}
    </>
  );
};
