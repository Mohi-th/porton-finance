import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectSummary, selectInsights, selectCategoryBreakdown, selectMonthlyData } from '../store/slices/transactionSlice';
import { Header } from '../components/layout/Header';
import { useAnalytics } from '../hooks/useAnalytics';
import { formatCurrency } from '../utils/formatters';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, PiggyBank, Receipt, Target, Flame, BarChart3, Lightbulb, AlertTriangle } from 'lucide-react';
import { CHART_COLORS } from '../utils/constants';
import './InsightsPage.css';

// ─── Memoized Chart Tooltip ───
const ChartTooltip = React.memo(({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card" style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', border: '1px solid var(--border-color)' }}>
      <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {payload.map((entry, i) => (
        <div key={i} style={{ fontWeight: 700, color: entry.color }}>{entry.name}: {formatCurrency(entry.value)}</div>
      ))}
    </div>
  );
});

export default function InsightsPage() {
  const { trackEvent } = useAnalytics();
  const summary = useSelector(selectSummary);
  const insights = useSelector(selectInsights);
  const categoryBreakdown = useSelector(selectCategoryBreakdown);
  const monthlyData = useSelector(selectMonthlyData);

  // ─── Memoized dynamic AI insights ───
  const aiInsights = useMemo(() => {
    const items = [];

    // Insight 1: Top spending category
    if (insights.topCategory) {
      const pct = insights.currentMonthExpenses > 0 ? ((insights.topCategory.amount / insights.currentMonthExpenses) * 100).toFixed(0) : 0;
      items.push({
        icon: Flame, color: '#FB7185',
        text: `Your highest expense category is "${insights.topCategory.name}" at ${pct}% of monthly spend — totaling ${formatCurrency(insights.topCategory.amount)}.`
      });
    }

    // Insight 2: Savings rate
    if (summary.savingsRate > 20) {
      items.push({
        icon: PiggyBank, color: '#34D399',
        text: `Excellent! You're saving ${summary.savingsRate.toFixed(1)}% of your income. That's above the recommended 20% threshold.`
      });
    } else if (summary.savingsRate > 0) {
      items.push({
        icon: AlertTriangle, color: '#F59E0B',
        text: `Your savings rate is ${summary.savingsRate.toFixed(1)}%. Financial experts recommend saving at least 20% — consider reducing discretionary spending.`
      });
    }

    // Insight 3: Expense trend
    if (insights.expenseChangePercent !== 0) {
      const direction = insights.expenseChangePercent > 0 ? 'increased' : 'decreased';
      items.push({
        icon: insights.expenseChangePercent > 0 ? TrendingUp : TrendingDown,
        color: insights.expenseChangePercent > 0 ? '#FB7185' : '#34D399',
        text: `Monthly expenses ${direction} by ${Math.abs(insights.expenseChangePercent).toFixed(1)}% compared to last month.`
      });
    }

    // Insight 4: Average daily spending
    if (insights.avgDailySpending > 0) {
      const projected = insights.avgDailySpending * 30;
      items.push({
        icon: Receipt, color: '#FBBF24',
        text: `At your current rate of ${formatCurrency(insights.avgDailySpending)}/day, your projected monthly spending is ${formatCurrency(projected)}.`
      });
    }

    // Insight 5: Income trend
    if (insights.incomeChangePercent !== 0) {
      items.push({
        icon: TrendingUp, color: insights.incomeChangePercent >= 0 ? '#34D399' : '#FB7185',
        text: `Income ${insights.incomeChangePercent >= 0 ? 'grew' : 'dropped'} by ${Math.abs(insights.incomeChangePercent).toFixed(1)}% vs last month. ${insights.incomeChangePercent >= 0 ? 'Great momentum!' : 'Diversify income streams.'}`
      });
    }

    // Insight 6: Potential savings from biggest expense
    if (insights.biggestExpense) {
      const annualSaving = insights.biggestExpense.amount * 0.15 * 12;
      items.push({
        icon: Target, color: '#8B5CF6',
        text: `By reducing your largest expense ("${insights.biggestExpense.description}") by 15%, you could save ${formatCurrency(annualSaving)} annually.`
      });
    }

    return items;
  }, [insights, summary]);

  // Stat cards data
  const statCards = useMemo(() => [
    { label: 'Savings Rate', value: `${summary.savingsRate.toFixed(1)}%`, color: '#8B5CF6', icon: Target },
    { label: 'Avg. Daily Spend', value: formatCurrency(insights.avgDailySpending), color: '#FBBF24', icon: Receipt },
    { label: 'Expense Trend', value: `${insights.expenseChangePercent >= 0 ? '+' : ''}${insights.expenseChangePercent.toFixed(1)}%`, color: insights.expenseChangePercent <= 0 ? '#34D399' : '#FB7185', icon: insights.expenseChangePercent <= 0 ? TrendingDown : TrendingUp },
    { label: 'Savings This Month', value: formatCurrency(insights.savingsThisMonth), color: insights.savingsThisMonth >= 0 ? '#34D399' : '#FB7185', icon: PiggyBank },
  ], [summary, insights]);

  const handleCTAClick = useCallback((action) => {
    trackEvent('cta_click', { action, page: 'insights' });
  }, [trackEvent]);

  return (
    <div className="main-content insights-page">
      <Header />
      <main>
        {/* Page Title */}
        <section style={{ marginBottom: '1.5rem' }}>
          <h1 className="text-h1">AI Insights</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Financial analysis & spending patterns driven by Proton AI.
          </p>
        </section>

        {/* Stat Cards Grid */}
        <section className="summary-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }} aria-label="Key metrics">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${stat.color}18`, color: stat.color }}>
                    <Icon size={18} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
              </div>
            );
          })}
        </section>

        {/* Charts Grid */}
        <section className="insight-alerts-grid" style={{ marginBottom: '1.5rem' }} aria-label="Charts">
          {/* Balance Trend */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
              <h3 className="text-h3">Balance Trend</h3>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last 6 months</span>
            </div>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34D399" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="income" name="Income" stroke="#34D399" strokeWidth={2} fill="url(#incomeFill)" dot={false} />
                  <Area type="monotone" dataKey="cumulativeBalance" name="Balance" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#balanceFill)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Spending Breakdown Pie */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
              <h3 className="text-h3">Spending Breakdown</h3>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>By category</span>
            </div>
            {categoryBreakdown.length > 0 ? (
              <>
                <div style={{ width: '100%', height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryBreakdown.slice(0, 6)} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="amount" stroke="none">
                        {categoryBreakdown.slice(0, 6).map((entry, i) => (
                          <Cell key={entry.category} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {categoryBreakdown.slice(0, 6).map((item, i) => (
                    <div key={item.category} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: CHART_COLORS[i % CHART_COLORS.length], flexShrink: 0 }} />
                      <span style={{ flex: 1, color: 'var(--text-secondary)', fontWeight: 500 }}>{item.category}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.75rem' }}>{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No expense data to display.</div>
            )}
          </div>
        </section>

        {/* Income vs Expenses Bar Chart */}
        <section style={{ marginBottom: '1.5rem' }} aria-label="Monthly comparison">
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
              <h3 className="text-h3">Income vs Expenses</h3>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly comparison</span>
            </div>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barGap={4}>
                  <defs>
                    <linearGradient id="incomeBarG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34D399" stopOpacity={1} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="expenseBarG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FB7185" stopOpacity={1} />
                      <stop offset="100%" stopColor="#E11D48" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: 'var(--text-secondary)' }} />
                  <Bar dataKey="income" name="Income" fill="url(#incomeBarG)" radius={[6, 6, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="expenses" name="Expenses" fill="url(#expenseBarG)" radius={[6, 6, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* AI Insights — Dynamic */}
        <section aria-label="AI-generated insights">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <Lightbulb size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 className="text-h3">AI-Generated Insights</h3>
          </div>
          {aiInsights.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              {aiInsights.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: 'pointer', transition: 'background-color 0.2s' }} onClick={() => handleCTAClick(`insight_${i}`)} role="button" tabIndex={0} aria-label={item.text} onKeyDown={e => e.key === 'Enter' && handleCTAClick(`insight_${i}`)}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${item.color}18`, color: item.color, flexShrink: 0 }}>
                      <Icon size={18} />
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>{item.text}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              <p>Add more transactions to generate AI insights.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
