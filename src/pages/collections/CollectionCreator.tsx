import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../store';
import { LoadingSpinner } from '../../components/ui/loading-spinner';

export default function CollectionCreator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCollection, isLoading, fetchCollectionById } = useStore(state => ({
    selectedCollection: state.selectedCollection,
    isLoading: state.isLoading,
    fetchCollectionById: state.fetchCollectionById
  }));

  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    is_public: true
  });

  React.useEffect(() => {
    if (id) {
      fetchCollectionById(id);
    }
  }, [id, fetchCollectionById]);

  React.useEffect(() => {
    if (selectedCollection && id) {
      setFormData({
        name: selectedCollection.name,
        description: selectedCollection.description || '',
        is_public: selectedCollection.is_public
      });
    }
  }, [selectedCollection, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add collection creation/update logic here
    navigate('/collections');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          {id ? 'Edit Collection' : 'Create Collection'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                Make this collection public
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/collections')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
              >
                {id ? 'Save Changes' : 'Create Collection'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 