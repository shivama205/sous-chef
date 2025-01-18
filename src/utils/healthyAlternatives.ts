import { HealthyAlternativeMetadata } from "@/types/features";

interface GenerateSuggestionsParams {
  mealName: string;
  dietaryRestrictions?: string[];
  healthGoals?: string[];
  additionalInstructions?: string;
}

export function checkDietaryConflicts(restrictions: string[]): string | null {
  const conflicts = [
    { pair: ['vegan', 'pescatarian'], message: 'Vegan and pescatarian diets are mutually exclusive' },
    { pair: ['keto', 'low-fat'], message: 'Keto diet requires high fat intake' },
    { pair: ['vegan', 'keto'], message: 'Vegan keto is extremely restrictive and not recommended' },
    { pair: ['low-carb', 'mediterranean'], message: 'Mediterranean diet includes healthy carbs' }
  ];

  for (const { pair, message } of conflicts) {
    if (pair.every(diet => restrictions.includes(diet))) {
      return message;
    }
  }

  return null;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred. Please try again.';
}

export function generateHealthySuggestions({
  mealName,
  dietaryRestrictions = [],
  healthGoals = [],
  additionalInstructions = ""
}: GenerateSuggestionsParams): string[] {
  const suggestions: string[] = [];

  // General cooking method suggestions
  suggestions.push(
    `Try baking or grilling instead of frying for a healthier version of ${mealName}`,
    `Consider using an air fryer to reduce oil usage while maintaining crispiness`
  );

  // Ingredient substitution suggestions
  suggestions.push(
    `Replace refined grains with whole grains (e.g., whole wheat flour, brown rice)`,
    `Use natural sweeteners like honey or maple syrup instead of refined sugar`,
    `Add more vegetables to increase nutritional value`
  );

  // Dietary restriction specific suggestions
  if (dietaryRestrictions.includes('gluten-free')) {
    suggestions.push(
      `Use gluten-free alternatives like almond flour or chickpea flour`,
      `Consider naturally gluten-free grains like quinoa or rice`
    );
  }

  if (dietaryRestrictions.includes('dairy-free')) {
    suggestions.push(
      `Try plant-based milk alternatives like almond, oat, or coconut milk`,
      `Use nutritional yeast for a cheese-like flavor`
    );
  }

  if (dietaryRestrictions.includes('vegan')) {
    suggestions.push(
      `Replace eggs with flax eggs or commercial egg replacers`,
      `Use plant-based protein sources like tofu, tempeh, or legumes`
    );
  }

  // Health goal specific suggestions
  if (healthGoals.includes('weight-loss')) {
    suggestions.push(
      `Use portion control and measure ingredients`,
      `Add more fiber-rich vegetables to increase satiety`,
      `Consider using a food scale for precise portions`
    );
  }

  if (healthGoals.includes('muscle-gain')) {
    suggestions.push(
      `Increase protein content with lean meats or plant-based proteins`,
      `Add complex carbohydrates for sustained energy`,
      `Consider protein-rich side dishes`
    );
  }

  if (healthGoals.includes('heart-health')) {
    suggestions.push(
      `Reduce sodium and use herbs for flavoring`,
      `Include heart-healthy fats like olive oil and avocados`,
      `Add omega-3 rich ingredients like fatty fish or flaxseeds`
    );
  }

  return suggestions;
}

export function generateAlternativePrompt({
  mealName,
  dietaryRestrictions = [],
  healthGoals = [],
  additionalInstructions = ""
}: GenerateSuggestionsParams): string {
  const restrictionsText = dietaryRestrictions.length > 0 
    ? `considering these dietary restrictions: ${dietaryRestrictions.join(', ')}`
    : '';
  
  const goalsText = healthGoals.length > 0
    ? `optimized for these health goals: ${healthGoals.join(', ')}`
    : '';
  
  const instructionsText = additionalInstructions 
    ? `Additional requirements: ${additionalInstructions}`
    : '';

  return `
    Please suggest healthy alternatives for ${mealName}.
    ${restrictionsText}
    ${goalsText}
    ${instructionsText}
    
    Please provide:
    1. A healthier version of the original dish with specific ingredient substitutions
    2. Alternative dishes with similar flavors but healthier ingredients
    3. Cooking method modifications to make it healthier
    4. Nutritional benefits of the suggested alternatives
    5. Portion size recommendations
    6. Tips for meal prep and storage
    7. Potential ingredient variations based on seasonal availability
    8. Suggestions for complementary side dishes
  `.trim();
} 