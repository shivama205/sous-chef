import { supabase } from '@/lib/supabase'
import { FeatureName, MealPlanGenerationMetadata } from '@/types/features';
import type { MealPlan, MealPlanGenerationRequest } from '@/types/mealPlan'
import { trackFeatureUsage } from '@/utils/analytics';
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


export async function generateMealPlan(request: MealPlanGenerationRequest): Promise<MealPlan> {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = await generatePrompt(request);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/```json([\s\S]*?)```/) || [null, text];
    const jsonString = jsonMatch[1]?.trim() || text.trim();
    
    const mealPlan = JSON.parse(jsonString);

    // Track the feature usage
    const metadata: MealPlanGenerationMetadata = {
      input: request,
      output: mealPlan
    };
    trackFeatureUsage(FeatureName.MEAL_PLAN_GENERATION, metadata);

    return mealPlan;
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw error;
  }
}

export async function generatePrompt(request: MealPlanGenerationRequest): Promise<string> {
  return `Create a ${request.days}-day meal plan with the following requirements:
    ${request.dietaryRestrictions ? `Dietary Restrictions: ${request.dietaryRestrictions}` : 'No specific dietary restrictions.'}
    ${request.cuisinePreferences?.length ? `Preferred Cuisines: ${request.cuisinePreferences.join(', ')}` : 'No specific cuisine preferences (include a variety of cuisines).'}
    
    Nutritional Targets:
    - Daily Calories: ${request.preferences.targetCalories}kcal
    - Daily Protein: ${request.preferences.targetProtein}g
    - Daily Carbs: ${request.preferences.targetCarbs}g
    - Daily Fat: ${request.preferences.targetFat}g

    Do not include any other text in the response.

    Response should follow this schema:
    {
      "days": [
        {
          "day": string,
          "meals": [{
            "name": string,
            "time": string, // Breakfast, Morning Snack, Lunch, Afternoon Snack, Dinner
            "recipeLink": string, // Google search url for the recipe
            "nutritionalValue": {
              "calories": number,
              "protein": number, 
              "carbs": number,
              "fat": number
            }
          }]
        }
      ]
    }`;
}