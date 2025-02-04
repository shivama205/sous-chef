import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '@/services/analyticsTracker';
import { EventName, EventCategory, Feature } from '@/constants/eventTaxonomy';

// Declare gtag as a global function
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'consent',
      targetId: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params?: any
    ) => void;
  }
}

export const GA_TRACKING_ID = 'G-ZDSB2CW3G5';

// Map routes to features for analytics
const routeToFeature: Record<string, Feature> = {
  '/': Feature.Authentication, // Home page
  '/meal-plan': Feature.MealPlanner,
  '/meal-suggestions': Feature.MealSuggestions,
  '/recipe-finder': Feature.RecipeFinder,
  '/healthy-alternative': Feature.HealthyAlternatives,
  '/blog': Feature.Blog,
  '/profile': Feature.Profile,
  '/billing': Feature.Billing,
};

export const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize GA
    if (typeof window.gtag === 'function') {
      window.gtag('config', GA_TRACKING_ID);
    }
  }, []);

  useEffect(() => {
    const consent = localStorage.getItem('analytics-consent');
    if (consent === 'accepted' && location) {
      // Get the base route (first segment of the path)
      const baseRoute = '/' + location.pathname.split('/')[1];
      const feature = routeToFeature[baseRoute] || routeToFeature[location.pathname];

      trackEvent({
        action: EventName.PageView,
        category: EventCategory.Navigation,
        feature,
        label: location.pathname,
        metadata: {
          path: location.pathname,
          search: location.search,
        },
      });
    }
  }, [location]);

  return null;
};

export default Analytics; 