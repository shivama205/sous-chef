import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '@/services/analyticsTracker';
import { EventName, EventCategory, Feature } from '@/constants/eventTaxonomy';

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

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
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
  }, [location]);
}; 