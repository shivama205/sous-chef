import { apiClient } from './api';
import type { Collection } from '../types';

export class CollectionService {
  private static instance: CollectionService;

  private constructor() {}

  public static getInstance(): CollectionService {
    if (!CollectionService.instance) {
      CollectionService.instance = new CollectionService();
    }
    return CollectionService.instance;
  }

  // Collection CRUD operations
  async createCollection(data: Partial<Collection>): Promise<Collection> {
    return apiClient.post<Collection>('/collections', data);
  }

  async updateCollection(id: string, data: Partial<Collection>): Promise<Collection> {
    return apiClient.put<Collection>(`/collections/${id}`, data);
  }

  async deleteCollection(id: string): Promise<void> {
    return apiClient.delete<void>(`/collections/${id}`);
  }

  async getCollection(id: string): Promise<Collection> {
    return apiClient.get<Collection>(`/collections/${id}`);
  }

  async listCollections(params: {
    page?: number;
    limit?: number;
    userId?: string;
    search?: string;
    isPublic?: boolean;
  }): Promise<{ collections: Collection[]; total: number }> {
    return apiClient.get<{ collections: Collection[]; total: number }>('/collections', params);
  }

  // Collection recipe management
  async addRecipeToCollection(collectionId: string, recipeId: string): Promise<void> {
    return apiClient.post<void>(`/collections/${collectionId}/recipes`, { recipeId });
  }

  async removeRecipeFromCollection(collectionId: string, recipeId: string): Promise<void> {
    return apiClient.delete<void>(`/collections/${collectionId}/recipes/${recipeId}`);
  }

  // User-specific collections
  async getUserCollections(userId: string, params: {
    page?: number;
    limit?: number;
  } = {}): Promise<{ collections: Collection[]; total: number }> {
    return this.listCollections({
      ...params,
      userId,
      isPublic: true
    });
  }

  async getMyCollections(params: {
    page?: number;
    limit?: number;
    isPublic?: boolean;
  } = {}): Promise<{ collections: Collection[]; total: number }> {
    return apiClient.get<{ collections: Collection[]; total: number }>('/collections/me', params);
  }
} 