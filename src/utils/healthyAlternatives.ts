export function checkDietaryConflicts(restrictions: string[]): string | null {
  // Normalize restrictions to lowercase for comparison
  const normalizedRestrictions = restrictions.map(r => r.toLowerCase());
  
  const conflictPairs = [
    ['vegan', 'pescatarian'],
    ['keto', 'low-fat'],
    ['low-carb', 'mediterranean'],
    ['vegan', 'keto'],
    ['dairy-free', 'high-dairy'],
    ['gluten-free', 'high-gluten']
  ];

  for (const [a, b] of conflictPairs) {
    if (normalizedRestrictions.includes(a) && normalizedRestrictions.includes(b)) {
      return `'${a}' and '${b}' dietary restrictions conflict with each other`;
    }
  }

  return null;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

export function generateHealthySuggestions({
  mealName,
  dietaryRestrictions,
  additionalInstructions
}: {
  mealName: string
  dietaryRestrictions: string
  additionalInstructions?: string
}): string[] {
  const suggestions = [
    "Try adding more whole food ingredients",
    "Consider plant-based alternatives",
    "Look for lower-calorie substitutes",
    "Experiment with different cooking methods"
  ]

  if (dietaryRestrictions.length > 0) {
    suggestions.push(`Check for ${dietaryRestrictions[0]}-friendly versions`)
  }

  if (additionalInstructions) {
    suggestions.push(`These are some additional instructions by the requestor: ${additionalInstructions}`)
  }

  return suggestions
}

export function generateAlternativePrompt({
  mealName,
  dietaryRestrictions,
  additionalInstructions
}: {
  mealName: string
  dietaryRestrictions: string
  additionalInstructions?: string
}): string {
  const prompt = `You are a nutritionist and healthy eating expert. I need healthy alternatives for "${mealName}".
  
  ${dietaryRestrictions ? `The alternatives must be compatible with these dietary restrictions: ${dietaryRestrictions}` : ''}
  ${additionalInstructions ? `Additional requirements: ${additionalInstructions}` : ''}
  
  Provide 2-3 healthy alternatives with their benefits and nutritional comparison.
  
  Format your response as JSON with this structure:
  {
    "alternatives": [{
      "original": "${mealName}",
      "substitute": "healthier version",
      "benefits": [
        "specific health benefit 1",
        "specific health benefit 2",
        "specific health benefit 3"
      ],
      "nutritionalComparison": {
        "calories": "clear calorie comparison",
        "protein": "protein content comparison",
        "healthBenefits": [
          "specific nutritional benefit 1",
          "specific nutritional benefit 2"
        ]
      }
    }]
  }
  
  Make sure each alternative is significantly healthier while maintaining similar taste and satisfaction.
  Include specific nutritional benefits and clear comparisons.`;

  return prompt;
} 