import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value by a specified delay.
 * Useful for search inputs, filter changes, and API calls
 * where you want to wait for the user to stop typing.
 *
 * @param {*} value - The value to debounce
 * @param {number} delay - Debounce delay in milliseconds (default 300)
 * @returns {*} The debounced value
 *
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 300);
 * 
 * useEffect(() => {
 *   dispatch(setFilter({ key: 'search', value: debouncedSearch }));
 * }, [debouncedSearch]);
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set debouncedValue to value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the timeout if value or delay changes
    // before the delay has elapsed
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
