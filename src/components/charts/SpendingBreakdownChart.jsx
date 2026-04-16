import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useSelector } from 'react-redux';
import { selectCategoryBreakdown } from '../../store/slices/transactionSlice';
import { getCategoryLabel } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { CHART_COLORS } from '../../utils/constants';
import Card from '../common/Card';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="glass-card-static px-4 py-3 shadow-lg" style={{ borderRadius: '12px' }}>
      <p className="text-[11px] text-text-muted mb-1 font-semibold uppercase tracking-wider">{getCategoryLabel(data.category)}</p>
      <p className="text-[0.8125rem] font-bold text-text-primary">{formatCurrency(data.amount)}</p>
      <p className="text-xs text-text-muted mt-0.5">{data.percentage}%</p>
    </div>
  );
};

export default function SpendingBreakdownChart() {
  const breakdown = useSelector(selectCategoryBreakdown);
  const topCategories = breakdown.slice(0, 8);

  return (
    <Card className="animate-fade-in-up" padding="md">
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="text-base font-bold text-text-primary font-display">Spending Breakdown</h3>
        <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider">By category</span>
      </div>
      <div className="flex items-center gap-6 max-sm:flex-col">
        <div className="shrink-0 w-[220px] max-sm:w-full" style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topCategories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="amount"
                stroke="none"
                animationBegin={200}
                animationDuration={800}
              >
                {topCategories.map((entry, index) => (
                  <Cell key={entry.category} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 flex flex-col gap-2.5">
          {topCategories.map((item, index) => (
            <div key={item.category} className="flex items-center gap-2.5 text-[0.8125rem]">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} />
              <span className="flex-1 text-text-secondary font-medium">{getCategoryLabel(item.category)}</span>
              <span className="text-text-primary font-semibold text-xs">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
