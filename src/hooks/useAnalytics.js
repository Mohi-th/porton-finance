import { useEffect, useCallback } from 'react';

/**
 * Google Analytics 4 integration hook.
 * Tracks page views on mount and provides a `trackEvent` function
 * for custom event tracking (search usage, filter clicks, CTA clicks).
 * 
 * Falls back to console logging when GA4 is not loaded (development).
 * 
 * @returns {{ trackEvent: (eventName: string, eventParams?: object) => void }}
 * 
 * @example
 * const { trackEvent } = useAnalytics();
 * trackEvent('search', { term: 'groceries' });
 * trackEvent('filter_click', { filter: 'expense', value: 'food' });
 * trackEvent('cta_click', { action: 'Execute Strategy' });
 */

// GA4 Measurement ID — replace with real ID in production
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

export const useAnalytics = () => {
  // Track page view on mount
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  /**
   * Track a page view.
   * @param {string} path - The URL path (e.g., '/dashboard')
   */
  const trackPageView = useCallback((path) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, { page_path: path });
    } else {
      console.log(`[GA4] page_view: ${path}`);
    }
  }, []);

  /**
   * Track a custom event.
   * Supported events: 'search', 'filter_click', 'cta_click', 
   * 'execute_strategy', 'page_view', 'transaction_add', 'transaction_delete'
   * 
   * @param {string} eventName - The name of the event
   * @param {object} [eventParams={}] - Additional parameters
   */
  const trackEvent = useCallback((eventName, eventParams = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ...eventParams,
        send_to: GA_MEASUREMENT_ID,
      });
    } else {
      console.log(`[GA4] ${eventName}`, eventParams);
    }
  }, []);

  return { trackEvent, trackPageView };
};
