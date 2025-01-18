import { GoogleGenerativeAI } from "@google/generative-ai";
import type { HealthyAlternative } from '@/types/healthyAlternative';

export async function generateHealthyAlternativePrompt(dish: string, preferences: string): Promise<string> {
  return `Create a healthy alternative for this dish:
    Original Dish: ${dish}
    Preferences/Restrictions: ${preferences}
    
    Format the response as a JSON object with this structure:
    {
      "name": "Healthy version name",
      "description": "Brief description",
      "nutritionalBenefits": ["benefit 1", "benefit 2"],
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"],
      "nutritionalInfo": {
        "calories": 300,
        "protein": 20,
        "carbs": 30,
        "fat": 10,
        "fiber": 5
      },
      "comparisonWithOriginal": {
        "calorieReduction": "30%",
        "keyDifferences": ["difference 1", "difference 2"]
      }
    }`;
}

export async function generateHealthyAlternative(dish: string, preferences: string): Promise<HealthyAlternative> {
  console.log("Generating healthy alternative for:", dish);
  
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = await generateHealthyAlternativePrompt(dish, preferences);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Generated healthy alternative response:", text);
    
    const jsonMatch = text.match(/```json([\s\S]*?)```/) || [null, text];
    const jsonString = jsonMatch[1]?.trim() || text.trim();
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating healthy alternative:", error);
    throw error;
  }
}