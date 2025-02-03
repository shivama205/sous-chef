import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Recipe } from "@/types/recipeFinder";
import { 
  ChefHat, 
  Timer, 
  UtensilsCrossed, 
  ListChecks, 
  Dumbbell,
  Share2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { MealPlanLoadingOverlay } from "@/components/MealPlanLoadingOverlay";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SharedRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSharedRecipe = async () => {
      console.log("Fetching shared recipe with ID:", id);
      if (!id) {
        console.error("No share ID provided");
        toast({
          title: "Error",
          description: "Invalid recipe link.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      try {
        // First get the shared recipe data
        const { data: sharedData, error: sharedError } = await supabase
          .from("shared_recipes")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        console.log("Shared data:", sharedData);

        if (sharedError) {
          console.error("Supabase error:", sharedError);
          throw sharedError;
        }

        if (!sharedData) {
          console.error("No shared recipe found for ID:", id);
          toast({
            title: "Recipe not found",
            description: "This shared recipe link is invalid or has expired.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        // Check if the recipe has expired
        if (sharedData.expires_at && new Date(sharedData.expires_at) < new Date()) {
          toast({
            title: "Link expired",
            description: "This shared recipe link has expired.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        // Check if the recipe is public
        if (!sharedData.is_public) {
          toast({
            title: "Private recipe",
            description: "This recipe is not publicly accessible.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        // Then fetch the actual recipe using recipe_id
        const { data: recipeData, error: recipeError } = await supabase
          .from("saved_recipes")
          .select("*")
          .eq("id", sharedData.recipe_id)
          .maybeSingle();

        if (recipeError) {
          console.error("Error fetching recipe:", recipeError);
          throw recipeError;
        }

        if (!recipeData) {
          console.error("Recipe not found:", sharedData.recipe_id);
          toast({
            title: "Recipe not found",
            description: "The shared recipe no longer exists.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        setRecipe({
          id: recipeData.id,
          meal_name: recipeData.meal_name,
          cooking_time: recipeData.cooking_time,
          ingredients: recipeData.ingredients,
          instructions: recipeData.instructions,
          nutritional_value: recipeData.nutritional_value,
          created_at: recipeData.created_at,
        });

        // Increment the view count in the background
        // Don't wait for it or handle errors since it's not critical
        supabase
          .from("shared_recipes")
          .update({ views: (sharedData.views || 0) + 1 })
          .eq("id", sharedData.id)
          .then(() => {
            console.log("View count updated");
          })

      } catch (error) {
        console.error("Error fetching shared recipe:", error);
        toast({
          title: "Error",
          description: "Failed to load shared recipe.",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedRecipe();
  }, [id, toast, navigate]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe?.meal_name || "Shared Recipe",
          text: "Check out this delicious recipe I found on SousChef!",
          url: shareUrl,
        });
      } catch (error) {
        // Fallback to copying to clipboard
        await copyToClipboard(shareUrl);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      await copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Link copied!",
        description: "Share the link with your friends and family.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy link",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <MealPlanLoadingOverlay isLoading={true} />;
  }

  if (!recipe) {
    return null;
  }

  return (
    <BaseLayout>
      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">{recipe.meal_name}</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>

        {/* Recipe Content */}
        <div className="space-y-6 bg-white p-6 rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Timer className="w-4 h-4" />
            <span>Cooking Time: {recipe.cooking_time} minutes</span>
          </div>

          {/* Recipe Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ingredients Card */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Ingredients</h2>
              </div>
              <ScrollArea className="h-[400px] pr-4">
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0 mt-2" />
                      <span className="text-gray-600">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </Card>

            {/* Instructions Card */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <ListChecks className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Instructions</h2>
              </div>
              <ScrollArea className="h-[400px] pr-4">
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="font-medium text-primary/60 flex-shrink-0 min-w-[1.5rem]">
                        {i + 1}.
                      </span>
                      <span className="text-gray-600 whitespace-pre-wrap">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </ScrollArea>
            </Card>
          </div>

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