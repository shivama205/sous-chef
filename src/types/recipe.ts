export type CuisineType = 
  | 'italian' | 'chinese' | 'japanese' | 'indian' | 'mexican' | 'thai' 
  | 'french' | 'mediterranean' | 'american' | 'korean' | 'vietnamese' 
  | 'spanish' | 'greek' | 'middle_eastern' | 'caribbean' | 'brazilian' | 'fusion';

export interface Recipe {
  id?: string;
  user_id?: string;
  meal_name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cooking_time: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine_type: CuisineType[];
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
  likes?: number;
  image_url?: string;
  user?: {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string;
  };
} 