import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Recipe } from "@/types/recipeFinder";
import { useNavigate } from "react-router-dom";
import { ChefHat, Timer, Search, Clock, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SavedRecipesProps {
  initialRecipes: Recipe[];
}

export function SavedRecipes({ initialRecipes }: SavedRecipesProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState(initialRecipes);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "time">("date");

  const filteredAndSortedRecipes = recipes
    .filter((recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "time":
          return a.cookingTime - b.cookingTime;
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

  const handleDelete = async (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation(); // Prevent card click when clicking delete
    
    try {
      const { error } = await supabase
        .from("saved_recipes")
        .delete()
        .eq('id', recipeId);

      if (error) throw error;

      // Update local state
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      
      toast({
        title: "Recipe deleted",
        description: "Recipe has been removed from your collection.",
      });
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast({
        title: "Error",
        description: "Failed to delete recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white border-input hover:bg-gray-50/50"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: "date" | "name" | "time") => setSortBy(value)}>
          <SelectTrigger className="w-[180px] bg-white border-input hover:bg-gray-50/50">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="time">Sort by Cooking Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="group hover:shadow-md transition-all duration-300 overflow-hidden bg-white border cursor-pointer"
              onClick={() => handleRecipeClick(recipe)}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
                      {recipe.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{recipe.cookingTime}m</span>
                      </div>
                      <span>•</span>
                      <span>{recipe.nutritionalValue?.calories || 0} cal</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 -mr-2 -mt-2"
                    onClick={(e) => recipe.id && handleDelete(e, recipe.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  Saved on {new Date(recipe.created_at || '').toLocaleDateString('en-US', {
                    year: 'numeric', 
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center bg-white border">
          <ChefHat className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Recipes Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "No recipes match your search. Try different keywords."
              : "You haven't saved any recipes yet."}
          </p>
          <Button 
            onClick={() => navigate("/recipe-finder")}
            className="bg-primary hover:bg-primary/90"
          >
            Find New Recipes
          </Button>
        </Card>
      )}
    </div>
  );
} 