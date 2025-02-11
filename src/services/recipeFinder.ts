import { supabase } from '@/lib/supabase'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RecipeFinderRequest, Recipe } from '@/types/recipeFinder';

export async function findRecipes(request: RecipeFinderRequest): Promise<Recipe[]> {
  try {
    // Validate request
    if (!request.ingredients || request.ingredients.length === 0) {
      throw new Error('At least one ingredient is required');
    }

    // Call OpenAI API
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = generatePrompt(request);
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
  // Format request for the API
  const formattedRequest = {
    ingredients: request.ingredients,
    dietary_restrictions: request.dietaryRestrictions || [],
    additional_instructions: request.additionalInstructions || '',
    macros: request.macros || null
  };

  return `
  Generate recipe suggestions based on these ingredients: ${request.ingredients.join(', ')}
      ${formattedRequest.dietary_restrictions.length > 0 ? `\nDietary restrictions: ${formattedRequest.dietary_restrictions.join(', ')}` : ''}
      ${formattedRequest.additional_instructions ? `\nAdditional instructions: ${formattedRequest.additional_instructions}` : ''}
      ${formattedRequest.macros ? `\nTarget macros: Protein: ${formattedRequest.macros.protein}g, Carbs: ${formattedRequest.macros.carbs}g, Fat: ${formattedRequest.macros.fat}g` : ''}
      
      Be clear and informative for the cooking instructions. Consider that the user may not have any cooking experience.

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
}

export async function saveRecipe(userId: string, recipe: Recipe) {
  try {
    // Transform recipe data to match database schema
    const recipeData = {
      user_id: userId,
      name: recipe.name,
      description: recipe.description || `A delicious ${recipe.name} recipe`,
      cooking_time: recipe.cookingTime,
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      nutritional_value: recipe.nutritionalValue || {
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
    if (!userId) {
      console.warn('No user ID provided to getUserRecipes');
      return [];
    }

    const { data, error } = await supabase
      .from('saved_recipes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting user recipes:', error);
      return []; // Return empty array instead of throwing
    }

    // Transform database records to Recipe type
    return (data || []).map(record => ({
      id: record.id,
      name: record.name || '', // Ensure name is never undefined
      description: record.description || '',
      cookingTime: record.cooking_time || 0,
      ingredients: Array.isArray(record.ingredients) ? record.ingredients : [],
      instructions: Array.isArray(record.instructions) ? record.instructions : [],
      nutritionalValue: record.nutritional_value || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      },
      imageUrl: record.image_url || null,
      cuisineType: record.cuisine_type || 'Mixed',
      difficulty: (record.difficulty || 'medium').toLowerCase() as 'easy' | 'medium' | 'hard',
      createdAt: record.created_at || new Date().toISOString(),
      updatedAt: record.updated_at || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error getting user recipes:', error);
    return []; // Return empty array on any error
  }
}
