import { apiClient } from './api';
import type { Profile, UserStats } from '../types';

export class ProfileService {
  private static instance: ProfileService;

  private constructor() {}

  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  // Profile operations
  async getProfile(userId: string): Promise<Profile> {
    return apiClient.get<Profile>(`/profiles/${userId}`);
  }

  async getMyProfile(): Promise<Profile> {
    return apiClient.get<Profile>('/profiles/me');
  }

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    return apiClient.put<Profile>('/profiles/me', data);
  }

  // Follow operations
  async toggleFollow(userId: string): Promise<void> {
    return apiClient.post<void>(`/profiles/${userId}/follow`);
  }

  async getFollowers(userId: string, params: {
    page?: number;
    limit?: number;
  } = {}): Promise<{ users: Profile[]; total: number }> {
    return apiClient.get<{ users: Profile[]; total: number }>(`/profiles/${userId}/followers`, params);
  }

  async getFollowing(userId: string, params: {
    page?: number;
    limit?: number;
  } = {}): Promise<{ users: Profile[]; total: number }> {
    return apiClient.get<{ users: Profile[]; total: number }>(`/profiles/${userId}/following`, params);
  }

  // Stats operations
  async getUserStats(userId: string): Promise<UserStats> {
    return apiClient.get<UserStats>(`/analytics/users/${userId}/stats`);
  }

  async getMyStats(): Promise<UserStats> {
    return apiClient.get<UserStats>('/analytics/users/me/stats');
  }
} 