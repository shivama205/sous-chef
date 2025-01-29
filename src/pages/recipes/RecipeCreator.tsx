import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Image as ImageIcon, Plus } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import { PageHeader } from "@/components/ui/PageHeader";

export default function RecipeCreator() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    meal_name: "",
    description: "",
    ingredients: [],
    instructions: [],
    cooking_time: 0,
    servings: 2,
    difficulty: "medium",
    cuisine: "",
    is_public: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("recipes")
        .insert([{ ...recipe, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      navigate(`/recipe/${data.id}`);
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          icon={ChefHat}
          title="Create Recipe"
          description="Share your culinary creations with the community"
        />

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-8 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Start with the basic details of your recipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Recipe Name"
                  value={recipe.meal_name}
                  onChange={(e) =>
                    setRecipe((prev) => ({ ...prev, meal_name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Description"
                  value={recipe.description}
                  onChange={(e) =>
                    setRecipe((prev) => ({ ...prev, description: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Cooking Time (minutes)"
                  value={recipe.cooking_time || ""}
                  onChange={(e) =>
                    setRecipe((prev) => ({
                      ...prev,
                      cooking_time: parseInt(e.target.value),
                    }))
                  }
                  required
                />
                <Input
                  type="number"
                  placeholder="Servings"
                  value={recipe.servings || ""}
                  onChange={(e) =>
                    setRecipe((prev) => ({
                      ...prev,
                      servings: parseInt(e.target.value),
                    }))
                  }
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
              <CardDescription>
                List all ingredients needed for your recipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter ingredients (one per line)"
                value={recipe.ingredients?.join("\n")}
                onChange={(e) =>
                  setRecipe((prev) => ({
                    ...prev,
                    ingredients: e.target.value.split("\n").filter(Boolean),
                  }))
                }
                className="min-h-[200px]"
                required
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
              <CardDescription>
                Write step-by-step instructions for your recipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter instructions (one step per line)"
                value={recipe.instructions?.join("\n")}
                onChange={(e) =>
                  setRecipe((prev) => ({
                    ...prev,
                    instructions: e.target.value.split("\n").filter(Boolean),
                  }))
                }
                className="min-h-[200px]"
                required
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>
                Add more details to help others discover your recipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Cuisine (e.g., Italian, Japanese)"
                value={recipe.cuisine}
                onChange={(e) =>
                  setRecipe((prev) => ({ ...prev, cuisine: e.target.value }))
                }
              />
              <select
                value={recipe.difficulty}
                onChange={(e) =>
                  setRecipe((prev) => ({
                    ...prev,
                    difficulty: e.target.value as Recipe["difficulty"],
                  }))
                }
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Create Recipe
            </Button>
          </div>
        </form>
      </div>
    </BaseLayout>
  );
} 