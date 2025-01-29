import { API_BASE_URL } from "@/config";
import type { Recipe } from "@/features/recipe-sharing/types";

// Types
export interface GenerateRecipeParams {
  ingredients?: string[];
  cuisine?: string;
  dietaryRestrictions?: string[];
  servings?: number;
  difficulty?: string;
}

export interface GenerateImageParams {
  description: string;
  style?: string;
}

export interface AskAIParams {
  question: string;
  recipeContext?: Partial<Recipe>;
}

export interface AIError {
  message: string;
  code?: string;
  details?: unknown;
}

// Helper function for API calls
async function callAIEndpoint<T>(endpoint: string, data: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/ai/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to call AI service: ${endpoint}`);
  }

  const { data: responseData } = await response.json();
  return responseData;
}

// AI Service
export const aiService = {
  async generateRecipe(params: GenerateRecipeParams): Promise<Recipe> {
    try {
      return await callAIEndpoint<Recipe>("generate-recipe", params);
    } catch (error) {
      console.error("Error generating recipe:", error);
      throw error;
    }
  },

  async generateImage(params: GenerateImageParams): Promise<string> {
    try {
      const response = await callAIEndpoint<{ url: string }>("generate-image", params);
      return response.url;
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  },

  async askAI(params: AskAIParams): Promise<string> {
    try {
      const response = await callAIEndpoint<{ answer: string }>("ask", params);
      return response.answer;
    } catch (error) {
      console.error("Error getting AI answer:", error);
      throw error;
    }
  },

  async enhanceRecipe(recipe: Recipe): Promise<Recipe> {
    try {
      return await callAIEndpoint<Recipe>("enhance-recipe", { recipe });
    } catch (error) {
      console.error("Error enhancing recipe:", error);
      throw error;
    }
  },
}; 
