import { useSelector } from 'react-redux';
import { selectSummary, selectInsights } from '../../store/slices/transactionSlice';
import { formatCurrency } from '../../utils/formatters';
import { getCategoryLabel } from '../../utils/constants';
import { TrendingUp, TrendingDown, PiggyBank, Receipt, Target, Flame, BarChart3 } from 'lucide-react';
import Card from '../common/Card';

export default function InsightCards() {
  const insights = useSelector(selectInsights);
  const summary = useSelector(selectSummary);

  const insightItems = [
    {
      icon: Flame,
      title: 'Top Spending Category',
      value: insights.topCategory ? getCategoryLabel(insights.topCategory.name) : 'N/A',
      detail: insights.topCategory ? formatCurrency(insights.topCategory.amount) + ' this month' : '',
      color: '#FB7185',
      glow: '0 0 20px rgba(251, 113, 133, 0.08)',
    },
    {
      icon: PiggyBank,
      title: 'Savings This Month',
      value: formatCurrency(insights.savingsThisMonth),
      detail: insights.savingsThisMonth >= 0 ? 'You\'re saving!' : 'Spending more than earning',
      color: insights.savingsThisMonth >= 0 ? '#34D399' : '#FB7185',
      glow: insights.savingsThisMonth >= 0 ? '0 0 20px rgba(52, 211, 153, 0.08)' : '0 0 20px rgba(251, 113, 133, 0.08)',
    },
    {
      icon: Target,
      title: 'Savings Rate',
      value: `${summary.savingsRate.toFixed(1)}%`,
      detail: 'Of total income saved',
      color: '#8B5CF6',
      glow: '0 0 20px rgba(139, 92, 246, 0.08)',
    },
    {
      icon: Receipt,
      title: 'Avg. Daily Spending',
      value: formatCurrency(insights.avgDailySpending),
      detail: 'Average per day this month',
      color: '#FBBF24',
      glow: '0 0 20px rgba(251, 191, 36, 0.08)',
    },
    {
      icon: TrendingDown,
      title: 'Expense Trend',
      value: `${insights.expenseChangePercent >= 0 ? '+' : ''}${insights.expenseChangePercent.toFixed(1)}%`,
      detail: 'vs last month',
      color: insights.expenseChangePercent <= 0 ? '#34D399' : '#FB7185',
      glow: '0 0 20px rgba(139, 92, 246, 0.06)',
    },
    {
      icon: TrendingUp,
      title: 'Income Trend',
      value: `${insights.incomeChangePercent >= 0 ? '+' : ''}${insights.incomeChangePercent.toFixed(1)}%`,
      detail: 'vs last month',
      color: insights.incomeChangePercent >= 0 ? '#34D399' : '#FB7185',
      glow: '0 0 20px rgba(139, 92, 246, 0.06)',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1 stagger-children">
      {insightItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card key={idx} className="flex items-start gap-4 relative overflow-hidden" hover padding="md" glow={item.glow}>
            {/* Accent bar */}
            <div className="absolute top-4 left-0 w-[3px] h-10 rounded-r-full" style={{ background: item.color }} />
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ml-2" style={{ background: `${item.color}15`, color: item.color }}>
              <Icon size={20} />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">{item.title}</span>
              <span className="text-xl font-bold font-display tracking-tight" style={{ color: item.color }}>{item.value}</span>
              <span className="text-xs text-text-secondary font-medium">{item.detail}</span>
            </div>
          </Card>
        );
      })}

      {/* Category Breakdown Detail */}
      {insights.categoryBreakdownThisMonth.length > 0 && (
        <Card className="col-span-full" padding="md">
          <div className="flex items-center gap-3 mb-5">
            <BarChart3 size={20} className="text-primary" />
            <h3 className="text-base font-bold text-text-primary font-display">This Month's Spending Breakdown</h3>
          </div>
          <div className="flex flex-col gap-4">
            {insights.categoryBreakdownThisMonth.slice(0, 6).map((cat, i) => {
              const maxAmount = insights.categoryBreakdownThisMonth[0]?.amount || 1;
              const widthPct = (cat.amount / maxAmount) * 100;
              return (
                <div key={cat.category} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[0.8125rem] font-semibold text-text-primary">{getCategoryLabel(cat.category)}</span>
                    <span className="text-[0.8125rem] font-bold text-text-secondary">{formatCurrency(cat.amount)}</span>
                  </div>
                  <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full animate-bar-grow"
                      style={{
                        width: `${widthPct}%`,
                        background: `linear-gradient(90deg, hsl(${260 + i * 20}, 70%, 55%), hsl(${280 + i * 20}, 60%, 50%))`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
