import { NutritionalValue } from "./healthyAlternative";
import { UserMacros } from "./macros";

// RecipeFinderRequest is the request object for the RecipeFinder service
export interface RecipeFinderRequest {
  ingredients: string[];
  dietaryRestrictions?: string[];
  additionalInstructions?: string;
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
  } | null;
}

// Recipe is the response object for the RecipeFinder service
export interface Recipe {
  id?: string;
  name: string;
  description?: string;
  cookingTime: number;
  ingredients: string[];
  instructions: string[];
  nutritionalValue: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  difficulty?: 'easy' | 'medium' | 'hard';
  cuisineType?: string;
  imageUrl?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SharedRecipe {
  id: string;
  user_id: string;
  recipe_id: string;
  is_public: boolean;
  expires_at: string;
  views: number;
  created_at: string;
  updated_at: string;
}
