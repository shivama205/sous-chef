import { AnalyticsEvent, EventName, EventCategory, Feature } from '@/constants/eventTaxonomy';

export const trackEvent = (eventData: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    const eventPayload: Record<string, any> = {
      event_category: eventData.category,
      event_label: eventData.label,
      value: eventData.value,
    };
    
    // Include feature information if present
    if (eventData.feature) {
      eventPayload.feature = eventData.feature;
    }

    // Include additional metadata if present
    if (eventData.metadata) {
      Object.entries(eventData.metadata).forEach(([key, value]) => {
        eventPayload[`metadata_${key}`] = value;
      });
    }
    
    window.gtag('event', eventData.action, eventPayload);
  } else {
    console.warn('Google Analytics is not initialized.');
  }
};

// Example usage with feature and metadata:
/*
trackEvent({
  action: EventName.RecipeView,
  category: EventCategory.Content,
  feature: Feature.RecipeFinder,
  label: 'vegetarian_pasta',
  value: 1,
  metadata: {
    recipeId: '123',
    cuisine: 'italian',
    difficulty: 'easy'
  }
});

// Track a meal plan creation
trackEvent({
  action: EventName.MealPlanCreate,
  category: EventCategory.Engagement,
  feature: Feature.MealPlanner,
  label: 'weekly_plan',
  metadata: {
    planDuration: '7_days',
    dietaryPreferences: ['vegetarian', 'gluten_free']
  }
});

// Track an error
trackEvent({
  action: EventName.ApiError,
  category: EventCategory.Error,
  feature: Feature.RecipeFinder,
  label: 'recipe_fetch_failed',
  metadata: {
    errorCode: 404,
    errorMessage: 'Recipe not found'
  }
});
*/ 