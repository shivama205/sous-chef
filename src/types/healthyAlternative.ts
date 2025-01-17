export interface HealthySwapRequest {
  mealName: string;
  description: string;
  dietaryRestrictions: string;
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

export interface HealthySwapResponse {
  alternatives: Recipe[];
}