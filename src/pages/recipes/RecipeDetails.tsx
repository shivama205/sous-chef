import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Share2, Clock, Users, ChefHat } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import { PageHeader } from "@/components/ui/PageHeader";

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data, error } = await supabase
          .from("recipes")
          .select("*, profiles(*)")
          .eq("id", id)
          .single();

        if (error) throw error;
        setRecipe(data);

        // Check if user has liked this recipe
        if (user) {
          const { data: likeData } = await supabase
            .from("recipe_likes")
            .select("*")
            .eq("recipe_id", id)
            .eq("user_id", user.id)
            .single();

          setIsLiked(!!likeData);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from("recipe_likes")
          .delete()
          .eq("recipe_id", id)
          .eq("user_id", user.id);
      } else {
        await supabase.from("recipe_likes").insert({
          recipe_id: id,
          user_id: user.id,
        });
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          icon={ChefHat}
          title={recipe.meal_name}
          description={recipe.description || "A delicious recipe shared by our community"}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipe Image */}
            {recipe.images?.[0] && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={recipe.images[0]}
                  alt={recipe.meal_name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Recipe Info */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={recipe.profiles?.avatar_url} />
                    <AvatarFallback>
                      {recipe.profiles?.full_name?.[0] || "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{recipe.profiles?.full_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(recipe.created_at || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={isLiked ? "text-red-500" : ""}
                    onClick={handleLike}
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-accent rounded-lg">
                  <Clock className="w-5 h-5 mx-auto mb-2" />
                  <p className="text-sm font-medium">{recipe.cooking_time} mins</p>
                  <p className="text-xs text-muted-foreground">Cooking Time</p>
                </div>
                <div className="text-center p-4 bg-accent rounded-lg">
                  <Users className="w-5 h-5 mx-auto mb-2" />
                  <p className="text-sm font-medium">{recipe.servings} servings</p>
                  <p className="text-xs text-muted-foreground">Servings</p>
                </div>
                <div className="text-center p-4 bg-accent rounded-lg">
                  <ChefHat className="w-5 h-5 mx-auto mb-2" />
                  <p className="text-sm font-medium capitalize">{recipe.difficulty}</p>
                  <p className="text-xs text-muted-foreground">Difficulty</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {recipe.ingredients?.map((ingredient, index) => (
                      <li key={index} className="text-muted-foreground">
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Instructions</h3>
                  <ol className="list-decimal list-inside space-y-4">
                    {recipe.instructions?.map((step, index) => (
                      <li key={index} className="text-muted-foreground">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Nutritional Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Nutritional Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Calories</span>
                  <span className="font-medium">
                    {recipe.nutritional_value?.calories || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Protein</span>
                  <span className="font-medium">
                    {recipe.nutritional_value?.protein || "N/A"}g
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carbs</span>
                  <span className="font-medium">
                    {recipe.nutritional_value?.carbs || "N/A"}g
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fat</span>
                  <span className="font-medium">
                    {recipe.nutritional_value?.fat || "N/A"}g
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
} 