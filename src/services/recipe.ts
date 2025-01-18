import { supabase } from '@/lib/supabase'
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { UserMacros } from '@/types/macros';

export interface Recipe {
  name: string;
  cookingTime: string;
  ingredients: string[];
  instructions: string[];
  nutritionalValue: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface NoRecipesError {
  error: string;
  suggestions: string[];
}

export async function generateRecipePrompt(ingredients: string, macros: UserMacros | null): Promise<string> {
  return `Suggest 3 possible recipes using these ingredients:
    Ingredients: ${ingredients}
    ${macros ? `Target Macros per meal:
    - Calories: ~${Math.round(macros.calories / 3)}
    - Protein: ~${Math.round(macros.protein / 3)}g
    - Carbs: ~${Math.round(macros.carbs / 3)}g
    - Fat: ~${Math.round(macros.fat / 3)}g` : ''}
    
    Format the response as a JSON object with this structure:
    {
      "recipes": [
        {
          "name": "Recipe name",
          "cookingTime": "30 minutes",
          "ingredients": ["ingredient 1", "ingredient 2"],
          "instructions": ["step 1", "step 2"],
          "nutritionalValue": {
            "calories": 300,
            "protein": 20,
            "carbs": 30,
            "fat": 10,
            "fiber": 5
          }
        }
      ]
    }`;
}

export async function findRecipes(ingredients: string, macros: UserMacros | null): Promise<Recipe[]> {
  console.log("Finding recipes with ingredients:", ingredients);
  
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = await generateRecipePrompt(ingredients, macros);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Generated recipe response:", text);
    
    const jsonMatch = text.match(/```json([\s\S]*?)```/) || [null, text];
    const jsonString = jsonMatch[1]?.trim() || text.trim();
    const data = JSON.parse(jsonString);
    
    return data.recipes || [];
  } catch (error) {
    console.error("Error finding recipes:", error);
    throw error;
  }
}

export async function saveRecipe(userId: string, recipe: Recipe) {
  const { data, error } = await supabase
    .from("saved_recipes")
    .insert([
      {
        user_id: userId,
        recipe: recipe
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserRecipes(userId: string) {
  const { data: recipes, error } = await supabase
    .from("saved_recipes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return recipes;
}