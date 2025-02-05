// DataLayer Types
export interface DataLayerEvent {
  event: string;
  [key: string]: any;
}

export interface PageViewEvent extends DataLayerEvent {
  event: 'page_view';
  page_path: string;
  page_title: string;
  user_id?: string;
}

export interface UserEvent extends DataLayerEvent {
  event: 'user_login' | 'user_signup' | 'user_logout';
  method?: string;
  user_id?: string;
}

export interface RecipeEvent extends DataLayerEvent {
  event: 'recipe_view' | 'recipe_save' | 'recipe_share';
  recipe_id?: string;
  recipe_name: string;
  recipe_category?: string;
  cooking_time?: number;
  user_id?: string;
}

export interface MealPlanEvent extends DataLayerEvent {
  event: 'meal_plan_create' | 'meal_plan_view' | 'meal_plan_share';
  plan_id?: string;
  plan_duration: string;
  recipe_count: number;
  user_id?: string;
}

export interface SearchEvent extends DataLayerEvent {
  event: 'recipe_search';
  search_term: string;
  search_type: 'ingredients' | 'recipe_name' | 'category' | 'meal_suggestions';
  results_count: number;
  user_id?: string;
}

export interface ConsentEvent extends DataLayerEvent {
  event: 'update_consent';
  analytics_storage: 'granted' | 'denied';
}

export interface FormEvent extends DataLayerEvent {
  event: 'form_field_change';
  field_name: string;
  field_value: any;
  user_id?: string;
}

// DataLayer Service
class DataLayerService {
  private push(event: DataLayerEvent) {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(event);
    }
  }

  // Page Views
  trackPageView(data: Omit<PageViewEvent, 'event'>) {
    this.push({
      event: 'page_view',
      ...data
    });
  }

  // User Events
  trackUserLogin(method: string, userId?: string) {
    this.push({
      event: 'user_login',
      method,
      user_id: userId
    });
  }

  trackUserSignup(method: string, userId?: string) {
    this.push({
      event: 'user_signup',
      method,
      user_id: userId
    });
  }

  trackUserLogout(userId?: string) {
    this.push({
      event: 'user_logout',
      user_id: userId
    });
  }

  // Recipe Events
  trackRecipeView(data: Omit<RecipeEvent, 'event'>) {
    this.push({
      event: 'recipe_view',
      ...data
    });
  }

  trackRecipeSave(data: Omit<RecipeEvent, 'event'>) {
    this.push({
      event: 'recipe_save',
      ...data
    });
  }

  trackRecipeShare(data: Omit<RecipeEvent, 'event'>) {
    this.push({
      event: 'recipe_share',
      ...data
    });
  }

  // Meal Plan Events
  trackMealPlanCreate(data: Omit<MealPlanEvent, 'event'>) {
    this.push({
      event: 'meal_plan_create',
      ...data
    });
  }

  trackMealPlanView(data: Omit<MealPlanEvent, 'event'>) {
    this.push({
      event: 'meal_plan_view',
      ...data
    });
  }

  trackMealPlanShare(data: Omit<MealPlanEvent, 'event'>) {
    this.push({
      event: 'meal_plan_share',
      ...data
    });
  }

  // Search Events
  trackRecipeSearch(data: Omit<SearchEvent, 'event'>) {
    this.push({
      event: 'recipe_search',
      ...data
    });
  }

  // Form Events
  trackFormField(data: Omit<FormEvent, 'event'>) {
    this.push({
      event: 'form_field_change',
      ...data
    });
  }

  // Consent Events
  trackConsentUpdate(consent: 'granted' | 'denied') {
    this.push({
      event: 'update_consent',
      analytics_storage: consent
    });
  }
}

export const dataLayer = new DataLayerService(); 