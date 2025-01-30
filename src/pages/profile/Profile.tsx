import React from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../../store';
import { LoadingSpinner } from '../../components/ui/loading-spinner';

export default function Profile() {
  const { userId } = useParams();
  const { user, profile, isLoading, fetchProfile } = useStore(state => ({
    user: state.user,
    profile: state.profile,
    isLoading: state.isLoading,
    fetchProfile: state.fetchProfile
  }));

  React.useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    }
  }, [userId, fetchProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="relative h-48 bg-gradient-to-r from-primary to-primary/80">
          {profile.coverImage && (
            <img
              src={profile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center -mt-16 sm:-mt-20">
            <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-4xl">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-grow">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-gray-600">{profile.bio || 'No bio yet'}</p>
            </div>

            {isOwnProfile && (
              <button
                className="mt-4 sm:mt-0 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                onClick={() => {/* TODO: Implement edit profile */}}
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* User Stats */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{profile.stats?.recipes || 0}</p>
              <p className="text-gray-600">Recipes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{profile.stats?.followers || 0}</p>
              <p className="text-gray-600">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{profile.stats?.following || 0}</p>
              <p className="text-gray-600">Following</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{profile.stats?.likes || 0}</p>
              <p className="text-gray-600">Likes</p>
            </div>
          </div>
        </div>
      </div>

      {/* User's Recipes */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recipes</h2>
        {profile.recipes && profile.recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.recipes.map((recipe: any) => (
              <div
                key={recipe.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={recipe.image || '/placeholder-recipe.jpg'}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{recipe.description}</p>
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>{recipe.likes} likes</span>
                    <span>{recipe.comments} comments</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recipes yet</p>
        )}
      </div>
    </div>
  );
} 