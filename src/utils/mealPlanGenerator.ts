import { GoogleGenerativeAI } from "@google/generative-ai";
import type { MealPlan } from "@/types/mealPlan";
import type { Preferences } from "@/types/preferences";

const createNewMealPrompt = (mealPlan: MealPlan, dayIndex: number, mealIndex: number): string => {
  const day = mealPlan.days[dayIndex];
  const meal = day.meals[mealIndex];
  return `Based on the current meal plan, suggest a different meal for ${day.day} at ${meal.time}. 
  Current meal: ${meal.name}. 
  Please provide a new meal with a recipe link and nutritional information.
  
  Format the response as a JSON object with the following structure:
  {
    "name": "New meal name",
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
  `;
};

export const generateNewMeal = async (mealPlan: MealPlan, dayIndex: number, mealIndex: number): Promise<MealPlan> => {
  console.log("Generating new meal for day:", dayIndex, "meal:", mealIndex);
  
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(createNewMealPrompt(mealPlan, dayIndex, mealIndex));
    const response = await result.response;
    const text = response.text();
    
    console.log("Generated response for new meal:", text);
    
    // Extract JSON content from the response
    const jsonMatch = text.match(/```json([\s\S]*?)```/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }
    const jsonString = jsonMatch[1].trim();
    
    const newMeal = JSON.parse(jsonString);
    
    // Update the meal plan with the new meal
    const updatedMealPlan = { ...mealPlan };
    updatedMealPlan.days[dayIndex].meals[mealIndex] = newMeal;
    
    return updatedMealPlan;
  } catch (error) {
    console.error("Error generating new meal:", error);
    throw error;
  }
};

export async function generateMealPlan(preferences: Preferences): Promise<MealPlan> {
  const prompt = `Create a ${preferences.days}-day meal plan with the following requirements:

${preferences.dietaryRestrictions ? `Dietary Restrictions: ${preferences.dietaryRestrictions}` : 'No specific dietary restrictions.'}

Nutritional Targets:
${preferences.proteinGoal || preferences.calorieIntakeGoal ? `Daily Targets:
- ${preferences.proteinGoal ? `Target Daily Protein: ${preferences.proteinGoal}g` : ''}
- ${preferences.calorieIntakeGoal ? `Target Daily Calories: ${preferences.calorieIntakeGoal}` : ''}` : ''}
${preferences.mealTargets?.proteinPerMeal || preferences.mealTargets?.caloriesPerMeal ? `Per-Meal Targets:
- ${preferences.mealTargets.proteinPerMeal ? `Target Protein per Meal: ${preferences.mealTargets.proteinPerMeal}g` : ''}
- ${preferences.mealTargets.caloriesPerMeal ? `Target Calories per Meal: ${preferences.mealTargets.caloriesPerMeal}` : ''}` : ''}

${preferences.cuisinePreferences?.length ? `Preferred Cuisines: ${preferences.cuisinePreferences.join(', ')}` : 'No specific cuisine preferences (include a variety of cuisines).'}

Please create a detailed meal plan with 3 main meals (breakfast, lunch, dinner) and 2 snacks per day. For each meal, include:
1. Name of the dish
2. Nutritional information (protein, fat, carbs, calories)
3. Appropriate meal timing

Make sure the meals are varied, nutritionally balanced, and meet the specified targets. If no specific targets are provided, aim for balanced nutrition with approximately:
- 2000 calories per day
- 100g protein per day
- Balanced distribution across meals

Format the response as a meal plan with the following structure:

{
  "days": [
    {
      "day": "Monday",
      "meals": [
        {
          "name": "Meal name",
          "time": "breakfast",
          "recipeLink": "Google search link with search query for the recipe",
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
}

Do not add any other text or comments to the response.

`;

  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
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
}