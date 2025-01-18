import { GoogleGenerativeAI } from "@google/generative-ai";
import type { HealthyAlternativeRequest, HealthyAlternativeResponse } from '@/types/healthyAlternative';
import { trackFeatureUsage } from "@/utils/analytics";

export async function generateHealthyAlternative(request: HealthyAlternativeRequest): Promise<HealthyAlternativeResponse> {
  console.log("Generating healthy alternative for:", request);
  
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
    const data = JSON.parse(jsonString);

    const success = data.alternatives?.length > 0;

    // Track the feature usage
    await trackFeatureUsage('healthy_alternative_used', {
      healthyAlternative: {
        mealName: request.mealName,
        dietaryRestrictions: request.dietaryRestrictions,
        healthGoals: request.healthGoals,
        additionalInstructions: request.additionalInstructions,
        success,
        alternatives: success ? data.alternatives : undefined,
        error: success ? undefined : "No alternatives found"
      }
    });

    return {
      alternatives: data.alternatives || [],
      success
    };
  } catch (error) {
    console.error("Error generating healthy alternative:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    // Track the error
    await trackFeatureUsage('healthy_alternative_used', {
      healthyAlternative: {
        mealName: request.mealName,
        dietaryRestrictions: request.dietaryRestrictions,
        healthGoals: request.healthGoals,
        additionalInstructions: request.additionalInstructions,
        success: false,
        error: errorMessage
      }
    });

    throw error;
  }
}

function generatePrompt(request: HealthyAlternativeRequest): string {
  const { mealName, dietaryRestrictions, healthGoals, additionalInstructions } = request;
  
  return `
    Please suggest healthy alternatives for ${mealName}.
    ${dietaryRestrictions?.length ? `Dietary restrictions: ${dietaryRestrictions.join(', ')}` : ''}
    ${healthGoals?.length ? `Health goals: ${healthGoals.join(', ')}` : ''}
    ${additionalInstructions ? `Additional requirements: ${additionalInstructions}` : ''}
    
    Please provide:
    1. A healthier version of the original dish with specific ingredient substitutions
    2. Alternative dishes with similar flavors but healthier ingredients
    3. Cooking method modifications to make it healthier
    4. Nutritional benefits of the suggested alternatives
    
    Format the response as JSON with alternatives array.
  `.trim();
}