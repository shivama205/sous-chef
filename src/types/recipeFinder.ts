import { NutritionalValue } from "./healthyAlternative";
import { UserMacros } from "./macros";

// RecipeFinderRequest is the request object for the RecipeFinder service
export interface RecipeFinderRequest {
  ingredients: string[];
  dietaryRestrictions: string;
  additionalInstructions: string;
  macros?: UserMacros;
}

// Recipe is the response object for the RecipeFinder service
export interface Recipe {
  id?: string;  // Optional since it only exists after saving
  meal_name: string;
  cooking_time: number;
  ingredients: string[];
  instructions: string[];
  nutritional_value: NutritionalValue;
  created_at?: string; // Optional since it only exists after saving
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
