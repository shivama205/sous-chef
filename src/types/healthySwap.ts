export interface HealthySwapRequest {
  mealName?: string;
  description?: string;
}

export interface Recipe {
  name: string;
  cookingTime: string;
  ingredients: string[];
  instructions: string[];
  nutritionalValue: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface HealthySwapResponse {
  alternatives: Recipe[];
}