export interface HealthyAlternativeRequest {
  mealName: string;
  dietaryRestrictions?: string[];
  healthGoals?: string[];
  additionalInstructions?: string;
}

export interface HealthyAlternativeResponse {
  alternatives: string[];
  success: boolean;
  error?: string;
}

export interface NutritionalValue {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Recipe {
  name: string;
  cookingTime: string;
  ingredients: string[];
  instructions: string[];
  nutritionalValue: NutritionalValue;
}