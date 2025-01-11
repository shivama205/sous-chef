export interface Meal {
  name: string;
  time: string;
  recipeLink: string;
  nutritionInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
}

export interface DailyPlan {
  day: string;
  meals: Meal[];
}

export interface MealPlan {
  days: DailyPlan[];
}