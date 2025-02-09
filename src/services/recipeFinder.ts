import { supabase } from '@/lib/supabase'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RecipeFinderRequest, Recipe } from '@/types/recipeFinder';
import { FeatureName, RecipeFinderMetadata } from '@/types/features';
import { trackFeatureUsage } from '@/utils/analytics';

export async function findRecipes(request: RecipeFinderRequest): Promise<Recipe[]> {
  try {
    // Validate request
    if (!request.ingredients || request.ingredients.length === 0) {
      throw new Error('At least one ingredient is required');
    }

    // Format request for the API
    const formattedRequest = {
      ingredients: request.ingredients,
      dietary_restrictions: request.dietaryRestrictions || [],
      additional_instructions: request.additionalInstructions || '',
      macros: request.macros || null
    };

    // Call OpenAI API
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate recipe suggestions based on these ingredients: ${formattedRequest.ingredients.join(', ')}
      ${formattedRequest.dietary_restrictions.length > 0 ? `\nDietary restrictions: ${formattedRequest.dietary_restrictions.join(', ')}` : ''}
      ${formattedRequest.additional_instructions ? `\nAdditional instructions: ${formattedRequest.additional_instructions}` : ''}
      ${formattedRequest.macros ? `\nTarget macros: Protein: ${formattedRequest.macros.protein}g, Carbs: ${formattedRequest.macros.carbs}g, Fat: ${formattedRequest.macros.fat}g` : ''}
      
      Please provide the recipes in this exact JSON format:
      {
        "recipes": [{
          "name": "Recipe Name",
          "description": "Brief description",
          "cookingTime": 30,
          "ingredients": ["ingredient 1", "ingredient 2"],
          "instructions": ["step 1", "step 2"],
          "nutritionalValue": {
            "calories": 500,
            "protein": 20,
            "carbs": 30,
            "fat": 15
          },
          "difficulty": "easy|medium|hard",
          "cuisineType": "cuisine type"
        }]
      }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const data = JSON.parse(jsonMatch[0]);
      if (!data.recipes || !Array.isArray(data.recipes)) {
        throw new Error('Invalid recipe data format');
      }

      // Transform and validate each recipe
      return data.recipes.map((recipe: any) => ({
        id: crypto.randomUUID(), // Generate temporary ID for new recipes
        name: recipe.name,
        description: recipe.description,
        cookingTime: recipe.cookingTime,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        nutritionalValue: recipe.nutritionalValue,
        difficulty: recipe.difficulty,
        cuisineType: recipe.cuisineType,
        imageUrl: null // Add placeholder for image
      }));
    } catch (parseError) {
      console.error('Error parsing recipe data:', parseError);
      throw new Error('Failed to parse recipe data');
    }
  } catch (error) {
    console.error('Error finding recipes:', error);
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
    // Transform recipe data to match database schema
    const recipeData = {
      user_id: userId,
      name: recipe.name || recipe.meal_name, // Handle both name formats
      description: recipe.description || `A delicious ${recipe.name || recipe.meal_name} recipe`,
      cooking_time: recipe.cookingTime || recipe.cooking_time, // Handle both formats
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      nutritional_value: recipe.nutritionalValue || recipe.nutritional_value || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      },
      image_url: recipe.imageUrl || null,
      cuisine_type: recipe.cuisineType || null,
      difficulty: recipe.difficulty || 'medium',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Basic validation
    if (!recipeData.name) {
      throw new Error('Recipe name is required');
    }
    if (!Array.isArray(recipeData.ingredients) || recipeData.ingredients.length === 0) {
      throw new Error('Recipe must have at least one ingredient');
    }
    if (!Array.isArray(recipeData.instructions)) {
      recipeData.instructions = []; // Ensure instructions is always an array
    }

    // Save recipe and return the newly created record
    const { data: savedRecipe, error: saveError } = await supabase
      .from('saved_recipes')
      .insert([recipeData])
      .select()
      .single();

    if (saveError) throw saveError;
    if (!savedRecipe) throw new Error('Failed to save recipe');

    return { success: true, recipe: savedRecipe };
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
