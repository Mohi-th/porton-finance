import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchTransactions } from './store/slices/transactionSlice';
import { Sidebar } from './components/layout/Sidebar';
import { MobileDock } from './components/layout/MobileDock';
import { useAnalytics } from './hooks/useAnalytics';
import { ThemeProvider } from './context/ThemeContext';

// Code Splitting and Lazy Loading
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const TransactionsPage = React.lazy(() => import('./pages/TransactionsPage'));
const InsightsPage = React.lazy(() => import('./pages/InsightsPage'));
const BudgetPage = React.lazy(() => import('./pages/BudgetPage'));

const AppContent = () => {
  const dispatch = useDispatch();
  
  // Initialize analytics tracking
  useAnalytics();

  // Fetch transactions on app mount
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <div className="app-layout">
      <Sidebar />
      <Suspense 
        fallback={
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
            Loading Application...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          {/* Default fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
      <MobileDock />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
