import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../store';
import { LoadingSpinner } from '../../components/ui/loading-spinner';

export default function CollectionDetails() {
  const { id } = useParams();
  const { selectedCollection, isLoading, fetchCollectionById } = useStore(state => ({
    selectedCollection: state.selectedCollection,
    isLoading: state.isLoading,
    fetchCollectionById: state.fetchCollectionById
  }));

  React.useEffect(() => {
    if (id) {
      fetchCollectionById(id);
    }
  }, [id, fetchCollectionById]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!selectedCollection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Collection not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">{selectedCollection.name}</h1>
            {selectedCollection.description && (
              <p className="text-gray-600 mt-2">{selectedCollection.description}</p>
            )}
          </div>
          <Link
            to={`/collections/${id}/edit`}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
          >
            Edit Collection
          </Link>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recipes</h2>
          {selectedCollection.recipes?.length === 0 ? (
            <p className="text-gray-500">No recipes in this collection</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCollection.recipes?.map(({ recipe, added_at }) => (
                <Link
                  key={recipe.id}
                  to={`/recipe/${recipe.id}`}
                  className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {recipe.image_url && (
                    <img
                      src={recipe.image_url}
                      alt={recipe.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h3 className="font-semibold mb-2">{recipe.title}</h3>
                  <div className="text-sm text-gray-500">
                    Added {new Date(added_at).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 