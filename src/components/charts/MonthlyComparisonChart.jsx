import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useSelector } from 'react-redux';
import { selectMonthlyData } from '../../store/slices/transactionSlice';
import { formatCurrency } from '../../utils/formatters';
import Card from '../common/Card';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-static px-4 py-3 shadow-lg" style={{ borderRadius: '12px' }}>
      <p className="text-[11px] text-text-muted mb-1 font-semibold uppercase tracking-wider">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-[0.8125rem] font-bold" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
};

export default function MonthlyComparisonChart() {
  const monthlyData = useSelector(selectMonthlyData);

  return (
    <Card className="animate-fade-in-up" padding="md">
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="text-base font-bold text-text-primary font-display">Income vs Expenses</h3>
        <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Monthly comparison</span>
      </div>
      <div className="w-full" style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barGap={4}>
            <defs>
              <linearGradient id="incomeBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34D399" stopOpacity={1} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="expenseBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FB7185" stopOpacity={1} />
                <stop offset="100%" stopColor="#E11D48" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--color-glass-border)" vertical={false} />
            <XAxis dataKey="month" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: 'var(--color-text-secondary)' }} />
            <Bar dataKey="income" name="Income" fill="url(#incomeBarGrad)" radius={[6, 6, 0, 0]} maxBarSize={28} animationDuration={800} />
            <Bar dataKey="expenses" name="Expenses" fill="url(#expenseBarGrad)" radius={[6, 6, 0, 0]} maxBarSize={28} animationDuration={800} animationBegin={200} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
