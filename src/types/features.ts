import { HealthyAlternative, HealthyAlternativeRequest, NutritionalValue } from "./healthyAlternative";
import { RecipeFinderMetadata } from "./recipeFinder";

// Feature Names
export enum FeatureName {
  MEAL_PLAN_GENERATION = 'meal_plan_generation',
  HEALTHY_ALTERNATIVE = 'healthy_alternative',
  MACRO_CALCULATOR = 'macro_calculator',
  RECIPE_FINDER = 'recipe_finder'
}

// Metadata Interfaces
export interface MealPlanMetadata {
  days: number;
  cuisinePreferences?: string[];
  dietaryRestrictions?: string[];
  targetCalories?: number;
}


// Healthy Alternative Metadata to be stored in the user activity log
export interface HealthyAlternativeMetadata {
  input: HealthyAlternativeRequest;
  output: HealthyAlternative[];
}

export interface MacroCalculatorMetadata {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
  goal: 'lose' | 'maintain' | 'gain';
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