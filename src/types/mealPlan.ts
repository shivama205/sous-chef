import { NutritionalValue } from "./healthyAlternative";
import { UserMacros } from "./macros";
import { Preferences } from "./preferences";

export enum MealTime {
  Breakfast = "Breakfast",
  MorningSnack = "Morning Snack",
  Lunch = "Lunch",
  AfternoonSnack = "Afternoon Snack",
  Dinner = "Dinner"
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

export interface Meal {
  name: string;
  time: MealTime;
  recipeLink?: string;
  nutritionalValue: NutritionalValue;
}

export interface MealPlanDay {
  day: DayOfWeek;
  meals: Meal[];
}

export interface MealPlan {
  id: string;
  userId: string;
  name: string;
  days: MealPlanDay[];
}

export interface MealPlanGenerationRequest {
  days: number;
  dietaryRestrictions?: string;
  cuisinePreferences?: string[];
  preferences: Preferences;
}

export interface MealPlanShareProps {
  mealPlanId: string;
  mealPlanData: MealPlan;
  planName: string;
}