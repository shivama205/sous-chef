// Healthy Alternative Request
export interface HealthyAlternativeRequest {
  mealName: string;
  dietaryRestrictions?: string;
  additionalInstructions?: string;
}

// Healthy Alternative to the original meal
export interface HealthyAlternative {
  mealName: string ;
  cookingTime: number;
  ingredients: string[];
  instructions: string[];
  nutritionalValue: NutritionalValue;
  nutritionComparison: string[];
}

// Nutritional Value of the original meal
export interface NutritionalValue {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
