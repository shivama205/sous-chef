// Define the Cuisine enum
export enum Cuisine {
  Italian = "Italian",
  Mexican = "Mexican",
  Chinese = "Chinese",
  Japanese = "Japanese",
  Indian = "Indian",
  Mediterranean = "Mediterranean",
  Thai = "Thai",
  Indonesian = "Indonesian",
  Greek = "Greek",
  Korean = "Korean",
  French = "French",
  Vietnamese = "Vietnamese"
}

export interface MealTargets {
  proteinPerMeal?: string;
  caloriesPerMeal?: string;
}

// Update the Preferences interface to use the Cuisine enum
export interface Preferences {
  days: number;
  proteinGoal?: string;
  calorieIntakeGoal?: string;
  dietaryRestrictions?: string;
  cuisinePreferences?: Cuisine[];
  mealTargets?: MealTargets;
}