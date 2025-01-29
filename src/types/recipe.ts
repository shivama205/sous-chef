export interface Recipe {
  id: string;
  meal_name: string;
  cooking_time: number;
  ingredients: string[];
  instructions: string[];
  description?: string;
  nutritional_value?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  created_at?: string;
  user_id?: string;
  likes?: number;
  views?: number;
  is_public?: boolean;
  images?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  cuisine?: string;
  servings?: number;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
} 