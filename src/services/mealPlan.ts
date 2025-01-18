import { supabase } from '@/lib/supabase'
import type { MealPlan } from '@/types/mealPlan'
import type { Preferences } from '@/types/preferences'
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function saveMealPlan(userId: string, plan: MealPlan, name: string) {
  const { data: savedPlan, error: saveError } = await supabase
    .from("saved_meal_plans")
    .insert([
      {
        user_id: userId,
        name: name,
        plan: plan
      }
    ])
    .select()
    .single();

  if (saveError) throw saveError;
  return savedPlan;
}

export async function getUserMealPlans(userId: string) {
  const { data: plans, error } = await supabase
    .from("saved_meal_plans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return plans;
}

export async function generateMealPlanPrompt(preferences: Preferences): Promise<string> {
  return `Create a ${preferences.days}-day meal plan with the following requirements:
    ${preferences.dietaryRestrictions ? `Dietary Restrictions: ${preferences.dietaryRestrictions}` : 'No specific dietary restrictions.'}
    
    Nutritional Targets:
    - Daily Calories: ${preferences.targetCalories}
    - Daily Protein: ${preferences.targetProtein}g
    - Daily Carbs: ${preferences.targetCarbs}g
    - Daily Fat: ${preferences.targetFat}g
    
    ${preferences.cuisinePreferences?.length ? `Preferred Cuisines: ${preferences.cuisinePreferences.join(', ')}` : 'No specific cuisine preferences (include a variety of cuisines).'}
    
    Format the response as a JSON object with this structure:
    {
      "days": [
        {
          "day": "Monday",
          "meals": [
            {
              "name": "Meal name",
              "time": "breakfast",
              "recipeLink": "URL",
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
}

export async function generateMealPlan(preferences: Preferences): Promise<MealPlan> {
  console.log("Generating meal plan with preferences:", preferences);
  
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = await generateMealPlanPrompt(preferences);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Generated meal plan response:", text);
    
    const jsonMatch = text.match(/```json([\s\S]*?)```/) || [null, text];
    const jsonString = jsonMatch[1]?.trim() || text.trim();
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw error;
  }
}