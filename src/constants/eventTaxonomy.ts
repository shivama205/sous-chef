export enum EventCategory {
  Navigation = "navigation",
  Engagement = "engagement",
  Transaction = "transaction",
  Content = "content",
  Auth = "auth",
  Error = "error"
}

export enum Feature {
  // Core Features
  RecipeFinder = "recipe_finder",
  MealPlanner = "meal_planner",
  HealthyAlternatives = "healthy_alternatives",
  MealSuggestions = "meal_suggestions",
  
  // User Management
  Profile = "profile",
  Authentication = "authentication",
  Billing = "billing",
  
  // Content
  Blog = "blog",
  
  // Sharing
  Social = "social"
}

export enum EventName {
  // Navigation Events
  PageView = "page_view",
  ButtonClick = "button_click",
  
  // Authentication Events
  SignIn = "sign_in",
  SignUp = "sign_up",
  SignOut = "sign_out",
  
  // Recipe Events
  RecipeView = "recipe_view",
  RecipeSearch = "recipe_search",
  RecipeSave = "recipe_save",
  RecipeShare = "recipe_share",
  
  // Meal Plan Events
  MealPlanView = "meal_plan_view",
  MealPlanCreate = "meal_plan_create",
  MealPlanEdit = "meal_plan_edit",
  MealPlanShare = "meal_plan_share",
  MealPlanDownload = "meal_plan_download",
  
  // Healthy Alternative Events
  AlternativeSearch = "alternative_search",
  AlternativeSave = "alternative_save",
  
  // Form Events
  FormSubmit = "form_submit",
  FormError = "form_error",
  
  // Transaction Events
  CheckoutStart = "checkout_start",
  CheckoutComplete = "checkout_complete",
  SubscriptionChange = "subscription_change",
  
  // Content Events
  BlogView = "blog_view",
  BlogShare = "blog_share",
  
  // Error Events
  ApiError = "api_error",
  ValidationError = "validation_error"
}

export interface AnalyticsEvent {
  action: EventName;
  category: EventCategory;
  feature?: Feature;
  label?: string;
  value?: number;
  // Additional metadata for specific events
  metadata?: Record<string, unknown>;
} 