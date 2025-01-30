import React, { useCallback } from 'react';
import { useStore } from '@/store';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Link } from 'react-router-dom';
import type { Recipe, UserRecipeStats } from '@/types';

export default function DashboardView() {
  const { user, isLoading, userStats, recipes } = useStore(
    (state) => ({
      user: state.user,
      isLoading: state.isLoading,
      userStats: state.userStats as UserRecipeStats,
      recipes: state.recipes as Recipe[],
    })
  );

  const { fetchProfile, fetchUserStats, fetchRecipes } = useStore(
    useCallback(
      (state) => ({
        fetchProfile: state.fetchProfile,
        fetchUserStats: state.fetchUserStats,
        fetchRecipes: state.fetchRecipes,
      }),
      []
    )
  );

  React.useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!user?.id || !mounted) return;

      try {
        await Promise.all([
          fetchProfile(),
          fetchUserStats(),
          fetchRecipes()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [user?.id]); // Removed function dependencies since they're now stable

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Please sign in to view your dashboard</h1>
        <Link to="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user.full_name}</h1>
      
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Recipes</h3>
          <p className="text-3xl font-bold">{userStats?.total_recipes || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Likes</h3>
          <p className="text-3xl font-bold">{userStats?.total_likes_received || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Views</h3>
          <p className="text-3xl font-bold">{userStats?.total_views || 0}</p>
        </div>
      </div>

      {/* Recent Recipes */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Recent Recipes</h2>
          <Link to="/recipes" className="text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes?.map((recipe: Recipe) => (
            <Link key={recipe.id} to={`/recipe/${recipe.id}`}>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
                <p className="text-gray-600 line-clamp-2">{recipe.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 