export type Cuisine = 
  | "italian" 
  | "mexican" 
  | "indian" 
  | "chinese" 
  | "japanese" 
  | "thai" 
  | "mediterranean" 
  | "american" 
  | "french" 
  | "korean";

export interface MealTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Preferences {
  days: number;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
  dietaryRestrictions?: string;
  cuisinePreferences: Cuisine[];
  mealTargets?: MealTargets;
}
