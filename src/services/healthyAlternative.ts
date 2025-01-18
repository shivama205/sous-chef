import { GoogleGenerativeAI } from "@google/generative-ai";
import type { HealthyAlternativeRequest, HealthyAlternative } from '@/types/healthyAlternative';
import { trackFeatureUsage } from "@/utils/analytics";
import { FeatureName, HealthyAlternativeMetadata } from "@/types/features";



export async function generateHealthyAlternative(request: HealthyAlternativeRequest): Promise<HealthyAlternative[]> {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = generatePrompt(request);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Generated healthy alternative response:", text);
    
    const jsonMatch = text.match(/```json([\s\S]*?)```/) || [null, text];
    const jsonString = jsonMatch[1]?.trim() || text.trim();
    const alternatives = JSON.parse(jsonString);

    // Track the feature usage
    const metadata: HealthyAlternativeMetadata = {
      input: request,
      output: alternatives || [],
    };
    await trackFeatureUsage(FeatureName.HEALTHY_ALTERNATIVE, metadata);

    return alternatives || [];
  } catch (error) {
    console.error("Error generating healthy alternative:", error);
    throw error;
  }
}

function generatePrompt(request: HealthyAlternativeRequest): string {
      
  return `
  Suggest 3 healthy alternatives for the meal ${request.mealName}.
  ${request.dietaryRestrictions ? `Make sure to consider the following dietary restrictions: ${request.dietaryRestrictions}` : ''}
  ${request.additionalInstructions ? `Make sure to consider the following additional instructions from the user: ${request.additionalInstructions}` : ''}
    
  Please provide:
  1. A healthier version of the original dish with specific ingredient substitutions
  2. Alternative dishes with similar flavors but healthier ingredients
  3. Cooking method modifications to make it healthier
  4. Nutritional benefits of the suggested alternatives
  5. Cooking time of the suggested alternatives

  Format the response as JSON with alternatives array.
  If no alternatives are found, return an empty array.

  Do not include any other text in the response.

  Response should follow this schema (array of alternatives):
  [{
    "mealName": string,
    "cookingTime": number,
    "ingredients": string[],
    "instructions": string[],
    "nutritionalValue": {
      "calories": number,
      "protein": number, 
      "carbs": number,
      "fat": number
    },
    "nutritionComparison": string[]
  }]
`.trim();
}