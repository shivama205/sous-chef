import React from 'react';
import { useStore } from '../../store';
import { LoadingSpinner } from '../../components/ui/loading-spinner';

export default function AchievementsPage() {
  const { user, userStats, isLoading } = useStore(state => ({
    user: state.user,
    userStats: state.userStats,
    isLoading: state.isLoading
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please log in to view your achievements</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Achievements</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Total Recipes</h3>
            <p className="text-2xl font-bold text-primary">{userStats?.total_recipes || 0}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Total Likes</h3>
            <p className="text-2xl font-bold text-primary">{userStats?.total_likes_received || 0}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Average Rating</h3>
            <p className="text-2xl font-bold text-primary">{userStats?.average_rating.toFixed(1) || '0.0'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Total Views</h3>
            <p className="text-2xl font-bold text-primary">{userStats?.total_views || 0}</p>
          </div>
        </div>

        {/* Achievements List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Your Badges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Recipe Creator Badge */}
            <div className={`p-4 rounded-lg ${userStats?.total_recipes >= 1 ? 'bg-primary/10' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  📝
                </div>
                <div>
                  <h3 className="font-semibold">Recipe Creator</h3>
                  <p className="text-sm text-gray-600">Create your first recipe</p>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: `${Math.min((userStats?.total_recipes || 0) * 100 / 1, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Chef Badge */}
            <div className={`p-4 rounded-lg ${userStats?.total_likes_received >= 10 ? 'bg-primary/10' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  👨‍🍳
                </div>
                <div>
                  <h3 className="font-semibold">Popular Chef</h3>
                  <p className="text-sm text-gray-600">Get 10 likes on your recipes</p>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: `${Math.min((userStats?.total_likes_received || 0) * 100 / 10, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Rated Badge */}
            <div className={`p-4 rounded-lg ${userStats?.average_rating >= 4.5 ? 'bg-primary/10' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  ⭐
                </div>
                <div>
                  <h3 className="font-semibold">Top Rated</h3>
                  <p className="text-sm text-gray-600">Maintain a 4.5+ rating</p>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: `${Math.min((userStats?.average_rating || 0) * 100 / 5, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 