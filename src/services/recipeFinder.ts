import { supabase } from '@/lib/supabase'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RecipeFinderRequest, Recipe } from '@/types/recipeFinder';
import { FeatureName, RecipeFinderMetadata } from '@/types/features';
import { trackFeatureUsage } from '@/utils/analytics';

export async function findRecipes(request: RecipeFinderRequest): Promise<Recipe[]> {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = generatePrompt(request);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Generated recipe response:", text);
    
    const jsonMatch = text.match(/```json([\s\S]*?)```/) || [null, text];
    const jsonString = jsonMatch[1]?.trim() || text.trim();
    const recipes = JSON.parse(jsonString);

    // Track the feature usage
    const metadata: RecipeFinderMetadata = {
      input: request,
      output: recipes || [],
    };
    trackFeatureUsage(FeatureName.RECIPE_FINDER, metadata);

    return recipes || [];
  } catch (error) {
    console.error("Error finding recipes:", error);
    throw error;
  }
}

function generatePrompt(request: RecipeFinderRequest): string {
  return `
  Suggest 3 possible recipes using the mentioned ingredients and dietary restrictions:
  Ingredients: ${request.ingredients}
  Dietary Restrictions: ${request.dietaryRestrictions}
  Additional Instructions: ${request.additionalInstructions}

  Also consider user's macros if provided:
  Macros: ${request.macros}

  Do not include any other text in the response.

  Format the response as a JSON object with this structure:
  [{
    "mealName": string,
    "cookingTime": number,
    "ingredients": string[],
    "instructions": string[],
    "nutritionalValue": {
      "calories": number,
      "protein": number, 
      "carbs": number,
      "fat": number
    }
  }]`;
}

export async function saveRecipe(userId: string, recipe: Recipe) {
  const { data, error } = await supabase
    .from("saved_recipes")
    .insert([
      {
        user_id: userId,
        meal_name: recipe.mealName,
        cooking_time: recipe.cookingTime,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        nutritional_value: recipe.nutritionalValue
      }
    ])
    .select("*")
    .single();

  if (error) throw error;
  
  // Return the recipe with the new ID
  return {
    ...recipe,
    id: data.id
  };
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
