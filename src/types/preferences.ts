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
  cuisinePreferences: string[];
  mealTargets?: MealTargets;
  proteinGoal?: number;
  calorieIntakeGoal?: number;
}