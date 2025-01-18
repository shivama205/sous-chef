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
  mealName: string;
  cookingTime: number;
  ingredients: string[];
  instructions: string[];
  nutritionalValue: NutritionalValue;
}

// RecipeFinderMetadata is the metadata object for the RecipeFinder service
export interface RecipeFinderMetadata {
  input: RecipeFinderRequest;
  output: Recipe[];
}