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
    "meal_name": string,
    "cooking_time": number,
    "ingredients": string[],
    "instructions": string[],
    "nutritional_value": {
      "calories": number,
      "protein": number, 
      "carbs": number,
      "fat": number
    }
  }]`;
}

export async function saveRecipe(userId: string, recipe: Recipe) {
  try {
    // Validate recipe data
    if (!recipe.name || !recipe.cookingTime || !recipe.ingredients) {
      throw new Error('Invalid recipe data');
    }

    // Check if recipe already exists for this user
    const { data: existingRecipe } = await supabase
      .from('saved_recipes')
      .select('id')
      .eq('user_id', userId)
      .eq('name', recipe.name)
      .maybeSingle();

    if (existingRecipe) {
      throw new Error('Recipe already saved');
    }

    // Prepare recipe data
    const recipeData = {
      user_id: userId,
      name: recipe.name,
      description: recipe.description || '',
      cooking_time: recipe.cookingTime,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions || [],
      nutritional_value: recipe.nutritionalValue || {},
      image_url: recipe.imageUrl || null,
      cuisine_type: recipe.cuisineType || null,
      difficulty: recipe.difficulty || 'medium',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Save recipe
    const { error } = await supabase
      .from('saved_recipes')
      .insert([recipeData]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error;
  }
}

export async function getUserRecipes(userId: string): Promise<Recipe[]> {
  try {
    const { data, error } = await supabase
      .from('saved_recipes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform database records to Recipe type
    return (data || []).map(record => ({
      id: record.id,
      name: record.name,
      description: record.description,
      cookingTime: record.cooking_time,
      ingredients: record.ingredients,
      instructions: record.instructions,
      nutritionalValue: record.nutritional_value,
      imageUrl: record.image_url,
      cuisineType: record.cuisine_type,
      difficulty: record.difficulty,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    }));
  } catch (error) {
    console.error('Error getting user recipes:', error);
    throw error;
  }
}
