// ============================================================
// Proton Finance — Centralized Constants
// All hardcoded data lives here. Import from this file.
// ============================================================

// ─── Color Palettes ───
export const CHART_COLORS = [
  '#3B82F6', '#F59E0B', '#10B981', '#EF4444',
  '#8B5CF6', '#EC4899', '#22D3EE', '#6B7280',
  '#F97316', '#14B8A6',
];

// ─── Transaction Categories ───
export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Shopping',
  'Transport',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Housing',
  'Education',
  'Travel',
  'Investment',
  'Other',
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Rental Income',
  'Other',
];

export const ALL_CATEGORIES = [
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES.filter(c => !INCOME_CATEGORIES.includes(c)),
];

// ─── Default Monthly Budget Limits (₹) ───
export const DEFAULT_BUDGET_LIMITS = {
  Housing:        20000,
  'Food & Dining': 5000,
  Groceries:       6000,
  Shopping:        5000,
  Transport:       3000,
  Entertainment:   2500,
  Utilities:       4000,
  Healthcare:      3000,
  Investment:     10000,
};

// ─── Dashboard: AI Insight Card ───
export const AI_INSIGHT_DATA = {
  title: 'Optimizing your portfolio for the upcoming Q3 market shift.',
  description:
    'Our AI analyzed your current allocation and identified 3 key rebalancing opportunities to increase yield by 2.4%.',
  actions: ['Execute Strategy', 'Review Audit'],
};

// ─── Dashboard: Active Alerts ───
export const DASHBOARD_ALERTS = [
  {
    id: 1,
    type: 'danger',
    title: 'Subscription Spike',
    message: '3 new recurring charges detected from "Cloud SaaS" in the last 48h.',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Emergency Fund Cap',
    message: 'Your "Rainy Day" fund has reached its target of ₹20k. Redirecting flows?',
  },
  {
    id: 3,
    type: 'info',
    title: 'Dividend Reinvestment',
    message: 'AAPL and MSFT paid dividends today. Automatic reinvestment pending.',
  },
];

// ─── Market / Stock Mock Data (used in Header search) ───
export const MARKET_DATA = [
  { id: 'mk1',  symbol: 'NIFTY 50',    name: 'Nifty 50 Index',             price: 24850.30, change: +1.24, sector: 'Index',       description: 'The benchmark index of the NSE, representing the top 50 companies.',                              marketCap: '₹198.5L Cr', pe: 22.4,  high52w: '₹25,200', low52w: '₹19,600' },
  { id: 'mk2',  symbol: 'SENSEX',      name: 'BSE Sensex',                  price: 81420.50, change: +0.89, sector: 'Index',       description: 'The S&P BSE Sensex tracks 30 financially sound companies listed on the BSE.',                    marketCap: '₹312.8L Cr', pe: 23.1,  high52w: '₹82,500', low52w: '₹65,000' },
  { id: 'mk3',  symbol: 'RELIANCE',    name: 'Reliance Industries',         price: 2945.60,  change: +2.15, sector: 'Energy',      description: "India's largest private sector company with interests in petrochemicals, retail and telecom.",    marketCap: '₹19.9L Cr',  pe: 28.3,  high52w: '₹3,024',  low52w: '₹2,220' },
  { id: 'mk4',  symbol: 'TCS',         name: 'Tata Consultancy Services',   price: 3842.10,  change: -0.45, sector: 'IT',          description: 'A global leader in IT services and consulting with operations in 150+ locations.',                marketCap: '₹14.0L Cr',  pe: 30.2,  high52w: '₹4,045',  low52w: '₹3,056' },
  { id: 'mk5',  symbol: 'INFY',        name: 'Infosys Limited',             price: 1567.80,  change: +1.78, sector: 'IT',          description: 'A leading digital services and consulting company with global operations.',                        marketCap: '₹6.5L Cr',   pe: 26.8,  high52w: '₹1,740',  low52w: '₹1,280' },
  { id: 'mk6',  symbol: 'HDFCBANK',    name: 'HDFC Bank',                   price: 1685.25,  change: -0.32, sector: 'Banking',     description: "India's largest private sector bank by market cap, offering full banking services.",              marketCap: '₹12.8L Cr',  pe: 19.5,  high52w: '₹1,794',  low52w: '₹1,363' },
  { id: 'mk7',  symbol: 'ICICIBANK',   name: 'ICICI Bank',                  price: 1248.90,  change: +0.92, sector: 'Banking',     description: "One of India's leading private sector banks with extensive global network.",                      marketCap: '₹8.8L Cr',   pe: 18.2,  high52w: '₹1,310',  low52w: '₹950'  },
  { id: 'mk8',  symbol: 'WIPRO',       name: 'Wipro Limited',               price: 485.30,   change: -1.23, sector: 'IT',          description: 'A leading IT services company providing consulting and business process services globally.',       marketCap: '₹2.5L Cr',   pe: 22.1,  high52w: '₹510',    low52w: '₹368'  },
  { id: 'mk9',  symbol: 'TATAMOTORS',  name: 'Tata Motors',                 price: 745.40,   change: +3.42, sector: 'Auto',        description: 'A leading global automobile company with operations across UK, South Korea, and Thailand.',       marketCap: '₹2.7L Cr',   pe: 8.9,   high52w: '₹1,024',  low52w: '₹580'  },
  { id: 'mk10', symbol: 'ADANIENT',    name: 'Adani Enterprises',           price: 2310.80,  change: -2.10, sector: 'Conglomerate',description: 'The flagship company of the Adani Group, with business in mining and infrastructure.',            marketCap: '₹2.6L Cr',   pe: 65.3,  high52w: '₹3,490',  low52w: '₹2,050' },
  { id: 'mk11', symbol: 'SBIN',        name: 'State Bank of India',         price: 812.60,   change: +1.05, sector: 'Banking',     description: "India's largest public sector bank with over 22,000 branches.",                                  marketCap: '₹7.3L Cr',   pe: 11.4,  high52w: '₹912',    low52w: '₹600'  },
  { id: 'mk12', symbol: 'BHARTIARTL',  name: 'Bharti Airtel',               price: 1580.40,  change: +0.67, sector: 'Telecom',     description: "India's largest integrated telecom provider with operations in 17 countries.",                   marketCap: '₹9.4L Cr',   pe: 75.8,  high52w: '₹1,650',  low52w: '₹880'  },
];

// ─── Google Analytics ID ───
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

// ─── Pagination ───
export const DEFAULT_PAGE_SIZE = 10;

// ─── Sort Options ───
export const SORT_OPTIONS = [
  { value: 'date_desc',   label: 'Newest First' },
  { value: 'date_asc',    label: 'Oldest First' },
  { value: 'amount_desc', label: 'Highest Amount' },
  { value: 'amount_asc',  label: 'Lowest Amount' },
];

// ─── Sidebar Navigation ───
export const NAV_ITEMS = [
  { path: '/dashboard',    label: 'Dashboard' },
  { path: '/transactions', label: 'Transactions' },
  { path: '/budget',       label: 'Budget' },
  { path: '/insights',     label: 'Insights' },
];
