import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions, selectSummary, selectCategoryBreakdown, selectRecentTransactions } from '../store/slices/transactionSlice';
import { Header } from '../components/layout/Header';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { AIInsightCard } from '../components/dashboard/AIInsightCard';
import { ActiveAlerts } from '../components/dashboard/ActiveAlerts';
import { SpendingComposition } from '../components/dashboard/SpendingComposition';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { AI_INSIGHT_DATA, DASHBOARD_ALERTS, CHART_COLORS } from '../utils/constants';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const fetchLoading = useSelector(state => state.transactions.fetchLoading);
  const items = useSelector(state => state.transactions.items);
  const summary = useSelector(selectSummary);
  const categoryBreakdown = useSelector(selectCategoryBreakdown);
  const recentTransactions = useSelector(selectRecentTransactions);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchTransactions());
    }
  }, [dispatch, items.length]);

  // Derive dashboard data from real transactions
  const summaryData = {
    netWorth: {
      value: summary.totalBalance,
      trend: summary.savingsRate > 0 ? Math.round(summary.savingsRate * 10) / 10 : 0,
      trendText: 'savings rate',
      isPositive: summary.totalBalance >= 0
    },
    spending: {
      value: summary.totalExpenses,
      trend: summary.transactionCount,
      trendText: `across ${summary.transactionCount} transactions`,
      isPositive: false
    },
    savings: {
      value: summary.totalIncome,
      statusText: summary.savingsRate > 20 ? 'Healthy savings rate' : 'Consider saving more',
      isPositive: summary.savingsRate > 20
    }
  };

  // Derive spending composition from real category breakdown
  const spendingComposition = categoryBreakdown.slice(0, 4).map((cat, i) => ({
    id: cat.category,
    label: cat.category,
    percentage: cat.percentage,
    color: CHART_COLORS[i % CHART_COLORS.length]
  }));

  // Editor note derived from real data
  const topCat = categoryBreakdown[0];
  const editorNote = topCat
    ? `Your highest spending category is '${topCat.category}' at ${topCat.percentage}% of total expenses. Monitor this to optimize your budget.`
    : 'Add some transactions to see spending insights here.';

  // Map recent transactions to the activity format the RecentActivity component expects
  const recentActivity = recentTransactions.map(tx => ({
    id: tx._id,
    merchant: tx.merchant || tx.description,
    date: new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date(tx.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    category: tx.category.toUpperCase(),
    status: tx.status || 'CLEARED',
    amount: tx.type === 'expense' ? -tx.amount : tx.amount
  }));

  if (fetchLoading) {
    return (
      <div className="main-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your financial data...</p>
      </div>
    );
  }

  return (
    <div className="main-content">
      <Header />
      
      <main>
        <SummaryCards data={summaryData} />
        
        <div className="insight-alerts-grid">
          <AIInsightCard data={AI_INSIGHT_DATA} />
          <div className="card" style={{ padding: '2rem 1.5rem' }}>
            <ActiveAlerts alerts={DASHBOARD_ALERTS} />
          </div>
        </div>

        <div className="content-bottom-grid">
          <div className="card">
            <SpendingComposition data={spendingComposition} editorNote={editorNote} />
          </div>
          <div className="card">
            <RecentActivity activity={recentActivity} />
          </div>
        </div>
      </main>
    </div>
  );
}
