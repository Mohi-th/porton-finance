import { useState } from 'react';

/**
 * Custom hook for persisting state in localStorage.
 * Works like useState but automatically syncs with localStorage.
 * Safely handles SSR, JSON parsing errors, and quota limits.
 *
 * @param {string} key - localStorage key
 * @param {*} initialValue - Default value if key doesn't exist
 * @returns {[any, Function]} Tuple of [storedValue, setValue]
 *
 * @example
 * const [theme, setTheme] = useLocalStorage('proton-theme', 'dark');
 * setTheme('light'); // Persists to localStorage
 * 
 * const [prefs, setPrefs] = useLocalStorage('user-prefs', { currency: 'INR' });
 * setPrefs(prev => ({ ...prev, currency: 'USD' })); // Supports updater functions
 */
export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};
