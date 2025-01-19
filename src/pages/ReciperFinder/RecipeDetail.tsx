import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Recipe } from "@/types/recipeFinder";
import { ChefHat, Timer, UtensilsCrossed, ListChecks, Dumbbell, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { MealPlanLoadingOverlay } from "@/components/MealPlanLoadingOverlay";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id || !user) {
        navigate("/recipe-finder");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("saved_recipes")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!data) {
          toast({
            title: "Recipe not found",
            description: "The recipe you're looking for doesn't exist.",
            variant: "destructive",
          });
          navigate("/recipe-finder");
          return;
        }

        setRecipe({
          id: data.id,
          meal_name: data.meal_name,
          cooking_time: data.cooking_time,
          ingredients: data.ingredients,
          instructions: data.instructions,
          nutritional_value: data.nutritional_value,
          created_at: data.created_at,
        });
      } catch (error) {
        console.error("Error fetching recipe:", error);
        toast({
          title: "Error",
          description: "Failed to load recipe details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user, navigate, toast]);

  if (isLoading) {
    return <MealPlanLoadingOverlay isLoading={true} />;
  }

  if (!recipe) {
    return null;
  }

  return (
    <BaseLayout>
      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="flex items-center gap-2 -ml-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Recipe Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">{recipe.meal_name}</h1>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Timer className="w-4 h-4" />
            <span>Cooking Time: {recipe.cooking_time} minutes</span>
          </div>
          {recipe.created_at && (
            <p className="text-sm text-muted-foreground">
              Saved on {new Date(recipe.created_at).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric', 
                month: 'short',
                day: 'numeric'
              })}
            </p>
          )}
        </div>

        {/* Recipe Content */}
        <div className="space-y-6">
          {/* Ingredients Card */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <UtensilsCrossed className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Ingredients</h2>
            </div>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0 mt-2" />
                  <span className="text-gray-600">{ingredient}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Instructions Card */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <ListChecks className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Instructions</h2>
            </div>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="font-medium text-primary/60 flex-shrink-0">
                    {i + 1}.
                  </span>
                  <span className="text-gray-600">{instruction}</span>
                </li>
              ))}
            </ol>
          </Card>

          {/* Nutritional Info Card */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Nutritional Value</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-primary/5 rounded-lg p-3">
                <p className="text-sm text-gray-600">Calories</p>
                <p className="text-lg font-semibold text-primary">
                  {recipe.nutritional_value.calories}
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-3">
                <p className="text-sm text-gray-600">Protein</p>
                <p className="text-lg font-semibold text-primary">
                  {recipe.nutritional_value.protein}g
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-3">
                <p className="text-sm text-gray-600">Carbs</p>
                <p className="text-lg font-semibold text-primary">
                  {recipe.nutritional_value.carbs}g
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-3">
                <p className="text-sm text-gray-600">Fat</p>
                <p className="text-lg font-semibold text-primary">
                  {recipe.nutritional_value.fat}g
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
} 