// ─── localStorage-backed Mock API Service ───
const STORAGE_KEY = 'proton_transactions_v3';

const SEED_TRANSACTIONS = [
  // ─── April 2026 (Current Month) — 30 transactions ───
  { _id: 's01', merchant: 'Acme Corp', description: 'Monthly Salary', category: 'Salary', date: '2026-04-01T10:00:00Z', amount: 85000, type: 'income', status: 'CLEARED' },
  { _id: 's02', merchant: 'Rent Transfer', description: 'Monthly house rent', category: 'Housing', date: '2026-04-01T08:00:00Z', amount: 18000, type: 'expense', status: 'CLEARED' },
  { _id: 's03', merchant: 'Netflix', description: 'Monthly subscription', category: 'Entertainment', date: '2026-04-01T00:00:00Z', amount: 649, type: 'expense', status: 'CLEARED' },
  { _id: 's04', merchant: 'Spotify', description: 'Premium subscription', category: 'Entertainment', date: '2026-04-01T00:00:00Z', amount: 119, type: 'expense', status: 'CLEARED' },
  { _id: 's05', merchant: 'Interest Credit', description: 'Savings account interest', category: 'Investment', date: '2026-04-01T00:00:00Z', amount: 1850, type: 'income', status: 'CLEARED' },
  { _id: 's06', merchant: 'Freelance Project', description: 'Website redesign', category: 'Freelance', date: '2026-04-02T14:00:00Z', amount: 25000, type: 'income', status: 'CLEARED' },
  { _id: 's07', merchant: 'Gym Membership', description: 'Quarterly gym fee', category: 'Healthcare', date: '2026-04-02T07:00:00Z', amount: 3000, type: 'expense', status: 'CLEARED' },
  { _id: 's08', merchant: 'Electricity Board', description: 'Electricity bill', category: 'Utilities', date: '2026-04-03T08:00:00Z', amount: 2500, type: 'expense', status: 'CLEARED' },
  { _id: 's09', merchant: 'Amazon', description: 'Wireless headphones', category: 'Shopping', date: '2026-04-04T16:30:00Z', amount: 3499, type: 'expense', status: 'CLEARED' },
  { _id: 's10', merchant: 'Zerodha', description: 'Stock dividend — INFY', category: 'Investment', date: '2026-04-05T10:00:00Z', amount: 4200, type: 'income', status: 'CLEARED' },
  { _id: 's11', merchant: 'Jio', description: 'Mobile recharge', category: 'Utilities', date: '2026-04-05T12:00:00Z', amount: 299, type: 'expense', status: 'CLEARED' },
  { _id: 's12', merchant: 'Uber', description: 'Weekly commute rides', category: 'Transport', date: '2026-04-06T09:00:00Z', amount: 850, type: 'expense', status: 'CLEARED' },
  { _id: 's13', merchant: 'Apollo Pharmacy', description: 'Monthly medicines', category: 'Healthcare', date: '2026-04-07T11:00:00Z', amount: 1780, type: 'expense', status: 'PENDING' },
  { _id: 's14', merchant: 'Myntra', description: 'Office wear shirts', category: 'Shopping', date: '2026-04-07T14:00:00Z', amount: 1999, type: 'expense', status: 'CLEARED' },
  { _id: 's15', merchant: 'Airtel', description: 'Internet bill', category: 'Utilities', date: '2026-04-08T09:30:00Z', amount: 999, type: 'expense', status: 'CLEARED' },
  { _id: 's16', merchant: 'Upwork', description: 'Freelance UI/UX project', category: 'Freelance', date: '2026-04-08T16:00:00Z', amount: 18000, type: 'income', status: 'CLEARED' },
  { _id: 's17', merchant: 'Flipkart', description: 'Running shoes', category: 'Shopping', date: '2026-04-09T15:00:00Z', amount: 2799, type: 'expense', status: 'CLEARED' },
  { _id: 's18', merchant: 'Zomato', description: 'Lunch delivery', category: 'Food & Dining', date: '2026-04-10T13:00:00Z', amount: 420, type: 'expense', status: 'CLEARED' },
  { _id: 's19', merchant: 'Ola', description: 'Airport transfer', category: 'Transport', date: '2026-04-11T06:00:00Z', amount: 1200, type: 'expense', status: 'CLEARED' },
  { _id: 's20', merchant: 'DMart', description: 'Monthly groceries', category: 'Groceries', date: '2026-04-12T11:00:00Z', amount: 4500, type: 'expense', status: 'CLEARED' },
  { _id: 's21', merchant: 'BookMyShow', description: 'Movie tickets', category: 'Entertainment', date: '2026-04-12T18:00:00Z', amount: 550, type: 'expense', status: 'CLEARED' },
  { _id: 's22', merchant: 'Cafe Coffee Day', description: 'Client meeting coffee', category: 'Food & Dining', date: '2026-04-13T10:30:00Z', amount: 340, type: 'expense', status: 'CLEARED' },
  { _id: 's23', merchant: 'BigBasket', description: 'Weekly fruits & veggies', category: 'Groceries', date: '2026-04-14T10:00:00Z', amount: 1200, type: 'expense', status: 'CLEARED' },
  { _id: 's24', merchant: 'Swiggy', description: 'Weekend dinner order', category: 'Food & Dining', date: '2026-04-14T19:30:00Z', amount: 890, type: 'expense', status: 'CLEARED' },
  { _id: 's25', merchant: 'Petrol Pump', description: 'Bike fuel', category: 'Transport', date: '2026-04-15T08:30:00Z', amount: 600, type: 'expense', status: 'PENDING' },
  { _id: 's26', merchant: 'Decathlon', description: 'Sports gear', category: 'Shopping', date: '2026-04-15T14:00:00Z', amount: 2350, type: 'expense', status: 'CLEARED' },
  { _id: 's27', merchant: 'Starbucks', description: 'Coffee catch-up', category: 'Food & Dining', date: '2026-04-16T09:00:00Z', amount: 480, type: 'expense', status: 'CLEARED' },
  { _id: 's28', merchant: 'Rapido', description: 'Bike taxi rides', category: 'Transport', date: '2026-04-16T11:00:00Z', amount: 320, type: 'expense', status: 'CLEARED' },
  { _id: 's29', merchant: 'Croma', description: 'USB-C charger', category: 'Shopping', date: '2026-04-16T13:00:00Z', amount: 899, type: 'expense', status: 'PENDING' },
  { _id: 's30', merchant: 'Hotstar', description: 'Annual subscription', category: 'Entertainment', date: '2026-04-02T00:00:00Z', amount: 1499, type: 'expense', status: 'CLEARED' },
  { _id: 's46', merchant: 'TCS Consulting', description: 'Consulting fee', category: 'Freelance', date: '2026-04-10T10:00:00Z', amount: 32000, type: 'income', status: 'CLEARED' },
  { _id: 's47', merchant: 'Google AdSense', description: 'YouTube ad revenue', category: 'Freelance', date: '2026-04-12T14:00:00Z', amount: 8500, type: 'income', status: 'CLEARED' },
  { _id: 's48', merchant: 'CRED', description: 'Cashback reward', category: 'Investment', date: '2026-04-09T12:00:00Z', amount: 750, type: 'income', status: 'CLEARED' },
  { _id: 's49', merchant: 'Rental Income', description: 'Property rental — April', category: 'Investment', date: '2026-04-05T09:00:00Z', amount: 12000, type: 'income', status: 'CLEARED' },
  { _id: 's50', merchant: 'Referral Bonus', description: 'Groww app referral', category: 'Investment', date: '2026-04-14T16:00:00Z', amount: 500, type: 'income', status: 'CLEARED' },
  // ─── March 2026 ───
  { _id: 's31', merchant: 'Acme Corp', description: 'March Salary', category: 'Salary', date: '2026-03-01T10:00:00Z', amount: 85000, type: 'income', status: 'CLEARED' },
  { _id: 's32', merchant: 'Rent Transfer', description: 'March rent', category: 'Housing', date: '2026-03-01T08:00:00Z', amount: 18000, type: 'expense', status: 'CLEARED' },
  { _id: 's33', merchant: 'DMart', description: 'March groceries', category: 'Groceries', date: '2026-03-10T11:00:00Z', amount: 5200, type: 'expense', status: 'CLEARED' },
  { _id: 's34', merchant: 'Swiggy', description: 'March food orders', category: 'Food & Dining', date: '2026-03-15T19:00:00Z', amount: 2100, type: 'expense', status: 'CLEARED' },
  { _id: 's35', merchant: 'Electricity Board', description: 'March electricity', category: 'Utilities', date: '2026-03-05T08:00:00Z', amount: 2200, type: 'expense', status: 'CLEARED' },
  { _id: 's36', merchant: 'Uber', description: 'March rides', category: 'Transport', date: '2026-03-20T09:00:00Z', amount: 1400, type: 'expense', status: 'CLEARED' },
  { _id: 's37', merchant: 'Amazon', description: 'March shopping', category: 'Shopping', date: '2026-03-12T14:00:00Z', amount: 4500, type: 'expense', status: 'CLEARED' },
  { _id: 's38', merchant: 'Freelance', description: 'March freelance', category: 'Freelance', date: '2026-03-08T16:00:00Z', amount: 15000, type: 'income', status: 'CLEARED' },
  { _id: 's51', merchant: 'Rental Income', description: 'Property rental — March', category: 'Investment', date: '2026-03-05T09:00:00Z', amount: 12000, type: 'income', status: 'CLEARED' },
  { _id: 's52', merchant: 'Google AdSense', description: 'March ad revenue', category: 'Freelance', date: '2026-03-18T14:00:00Z', amount: 6200, type: 'income', status: 'CLEARED' },
  { _id: 's53', merchant: 'Consulting Gig', description: 'March consulting', category: 'Freelance', date: '2026-03-22T10:00:00Z', amount: 20000, type: 'income', status: 'CLEARED' },
  // ─── February 2026 ───
  { _id: 's39', merchant: 'Acme Corp', description: 'February Salary', category: 'Salary', date: '2026-02-01T10:00:00Z', amount: 85000, type: 'income', status: 'CLEARED' },
  { _id: 's40', merchant: 'Rent Transfer', description: 'February rent', category: 'Housing', date: '2026-02-01T08:00:00Z', amount: 18000, type: 'expense', status: 'CLEARED' },
  { _id: 's41', merchant: 'DMart', description: 'February groceries', category: 'Groceries', date: '2026-02-08T11:00:00Z', amount: 4800, type: 'expense', status: 'CLEARED' },
  { _id: 's42', merchant: 'Freelance', description: 'Feb freelance', category: 'Freelance', date: '2026-02-15T14:00:00Z', amount: 12000, type: 'income', status: 'CLEARED' },
  { _id: 's43', merchant: 'Swiggy', description: 'Feb food orders', category: 'Food & Dining', date: '2026-02-18T19:00:00Z', amount: 1800, type: 'expense', status: 'CLEARED' },
  { _id: 's44', merchant: 'Amazon', description: 'Feb electronics', category: 'Shopping', date: '2026-02-12T14:00:00Z', amount: 3200, type: 'expense', status: 'CLEARED' },
  { _id: 's45', merchant: 'Electricity Board', description: 'Feb electricity', category: 'Utilities', date: '2026-02-05T08:00:00Z', amount: 1900, type: 'expense', status: 'CLEARED' },
  { _id: 's54', merchant: 'Rental Income', description: 'Property rental — Feb', category: 'Investment', date: '2026-02-05T09:00:00Z', amount: 12000, type: 'income', status: 'CLEARED' },
  { _id: 's55', merchant: 'Income Tax Dept', description: 'Tax refund FY25', category: 'Salary', date: '2026-02-10T10:00:00Z', amount: 15400, type: 'income', status: 'CLEARED' },
  { _id: 's56', merchant: 'Private Tutoring', description: 'Feb tutoring sessions', category: 'Freelance', date: '2026-02-20T17:00:00Z', amount: 8000, type: 'income', status: 'CLEARED' },
];

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TRANSACTIONS));
  return [...SEED_TRANSACTIONS];
};

const saveToStorage = (transactions) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

const delay = (ms = 150) => new Promise(r => setTimeout(r, ms));

export const api = {
  // Transactions
  getTransactions: async () => {
    await delay();
    return loadFromStorage();
  },

  createTransaction: async (txData) => {
    await delay();
    const transactions = loadFromStorage();
    const newTx = {
      ...txData,
      _id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
      status: 'CLEARED',
    };
    transactions.unshift(newTx);
    saveToStorage(transactions);
    return newTx;
  },

  updateTransaction: async (id, txData) => {
    await delay();
    const transactions = loadFromStorage();
    const index = transactions.findIndex(t => t._id === id);
    if (index === -1) throw new Error('Transaction not found');
    transactions[index] = { ...transactions[index], ...txData };
    saveToStorage(transactions);
    return transactions[index];
  },

  deleteTransaction: async (id) => {
    await delay();
    let transactions = loadFromStorage();
    transactions = transactions.filter(t => t._id !== id);
    saveToStorage(transactions);
    return id;
  },

  // Dashboard / Budget / etc.
  getDashboardData: async () => {
    await delay(300);
    return {
      // Add other dashboard-specific mock data if needed
    };
  }
};
