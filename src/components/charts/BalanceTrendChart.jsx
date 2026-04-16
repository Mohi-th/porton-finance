import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

export default function BalanceTrendChart() {
  const monthlyData = useSelector(selectMonthlyData);

  return (
    <Card className="animate-fade-in-up" padding="md">
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="text-base font-bold text-text-primary font-display">Balance Trend</h3>
        <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Last 6 months</span>
      </div>
      <div className="w-full" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              {/* Rich teal gradient fill like reference */}
              <linearGradient id="balanceAreaFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.25} />
                <stop offset="40%" stopColor="#22D3EE" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#34D399" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="incomeAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="var(--color-text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--color-text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#34D399"
              strokeWidth={2}
              fill="url(#incomeAreaFill)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: '#34D399' }}
            />
            <Area
              type="monotone"
              dataKey="cumulativeBalance"
              name="Balance"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              fill="url(#balanceAreaFill)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: '#8B5CF6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
