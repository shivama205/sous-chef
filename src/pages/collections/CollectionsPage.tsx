import React from 'react';
import { useStore } from '../../store';
import { LoadingSpinner } from '../../components/ui/loading-spinner';
import { Link } from 'react-router-dom';

export default function CollectionsPage() {
  const { collections, totalCollections, isLoading, fetchCollections } = useStore(state => ({
    collections: state.collections,
    totalCollections: state.totalCollections,
    isLoading: state.isLoading,
    fetchCollections: state.fetchCollections
  }));

  React.useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Collections</h1>
        <Link
          to="/collections/new"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
        >
          Create Collection
        </Link>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No collections found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.id}`}
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{collection.name}</h2>
              {collection.description && (
                <p className="text-gray-600 mb-4">{collection.description}</p>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>{collection.recipes_count} recipes</span>
                <span>{collection.is_public ? 'Public' : 'Private'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalCollections > collections.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => fetchCollections({ page: Math.ceil(collections.length / 12) + 1 })}
            className="text-primary hover:text-primary-dark"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
} 