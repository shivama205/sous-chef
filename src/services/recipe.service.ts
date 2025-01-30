import { apiClient } from './api';
import type { Recipe, RecipeMetadata } from '../types';

export class RecipeService {
  private static instance: RecipeService;

  private constructor() {}

  public static getInstance(): RecipeService {
    if (!RecipeService.instance) {
      RecipeService.instance = new RecipeService();
    }
    return RecipeService.instance;
  }

  // Recipe CRUD operations
  async createRecipe(data: Partial<Recipe>): Promise<Recipe> {
    return apiClient.post<Recipe>('/recipes', data);
  }

  async updateRecipe(id: string, data: Partial<Recipe>): Promise<Recipe> {
    return apiClient.put<Recipe>(`/recipes/${id}`, data);
  }

  async deleteRecipe(id: string): Promise<void> {
    return apiClient.delete<void>(`/recipes/${id}`);
  }

  async getRecipe(id: string): Promise<Recipe> {
    return apiClient.get<Recipe>(`/recipes/${id}`);
  }

  async listRecipes(params: {
    page?: number;
    limit?: number;
    userId?: string;
    search?: string;
    tags?: string[];
    difficulty?: string;
    isPublic?: boolean;
  }): Promise<{ recipes: Recipe[]; total: number }> {
    return apiClient.get<{ recipes: Recipe[]; total: number }>('/recipes', params);
  }

  // Recipe interactions
  async toggleLike(id: string): Promise<void> {
    return apiClient.post<void>(`/recipes/${id}/like`);
  }

  async toggleSave(id: string): Promise<void> {
    return apiClient.post<void>(`/recipes/${id}/save`);
  }

  // Recipe analytics
  async trackView(id: string): Promise<void> {
    return apiClient.post<void>(`/analytics/recipes/${id}/view`);
  }

  async getMetrics(id: string): Promise<RecipeMetadata> {
    return apiClient.get<RecipeMetadata>(`/analytics/recipes/${id}/metrics`);
  }

  async getTopRecipes(params: {
    timeframe?: 'day' | 'week' | 'month' | 'all';
    sortBy?: 'views' | 'likes' | 'saves' | 'rating';
    limit?: number;
  }): Promise<{ recipes: Recipe[]; total: number }> {
    return apiClient.get<{ recipes: Recipe[]; total: number }>('/analytics/recipes/top', params);
  }

  // Recipe search and filters
  async searchRecipes(query: string, params: {
    page?: number;
    limit?: number;
    tags?: string[];
    difficulty?: string;
  } = {}): Promise<{ recipes: Recipe[]; total: number }> {
    return this.listRecipes({
      ...params,
      search: query,
      isPublic: true
    });
  }

  async getRecipesByUser(userId: string, params: {
    page?: number;
    limit?: number;
  } = {}): Promise<{ recipes: Recipe[]; total: number }> {
    return this.listRecipes({
      ...params,
      userId,
      isPublic: true
    });
  }

  async getSavedRecipes(params: {
    page?: number;
    limit?: number;
  } = {}): Promise<{ recipes: Recipe[]; total: number }> {
    return apiClient.get<{ recipes: Recipe[]; total: number }>('/recipes/saved', params);
  }
} 