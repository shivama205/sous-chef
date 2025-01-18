// Feature Names
export type FeatureName = 
  | 'meal_plan_generation'
  | 'healthy_alternative'
  | 'macro_calculator'
  | 'recipe_finder';

// Metadata Interfaces
export interface MealPlanMetadata {
  days: number;
  cuisinePreferences?: string[];
  dietaryRestrictions?: string[];
  targetCalories?: number;
}

export interface HealthyAlternativeMetadata {
  mealName: string;
  success: boolean;
  alternativesFound: number;
  alternatives?: Array<{
    original: string;
    substitute: string;
  }>;
  error?: string;
}

export interface MacroCalculatorMetadata {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
  goal: 'lose' | 'maintain' | 'gain';
}

export interface RecipeFinderMetadata {
  ingredients?: string[];
  cuisineType?: string;
  dietaryRestrictions?: string[];
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

// Combined Metadata Type
export type FeatureMetadata = {
  meal_plan_generation: MealPlanMetadata;
  healthy_alternative: HealthyAlternativeMetadata;
  macro_calculator: MacroCalculatorMetadata;
  recipe_finder: RecipeFinderMetadata;
}

// Feature Descriptions
export const featureDescriptions: Record<FeatureName, string> = {
  meal_plan_generation: 'Generated a meal plan',
  healthy_alternative: 'Found healthy alternatives',
  macro_calculator: 'Calculated macro targets',
  recipe_finder: 'Found recipe suggestions'
};