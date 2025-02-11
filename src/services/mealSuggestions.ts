import { GoogleGenerativeAI } from "@google/generative-ai";
import { Recipe } from "@/types/recipeFinder";

export type SuggestedMeal = Omit<Recipe, 'id'> & {
  type: "eat-out" | "order-in" | "cook-at-home";
  imagePrompt?: string;
};

export interface MealSuggestionRequest {
  preferences?: string[];
  dietaryRestrictions?: string;
  instructions?: string;
  mealType?: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  cookingTime?: "Quick" | "Medium" | "Long";
  difficulty?: "Easy" | "Medium" | "Hard";
}

function generateMealSuggestionPrompt(request: MealSuggestionRequest) {
  return `Suggest 6 delicious and healthy meals based on the following preferences:
${JSON.stringify(request, null, 2)}

For each meal, provide:
- Name (required)
- Description (2-3 sentences)
- Type (must be one of: "eat-out", "order-in", "cook-at-home") - provide 2 of each type
- Cooking time in minutes (required)
- Ingredients list (required for cook-at-home meals, empty array for others)
- Step-by-step instructions (required for cook-at-home meals, empty array for others)
- Nutritional value (required)
- Difficulty level (easy/medium/hard, lowercase only)
- Cuisine type (e.g., Italian, Asian, Mediterranean, etc.)
- A brief image prompt that could be used to generate an image of this meal

When suggesting 2 cook-at-home meals, ensure the ingredients are easily accessible and the instructions are clear and easy to follow.
When suggesting 2 order-in meals, ensure not to mention specific restaurants or delivery services.
When suggesting 2 eat-out meals, ensure not to mention specific restaurants or locations.

Be clear and informative for the cooking instructions. Consider that the user may not have any cooking experience.

Format the response as a JSON array of objects with these EXACT properties:
{
  "name": string,
  "description": string,
  "type": "eat-out" | "order-in" | "cook-at-home",
  "cookingTime": number,
  "ingredients": string[],
  "instructions": string[],
  "nutritionalValue": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "difficulty": "easy" | "medium" | "hard",
  "cuisineType": string,
  "imagePrompt": string
}

Example response:
[
  {
    "name": "Mediterranean Quinoa Bowl",
    "description": "A vibrant and nutritious bowl featuring protein-rich quinoa, fresh vegetables, and Mediterranean flavors. Perfect for a light yet satisfying meal that's packed with nutrients.",
    "type": "cook-at-home",
    "cookingTime": 25,
    "ingredients": ["1 cup quinoa", "cherry tomatoes", "cucumber", "feta cheese", "olive oil"],
    "instructions": ["Cook quinoa according to package", "Chop vegetables", "Combine ingredients", "Drizzle with olive oil"],
    "nutritionalValue": {
      "calories": 400,
      "protein": 20,
      "carbs": 45,
      "fat": 15
    },
    "difficulty": "medium",
    "cuisineType": "Mediterranean",
    "imagePrompt": "A colorful Mediterranean quinoa bowl with fresh vegetables, feta cheese, and herbs, styled on a rustic wooden table with natural lighting"
  },
  {
    "name": "Grilled Salmon Teriyaki",
    "description": "Fresh salmon fillet glazed with homemade teriyaki sauce, served with steamed vegetables. A perfect balance of protein and healthy fats.",
    "type": "eat-out",
    "cookingTime": 0,
    "ingredients": [],
    "instructions": [],
    "nutritionalValue": {
      "calories": 450,
      "protein": 35,
      "carbs": 20,
      "fat": 25
    },
    "difficulty": "medium",
    "cuisineType": "Japanese",
    "imagePrompt": "A beautifully plated grilled salmon with teriyaki glaze, garnished with sesame seeds and green onions"
  }
]`;
}

export async function suggestMeals(request: MealSuggestionRequest): Promise<SuggestedMeal[]> {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = generateMealSuggestionPrompt(request);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/```json([\s\S]*?)```/) || [null, text];
    const jsonString = jsonMatch[1]?.trim() || text.trim();
    
    const suggestions = JSON.parse(jsonString) as SuggestedMeal[];
    
    // Transform suggestions to match Recipe interface format
    return suggestions.map(meal => ({
      ...meal,
      difficulty: meal.difficulty?.toLowerCase() as 'easy' | 'medium' | 'hard',
      cuisineType: 'Mixed',
      imageUrl: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  } catch (error) {
    console.error("Error generating meal suggestions:", error);
    throw new Error('Failed to generate meal suggestions');
  }
} 