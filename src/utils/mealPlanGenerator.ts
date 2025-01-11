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
- Name of the meal
- Nutritional information including calories, protein, carbs, fat, fiber, and sugar

Format the response as a JSON object with the following structure:
{
  "days": [
    {
      "day": "Monday",
      "meals": [
        {
          "name": "Meal name",
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
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(createPrompt(preferences));
    const response = await result.response;
    const text = response.text();
    
    console.log("Generated response:", text);
    const mealPlan = JSON.parse(text);
    
    return mealPlan;
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw error;
  }
};