import type { MealPlan } from "@/types/mealPlan";

const createPrompt = (preferences: any) => {
  return `Create a ${preferences.days}-day meal plan with the following requirements:
${preferences.dietaryRestrictions ? `Dietary restrictions: ${preferences.dietaryRestrictions}` : ''}
${preferences.proteinGoal ? `Daily protein goal: ${preferences.proteinGoal}g` : ''}
${preferences.carbGoal ? `Daily carb goal: ${preferences.carbGoal}g` : ''}
Preferred cuisines: ${preferences.cuisinePreferences.join(', ')}

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

export const generateMealPlan = async (preferences: any): Promise<MealPlan> => {
  console.log("Generating meal plan with preferences:", preferences);
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a nutritionist and meal planning expert. Generate detailed meal plans with accurate nutritional information.",
          },
          {
            role: "user",
            content: createPrompt(preferences),
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate meal plan");
    }

    const data = await response.json();
    const mealPlan = JSON.parse(data.choices[0].message.content);
    console.log("Generated meal plan:", mealPlan);
    return mealPlan;
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw error;
  }
};