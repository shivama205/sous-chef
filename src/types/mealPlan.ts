export enum MealTime {
  Breakfast = "breakfast",
  MorningSnack = "morning snack",
  Lunch = "lunch",
  AfternoonSnack = "afternoon snack",
  Dinner = "dinner"
}

export enum DayOfWeek {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday"
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface Meal {
  name: string;
  time: MealTime;
  recipeLink?: string;
  nutritionInfo: NutritionInfo;
}

export interface MealPlanDay {
  day: DayOfWeek;
  meals: Meal[];
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  days: MealPlanDay[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}