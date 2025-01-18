export type ActivityType = 
  | "meal_plan_generated"
  | "recipe_finder_used"
  | "healthy_alternative_used"
  | "grocery_list_generated"
  | "meal_plan_saved"
  | "grocery_list_saved";

export interface HealthyAlternativeMetadata {
  mealName: string;
  dietaryRestrictions?: string[];
  healthGoals?: string[];
  additionalInstructions?: string;
  success: boolean;
  alternatives?: string[];
  suggestions?: string[];
  error?: string;
}

export interface ActivityMetadata {
  input?: {
    preferences?: {
      days?: number;
      targetCalories?: number;
      dietaryRestrictions?: string;
      cuisinePreferences?: string[];
    };
    ingredients?: string[];
    originalDish?: string;
    [key: string]: unknown;
  };
  output?: {
    success: boolean;
    generatedContent?: unknown;
    error?: string;
  };
  healthyAlternative?: HealthyAlternativeMetadata;
  [key: string]: unknown;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  metadata: ActivityMetadata;
  created_at: string;
}