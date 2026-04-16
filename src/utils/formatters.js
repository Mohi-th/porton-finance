/**
 * Format a number as currency (INR)
 */
export const formatCurrency = (amount, compact = false) => {
  if (amount === null || amount === undefined) return '₹0.00';
  
  if (compact && Math.abs(amount) >= 1000) {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 1,
    });
    return formatter.format(amount);
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date string/object
 */
export const formatDate = (date, format = 'short') => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    monthYear: { month: 'long', year: 'numeric' },
    monthShort: { month: 'short', year: 'numeric' },
    dayMonth: { month: 'short', day: 'numeric' },
    iso: null,
  };

  if (format === 'iso') {
    return d.toISOString().split('T')[0];
  }

  return d.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Format a percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

/**
 * Get relative time string (e.g., "2 days ago")
 */
export const getRelativeTime = (date) => {
  const now = new Date();
  const d = new Date(date);
  const diff = now - d;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) return formatDate(date);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

/**
 * Generate a unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

/**
 * Clamp a number between min and max
 */
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
