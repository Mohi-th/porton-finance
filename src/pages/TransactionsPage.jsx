import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchTransactions, 
  selectFilteredTransactions, 
  addTransactionAsync, 
  updateTransactionAsync, 
  deleteTransactionAsync,
  setFilter 
} from '../store/slices/transactionSlice';
import { Header } from '../components/layout/Header';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { Search, Download, Plus, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useConfirmDialog } from '../components/common/ConfirmDialog';
import { useDebounce } from '../hooks/useDebounce';
import { useAnalytics } from '../hooks/useAnalytics';
import './TransactionsPage.css';

const ITEMS_PER_PAGE = 10;

const CATEGORIES = ['All', 'Salary', 'Food & Dining', 'Shopping', 'Utilities', 'Transport', 'Entertainment', 'Healthcare', 'Groceries', 'Housing', 'Freelance', 'Investment'];
const TYPES = ['All', 'Income', 'Expense'];
const SORT_OPTIONS = [
  { label: 'Date (Newest)', value: 'date_desc' },
  { label: 'Date (Oldest)', value: 'date_asc' },
  { label: 'Amount (High)', value: 'amount_desc' },
  { label: 'Amount (Low)', value: 'amount_asc' },
];

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();
  const allTransactions = useSelector(selectFilteredTransactions);
  const filters = useSelector(state => state.transactions.filters);
  const loading = useSelector(state => state.transactions.fetchLoading);
  const error = useSelector(state => state.transactions.error);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [ConfirmDialogEl, showConfirm] = useConfirmDialog();

  useEffect(() => { dispatch(fetchTransactions()); }, [dispatch]);

  useEffect(() => {
    dispatch(setFilter({ key: 'search', value: debouncedSearch }));
    setCurrentPage(1);
    if (debouncedSearch) trackEvent('search', { term: debouncedSearch, page: 'transactions' });
  }, [debouncedSearch, dispatch, trackEvent]);

  // Pagination
  const totalPages = useMemo(() => Math.ceil(allTransactions.length / ITEMS_PER_PAGE), [allTransactions.length]);
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return allTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [allTransactions, currentPage]);
  const pageNumbers = useMemo(() => {
    const pages = [];
    const max = 5;
    let s = Math.max(1, currentPage - Math.floor(max / 2));
    let e = Math.min(totalPages, s + max - 1);
    if (e - s + 1 < max) s = Math.max(1, e - max + 1);
    for (let i = s; i <= e; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  const countText = useMemo(() => {
    if (allTransactions.length === 0) return '0 transactions';
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, allTransactions.length);
    return `Showing ${start}–${end} of ${allTransactions.length}`;
  }, [allTransactions.length, currentPage]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.type !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.sort !== 'date_desc') count++;
    return count;
  }, [filters]);

  // Handlers
  const handleFilterChange = useCallback((key, value) => {
    dispatch(setFilter({ key, value }));
    setCurrentPage(1);
    trackEvent('filter_click', { filter: key, value });
  }, [dispatch, trackEvent]);

  const handleClearFilters = useCallback(() => {
    dispatch(setFilter({ key: 'type', value: 'all' }));
    dispatch(setFilter({ key: 'category', value: 'all' }));
    dispatch(setFilter({ key: 'sort', value: 'date_desc' }));
    setCurrentPage(1);
  }, [dispatch]);

  const handleSortCycle = useCallback(() => {
    const sortOrder = ['date_desc', 'date_asc', 'amount_desc', 'amount_asc'];
    const current = sortOrder.indexOf(filters.sort);
    const next = sortOrder[(current + 1) % sortOrder.length];
    dispatch(setFilter({ key: 'sort', value: next }));
    setCurrentPage(1);
    trackEvent('filter_click', { action: 'sort_cycle', value: next });
  }, [filters.sort, dispatch, trackEvent]);

  const handleExportCSV = useCallback(() => {
    trackEvent('cta_click', { action: 'export_csv' });
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = allTransactions.map(t => [new Date(t.date).toLocaleDateString(), t.merchant || t.description, t.category, t.type, t.amount]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click();
    URL.revokeObjectURL(url);
  }, [allTransactions, trackEvent]);

  const handleAdd = useCallback(() => { setEditingTx(null); setIsModalOpen(true); trackEvent('cta_click', { action: 'add_transaction' }); }, [trackEvent]);
  const handleEdit = useCallback((tx) => { setEditingTx(tx); setIsModalOpen(true); }, []);
  const handleDelete = useCallback(async (id) => {
    const confirmed = await showConfirm({ title: 'Delete Transaction', message: 'This action cannot be undone. Are you sure you want to delete this transaction?', confirmText: 'Delete', cancelText: 'Keep it' });
    if (confirmed) { dispatch(deleteTransactionAsync(id)); trackEvent('transaction_delete', { id }); }
  }, [dispatch, trackEvent, showConfirm]);
  const handleSaveModal = useCallback((txData) => {
    if (editingTx) { dispatch(updateTransactionAsync({ id: editingTx._id, ...txData })); } else { dispatch(addTransactionAsync(txData)); }
    setIsModalOpen(false);
  }, [editingTx, dispatch]);
  const goToPage = useCallback((page) => { setCurrentPage(Math.max(1, Math.min(page, totalPages))); }, [totalPages]);

  // Pill style helper
  const pillStyle = (isActive) => ({
    padding: '0.4rem 0.875rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
    backgroundColor: isActive ? 'var(--color-primary)' : 'var(--bg-input)',
    color: isActive ? '#fff' : 'var(--text-secondary)',
  });

  return (
    <div className="main-content transactions-page">
      <Header />
      <main style={{ padding: '0 1rem' }} role="main">
        {/* Header */}
        <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 className="text-h1">Transactions</h1>
            <p style={{ color: 'var(--text-muted)' }}>{countText}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" onClick={handleExportCSV} aria-label="Export CSV" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1rem', backgroundColor: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}>
              <Download size={16} /> Export CSV
            </button>
            <button className="btn btn-primary" onClick={handleAdd} aria-label="Add transaction" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.25rem', borderRadius: '24px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              <Plus size={16} /> Add Transaction
            </button>
          </div>
        </section>

        {/* Search + Filter/Sort Buttons */}
        <section style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name or category..." aria-label="Search transactions" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '24px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => { setShowFilters(!showFilters); trackEvent('filter_click', { action: 'toggle_panel' }); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.25rem', borderRadius: '24px', border: `1px solid ${showFilters ? 'var(--color-primary)' : 'var(--border-color)'}`, backgroundColor: showFilters ? 'rgba(0,82,204,0.1)' : 'transparent', color: showFilters ? 'var(--color-primary)' : 'var(--text-muted)', cursor: 'pointer', position: 'relative' }}>
              <SlidersHorizontal size={16} /> Filters
              {activeFilterCount > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{activeFilterCount}</span>}
            </button>
            <button onClick={handleSortCycle} title={`Sort: ${SORT_OPTIONS.find(s => s.value === filters.sort)?.label}`} style={{ padding: '0.75rem', borderRadius: '50%', border: `1px solid ${filters.sort !== 'date_desc' ? 'var(--color-primary)' : 'var(--border-color)'}`, backgroundColor: filters.sort !== 'date_desc' ? 'rgba(0,82,204,0.1)' : 'transparent', color: filters.sort !== 'date_desc' ? 'var(--color-primary)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpDown size={16} />
            </button>
          </div>
        </section>

        {/* Filter Panel */}
        {showFilters && (
          <section className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }} aria-label="Filter options">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filter By</span>
              {activeFilterCount > 0 && (
                <button onClick={handleClearFilters} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  <X size={12} /> Clear all
                </button>
              )}
            </div>
            {/* Type pills */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {TYPES.map(t => (
                  <button key={t} onClick={() => handleFilterChange('type', t === 'All' ? 'all' : t.toLowerCase())} style={pillStyle(filters.type === (t === 'All' ? 'all' : t.toLowerCase()))}>{t}</button>
                ))}
              </div>
            </div>
            {/* Category pills */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => handleFilterChange('category', c === 'All' ? 'all' : c)} style={pillStyle(filters.category === (c === 'All' ? 'all' : c))}>{c}</button>
                ))}
              </div>
            </div>
            {/* Sort */}
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort By</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {SORT_OPTIONS.map(s => (
                  <button key={s.value} onClick={() => handleFilterChange('sort', s.value)} style={pillStyle(filters.sort === s.value)}>{s.label}</button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Table */}
        <section className="card" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading transactions...</div>
          ) : error ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-danger)' }}>Error: {error}</div>
          ) : allTransactions.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>No transactions found.</p>
              <p style={{ fontSize: '0.875rem' }}>{filters.search || filters.type !== 'all' || filters.category !== 'all' ? 'Try adjusting your filters.' : 'Add your first transaction!'}</p>
            </div>
          ) : (
            <TransactionTable transactions={paginatedTransactions} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </section>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', marginBottom: '2rem' }} aria-label="Pagination">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}>
              <ChevronLeft size={16} />
            </button>
            {pageNumbers[0] > 1 && (<><button onClick={() => goToPage(1)} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>1</button>{pageNumbers[0] > 2 && <span style={{ color: 'var(--text-muted)' }}>…</span>}</>)}
            {pageNumbers.map(num => (
              <button key={num} onClick={() => goToPage(num)} aria-current={num === currentPage ? 'page' : undefined} style={{ width: '36px', height: '36px', borderRadius: '8px', border: num === currentPage ? 'none' : '1px solid var(--border-color)', backgroundColor: num === currentPage ? 'var(--color-primary)' : 'transparent', color: num === currentPage ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>{num}</button>
            ))}
            {pageNumbers[pageNumbers.length - 1] < totalPages && (<>{pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span style={{ color: 'var(--text-muted)' }}>…</span>}<button onClick={() => goToPage(totalPages)} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>{totalPages}</button></>)}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1 }}>
              <ChevronRight size={16} />
            </button>
          </nav>
        )}
      </main>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} transaction={editingTx} onSave={handleSaveModal} />
      {ConfirmDialogEl}
    </div>
  );
}
