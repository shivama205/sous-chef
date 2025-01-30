import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Recipe } from "@/types/recipeFinder";
import { getUserRecipes } from "@/services/recipeFinder";
import { useStore } from "@/store";
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

interface SavedRecipesProps {
  userId?: string;
}

export function SavedRecipes({ userId }: SavedRecipesProps) {
  const { user } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "time">("date");

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setIsLoading(true);
        const targetUserId = userId || user?.id;
        if (!targetUserId) return;
        
        const savedRecipes = await getUserRecipes(targetUserId);
        setRecipes(savedRecipes);
      } catch (error) {
        console.error("Error loading recipes:", error);
        toast({
          title: "Error",
          description: "Failed to load recipes.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipes();
  }, [userId, user?.id, toast]);

  const filteredAndSortedRecipes = recipes
    .filter((recipe) =>
      recipe.meal_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.meal_name.localeCompare(b.meal_name);
        case "time":
          return (a.cooking_time || 0) - (b.cooking_time || 0);
        case "date":
        default:
          return (
            new Date(b.created_at || Date.now()).getTime() -
            new Date(a.created_at || Date.now()).getTime()
          );
      }
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: "date" | "name" | "time") => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="time">Sort by Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedRecipes.length === 0 ? (
        <Card className="p-8 text-center">
          <ChefHat className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Recipes Found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "No recipes match your search criteria."
              : "Start creating your culinary masterpieces!"}
          </p>
          <Button onClick={() => navigate("/create-recipe")}>Create Recipe</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => recipe.id && navigate(`/recipe/${recipe.id}`)}
            >
              <div className="w-full h-48 bg-muted flex items-center justify-center">
                <ChefHat className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{recipe.meal_name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Timer className="h-4 w-4 mr-1" />
                  <span>{recipe.cooking_time} mins</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 