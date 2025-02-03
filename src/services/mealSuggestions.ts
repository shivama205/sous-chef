import { GoogleGenerativeAI } from "@google/generative-ai";
import { NutritionalValue } from "@/types/healthyAlternative";

export interface SuggestedMeal {
  name: string;
  description: string;
  type: "eat-out" | "order-in" | "cook-at-home";
  nutritionalValue: NutritionalValue;
  cookingTime: number;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: string[];
  instructions: string[];
  imagePrompt?: string;
}

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
- Name
- Brief description (2-3 sentences)
- Type (must be one of: "eat-out", "order-in", "cook-at-home") - provide 2 of each type
- Nutritional value (protein, carbs, fat, calories)
- Cooking time in minutes (only for cook-at-home meals)
- Difficulty level (Easy/Medium/Hard, only for cook-at-home meals)
- List of ingredients (only for cook-at-home meals)
- Step-by-step instructions (only for cook-at-home meals)
- A brief image prompt that could be used to generate an image of this meal

When suggesting 2 cook-at-home meals, ensure the ingredients are easily accessible and the instructions are clear and easy to follow.
When suggesting 2 order-in meals, ensure not to mention about where to order from. 
When suggesting 2 eat-out meals, ensure not to mention about the restaurant or where they can find it.

Format the response as a JSON array of objects with these properties:
name, description, type, nutritionalValue (object with protein, carbs, fat, calories), cookingTime (number), difficulty, ingredients (array), instructions (array), imagePrompt (string)

Example response:
[
  {
    "name": "Mediterranean Quinoa Bowl",
    "description": "A vibrant and nutritious bowl featuring protein-rich quinoa, fresh vegetables, and Mediterranean flavors. Perfect for a light yet satisfying meal that's packed with nutrients.",
    "type": "cook-at-home",
    "nutritionalValue": {
      "protein": 20,
      "carbs": 45,
      "fat": 15,
      "calories": 400
    },
    "cookingTime": 25,
    "difficulty": "Easy",
    "ingredients": ["1 cup quinoa", "cherry tomatoes", "cucumber", "feta cheese", "olive oil"],
    "instructions": ["Cook quinoa according to package", "Chop vegetables", "Combine ingredients", "Drizzle with olive oil"],
    "imagePrompt": "A colorful Mediterranean quinoa bowl with fresh vegetables, feta cheese, and herbs, styled on a rustic wooden table with natural lighting"
  }
]`;
}

export async function suggestMeals(request: MealSuggestionRequest): Promise<SuggestedMeal[]> {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = generateMealSuggestionPrompt(request);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/```json([\s\S]*?)```/) || [null, text];
    const jsonString = jsonMatch[1]?.trim() || text.trim();
    
    const suggestions = JSON.parse(jsonString) as SuggestedMeal[];
    return suggestions;
  } catch (error) {
    console.error("Error generating meal suggestions:", error);
    throw new Error('Failed to generate meal suggestions');
  }
} 