import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Recipe } from '@/types/recipeFinder';
import { BaseLayout } from '@/components/layouts/BaseLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChefHat, Clock, Utensils, Heart } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { dataLayer } from '@/services/dataLayer';
import { saveRecipe } from '@/services/recipeFinder';
import { Card } from '@/components/ui/card';

// NutritionalValue Component
interface NutritionalValueProps {
  value: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

function NutritionalValue({ value }: NutritionalValueProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Nutritional Value</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-primary/5 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Calories</div>
          <div className="text-lg font-semibold">{value.calories || 0}</div>
        </div>
        <div className="bg-primary/5 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Protein</div>
          <div className="text-lg font-semibold">{value.protein || 0}g</div>
        </div>
        <div className="bg-primary/5 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Carbs</div>
          <div className="text-lg font-semibold">{value.carbs || 0}g</div>
        </div>
        <div className="bg-primary/5 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Fat</div>
          <div className="text-lg font-semibold">{value.fat || 0}g</div>
        </div>
      </div>
    </div>
  );
}

// RecipeInstructions Component
interface RecipeInstructionsProps {
  ingredients: string[];
  instructions: string[];
}

function RecipeInstructions({ ingredients, instructions }: RecipeInstructionsProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Ingredients */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Ingredients</h3>
        <ul className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>{ingredient}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Instructions</h3>
        <ol className="space-y-4">
          {instructions.map((instruction, index) => (
            <li key={index} className="flex gap-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <span className="flex-1">{instruction}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function RecipeDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Store current path in local storage when component mounts
  useEffect(() => {
    const currentPath = location.pathname;
    const previousPath = localStorage.getItem('previousPath');
    
    if (previousPath !== currentPath) {
      localStorage.setItem('previousPath', previousPath || '/');
      localStorage.setItem('currentPath', currentPath);
    }
  }, [location.pathname]);

  // Get recipe from location state or fetch it
  useEffect(() => {
    const initializeRecipe = async () => {
      try {
        if (location.state?.recipe) {
          setRecipe(location.state.recipe);
          
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
          // TODO: Implement fetching recipe by ID
          toast({
            title: "Error",
            description: "Recipe not found",
            variant: "destructive",
          });
          handleBack();
        } else {
          // No recipe data available
          handleBack();
        }
      } catch (error) {
        console.error('Error initializing recipe:', error);
        toast({
          title: "Error",
          description: "Failed to load recipe",
          variant: "destructive",
        });
        handleBack();
      } finally {
        setIsLoading(false);
      }
    };

    initializeRecipe();
  }, [id, location.state, user, navigate, toast]);

  const handleSaveRecipe = async () => {
    if (!user || !recipe) return;

    setIsSaving(true);
    try {
      await saveRecipe(user.id, recipe);
      toast({
        title: "Success",
        description: "Recipe saved successfully",
      });
      
      // Track recipe save
      dataLayer.trackRecipeSave({
        recipe_id: recipe.id,
        recipe_name: recipe.name,
        recipe_category: recipe.cuisineType,
        cooking_time: recipe.cookingTime,
        user_id: user.id
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save recipe';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    const previousPath = localStorage.getItem('previousPath') || '/';
    navigate(previousPath);
  };

  

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
        {/* Navigation and Actions */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {user && (
            <Button
              onClick={handleSaveRecipe}
              disabled={isSaving}
              variant="outline"
            >
              <Heart className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Recipe'}
            </Button>
          )}
        </div>

        {/* Recipe Content */}
        <Card className="p-6 space-y-8">
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

          {/* Nutritional Value */}
          {recipe.nutritionalValue && (
            <NutritionalValue value={recipe.nutritionalValue} />
          )}

          {/* Ingredients and Instructions */}
          <RecipeInstructions 
            ingredients={recipe.ingredients}
            instructions={recipe.instructions || []}
          />
        </Card>
      </div>
    </BaseLayout>
  );
} 