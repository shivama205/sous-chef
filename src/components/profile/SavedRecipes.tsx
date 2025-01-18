import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Recipe } from "@/types/recipeFinder";
import { getUserRecipes } from "@/services/recipeFinder";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ChefHat, Timer, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SavedRecipes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "time">("date");

  useEffect(() => {
    const loadRecipes = async () => {
      if (!user) return;
      try {
        const savedRecipes = await getUserRecipes(user.id);
        setRecipes(savedRecipes);
      } catch (error) {
        console.error("Error loading recipes:", error);
        toast({
          title: "Error",
          description: "Failed to load your saved recipes.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipes();
  }, [user, toast]);

  const filteredAndSortedRecipes = recipes
    .filter((recipe) =>
      recipe.meal_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.meal_name.localeCompare(b.meal_name);
        case "time":
          return a.cooking_time - b.cooking_time;
        case "date":
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

  const handleRecipeClick = (recipe: Recipe) => {
    if (recipe.id) {
      navigate(`/recipe/${recipe.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: "date" | "name" | "time") => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="time">Sort by Cooking Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 space-y-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </Card>
          ))}
        </div>
      ) : filteredAndSortedRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleRecipeClick(recipe)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ChefHat className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-medium line-clamp-1">{recipe.meal_name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Timer className="w-4 h-4" />
                    <span>{recipe.cooking_time} mins</span>
                  </div>
                  {recipe.created_at && (
                    <p className="text-xs text-muted-foreground">
                      Saved on {new Date(recipe.created_at).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {recipe.ingredients.slice(0, 3).map((ingredient, i) => (
                      <span
                        key={i}
                        className="text-xs bg-primary/5 text-primary px-2 py-1 rounded-full"
                      >
                        {ingredient}
                      </span>
                    ))}
                    {recipe.ingredients.length > 3 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{recipe.ingredients.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <ChefHat className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Recipes Found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? "No recipes match your search. Try different keywords."
              : "You haven't saved any recipes yet."}
          </p>
          <Button onClick={() => navigate("/recipe-finder")}>
            Find New Recipes
          </Button>
        </Card>
      )}
    </div>
  );
} 