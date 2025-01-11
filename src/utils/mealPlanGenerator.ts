import { GoogleGenerativeAI } from "@google/generative-ai";
import type { MealPlan } from "@/types/mealPlan";
import type { Preferences } from "@/types/preferences";

const createPrompt = (preferences: Preferences): string => {
  return `Create a ${preferences.days}-day meal plan with the following requirements:
${preferences.dietaryRestrictions ? `Dietary restrictions: ${preferences.dietaryRestrictions}` : ''}
${preferences.proteinGoal ? `Daily protein goal: ${preferences.proteinGoal}g` : ''}
${preferences.carbGoal ? `Daily carb goal: ${preferences.carbGoal}g` : ''}
${preferences.cuisinePreferences?.length ? `Preferred cuisines: ${preferences.cuisinePreferences.join(', ')}` : ''}

For each meal, provide:
- Name of the meal (a descriptive name of the meal)
- Time of the meal (Breakfast, Lunch, Dinner, Snack)
- Recipe link (a google search link with search query for the recipe)
- Nutritional information including calories, protein, carbs, fat, fiber, and sugar

Always suggest meal plan with 4 meals with daily calories between 1500 and 2000 calories.
Consider output token limits when generating the meal plan. Meal plan has to always be 8000 tokens or less.
Do not add any other text or comments to the response.

Format the response as a JSON object with the following structure:
{
  "days": [
    {
      "day": "Monday",
      "meals": [
        {
          "name": "Meal name",
          "time": "breakfast",
          "recipeLink": "https://www.example.com/recipes/chicken-alfredo",
          "nutritionInfo": {
            "calories": 500,
            "protein": 30,
            "carbs": 50,
            "fat": 20,
            "fiber": 5,
            "sugar": 10
          }
        }
      ]
    }
  ]
}`;
};

export const generateMealPlan = async (preferences: Preferences): Promise<MealPlan> => {
  console.log("Generating meal plan with preferences:", preferences);
  
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(createPrompt(preferences));
    const response = await result.response;
    const text = response.text();
    
    console.log("Generated response:", text);
    
    // Extract JSON content from the response
    const jsonMatch = text.match(/```json([\s\S]*?)```/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }
    const jsonString = jsonMatch[1].trim();
    
    const mealPlan = JSON.parse(jsonString);
    
    return mealPlan;
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw error;
  }
};