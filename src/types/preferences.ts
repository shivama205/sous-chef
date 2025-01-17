export type Cuisine = 
  | "italian"
  | "mexican"
  | "chinese"
  | "japanese"
  | "indian"
  | "mediterranean"
  | "american"
  | "thai"
  | "korean"
  | "vietnamese"
  | "indonesian"
  | "greek";

export interface MealTargets {
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  proteinPerMeal?: number;
  caloriesPerMeal?: number;
}

export interface Preferences {
  days: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs?: number;
  targetFat?: number;
  dietaryRestrictions: string;
  cuisinePreferences: Cuisine[];
  mealTargets?: MealTargets;
  proteinGoal?: number;
  calorieIntakeGoal?: number;
}