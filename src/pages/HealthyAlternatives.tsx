import { useState } from "react";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { useAuth } from "@/providers/AuthProvider";
import { usePageTracking } from "@/hooks/usePageTracking";
import { dataLayer } from "@/services/dataLayer";

export function HealthyAlternatives() {
  usePageTracking();
  const { user } = useAuth();
  
  const handleSearch = async (ingredient: string) => {
    try {
      // Track ingredient search
      dataLayer.trackRecipeSearch({
        search_term: ingredient,
        search_type: 'ingredients',
        results_count: 0, // Will be updated after results
        user_id: user?.id
      });

      const alternatives = await findAlternatives(ingredient);

      // Track successful search
      dataLayer.trackRecipeSearch({
        search_term: ingredient,
        search_type: 'ingredients',
        results_count: alternatives.length,
        user_id: user?.id
      });

      // ... rest of search logic
    } catch (error) {
      console.error('Error finding alternatives:', error);
    }
  };

  const handleAlternativeSelect = (original: string, alternative: string) => {
    // Track alternative selection
    dataLayer.trackFormField({
      field_name: 'alternative_selection',
      field_value: {
        original_ingredient: original,
        selected_alternative: alternative
      },
      user_id: user?.id
    });

    // ... rest of selection logic
  };

  const handleRecipeView = (recipe: any) => {
    // Track recipe view from alternatives
    dataLayer.trackRecipeView({
      recipe_id: recipe.id,
      recipe_name: recipe.name,
      recipe_category: 'healthy_alternative',
      cooking_time: recipe.cookingTime,
      user_id: user?.id
    });

    // ... rest of recipe view logic
  };

  return (
    // ... your existing JSX
  );
} 