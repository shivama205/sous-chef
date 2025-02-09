import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Recipe } from '@/types/recipeFinder';
import { BaseLayout } from '@/components/layouts/BaseLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChefHat, Clock, Utensils } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { dataLayer } from '@/services/dataLayer';

export default function RecipeDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get recipe from location state or fetch it
  useEffect(() => {
    if (location.state?.recipe) {
      setRecipe(location.state.recipe);
      setIsLoading(false);
      
      // Track recipe view
      if (user) {
        dataLayer.trackRecipeView({
          recipe_id: location.state.recipe.id,
          recipe_name: location.state.recipe.name,
          recipe_category: location.state.recipe.cuisineType,
          cooking_time: location.state.recipe.cookingTime,
          user_id: user.id
        });
      }
    } else if (id) {
      // Fetch recipe by ID
      // ... implementation of fetching recipe by ID
    }
  }, [id, location.state, user]);

  const handleBack = () => {
    // If we have history, go back
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      // Otherwise, go to a safe default page
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <BaseLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Loading skeleton */}
          </div>
        </div>
      </BaseLayout>
    );
  }

  if (!recipe) {
    return (
      <BaseLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Recipe Not Found</h1>
          <Button onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Recipe Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{recipe.name}</h1>
            {recipe.description && (
              <p className="text-muted-foreground">{recipe.description}</p>
            )}
          </div>

          {/* Recipe Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>{recipe.cookingTime} mins</span>
            </div>
            {recipe.difficulty && (
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-primary" />
                <span className="capitalize">{recipe.difficulty}</span>
              </div>
            )}
            {recipe.cuisineType && (
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-primary" />
                <span>{recipe.cuisineType}</span>
              </div>
            )}
          </div>

          {/* Rest of the recipe details */}
          {/* ... */}
        </div>
      </div>
    </BaseLayout>
  );
} 