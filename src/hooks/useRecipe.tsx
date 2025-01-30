import { useState } from 'react';
import { Recipe } from '@/types';
import { apiClient } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export const useRecipe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: recipes } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<Recipe[]>('/api/recipes');
        return response;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
        return [];
      } finally {
        setIsLoading(false);
      }
    }
  });

  return {
    recipes: recipes || [],
    isLoading,
    error
  };
};