import { Search, Calculator, ShoppingCart, Users, ChefHat } from "lucide-react";

export enum FeatureName {
  MEAL_PLAN_GENERATION = 'meal_plan_generation',
  HEALTHY_ALTERNATIVE = 'healthy_alternative',
  MACRO_CALCULATOR = 'macro_calculator',
  RECIPE_FINDER = 'recipe_finder',
  GROCERY_LIST_GENERATION = 'grocery_list_generation',
  RECIPE_SHARED = 'recipe_shared',
  GROCERY_LIST_SAVED = 'grocery_list_saved'
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

export interface GroceryListGenerationMetadata {
  mealPlanId: string;
}

// Combined Metadata Type
export type FeatureMetadata = {
  meal_plan_generation: MealPlanGenerationMetadata;
  healthy_alternative: HealthyAlternativeMetadata;
  macro_calculator: MacroCalculatorMetadata;
  recipe_finder: RecipeFinderMetadata;
  grocery_list_generation: GroceryListGenerationMetadata;
};

// Feature Descriptions
export const featureDescriptions: Record<FeatureName, string> = {
  [FeatureName.MEAL_PLAN_GENERATION]: 'Generated a meal plan',
  [FeatureName.HEALTHY_ALTERNATIVE]: 'Found healthy alternatives',
  [FeatureName.MACRO_CALCULATOR]: 'Calculated macro targets',
  [FeatureName.RECIPE_FINDER]: 'Found recipe suggestions',
  [FeatureName.GROCERY_LIST_GENERATION]: 'Generated a grocery list',
  [FeatureName.RECIPE_SHARED]: 'Shared a recipe',
  [FeatureName.GROCERY_LIST_SAVED]: 'Saved a grocery list'
};

export const featureIcons: Record<FeatureName, React.ElementType> = {
  [FeatureName.MEAL_PLAN_GENERATION]: ChefHat,
  [FeatureName.HEALTHY_ALTERNATIVE]: Users,
  [FeatureName.MACRO_CALCULATOR]: Calculator,
  [FeatureName.RECIPE_FINDER]: Search,
  [FeatureName.GROCERY_LIST_GENERATION]: ShoppingCart,
  [FeatureName.RECIPE_SHARED]: ChefHat,
  [FeatureName.GROCERY_LIST_SAVED]: ShoppingCart
};
