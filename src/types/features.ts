import { HealthyAlternative, HealthyAlternativeRequest, NutritionalValue } from "./healthyAlternative";
import { MealPlanGenerationRequest } from "./mealPlan";
import { MealPlan } from "./mealPlan";
import { Recipe, RecipeFinderRequest } from "./recipeFinder";

// Feature Names
export enum FeatureName {
  MEAL_PLAN_GENERATION = 'meal_plan_generation',
  HEALTHY_ALTERNATIVE = 'healthy_alternative',
  MACRO_CALCULATOR = 'macro_calculator',
  RECIPE_FINDER = 'recipe_finder'
}

// MealPlanGenerationMetadata is the metadata object for the MealPlanGeneration service
export interface MealPlanGenerationMetadata {
  input: MealPlanGenerationRequest;
  output: MealPlan;
}

// RecipeFinderMetadata is the metadata object for the RecipeFinder service
export interface RecipeFinderMetadata {
  input: RecipeFinderRequest;
  output: Recipe[];
}

// HealthyAlternativeMetadata is the metadata object for the HealthyAlternative service
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
  meal_plan_generation: MealPlanGenerationMetadata;
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