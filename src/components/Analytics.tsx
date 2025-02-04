import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Declare gtag as a global function
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params?: any
    ) => void;
  }
}

export const GA_TRACKING_ID = 'MEASUREMENT_ID'; // Replace with your actual tracking ID

// Log page views
export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// Log specific events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views on route change
    pageview(location.pathname + location.search);
  }, [location]);

  return null;
};

export default Analytics; 