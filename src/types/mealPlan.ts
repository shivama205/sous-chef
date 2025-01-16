export interface MealPlan {
  id: string;
  name: string;
  description: string;
  meals: Meal[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Meal {
  id: string;
  name: string;
  ingredients: Ingredient[];
  instructions: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}
