export interface Meal {
  id: string;
  name: string;
  description: string;
  ingredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
  instructions: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  metadata?: {
    prepTime?: string;
    cookTime?: string;
    servings?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  };
}

export interface MealPlan {
  id: string;
  title: string;
  description: string;
  meals: Meal[];
  created_at: string;
  user_id: string;
  metadata: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    preferences?: string[];
    restrictions?: string[];
    goals?: string[];
  };
}

export interface MealPlanShare {
  id: string;
  meal_plan_id: string;
  created_at: string;
  expires_at?: string;
  views: number;
  is_public: boolean;
} 