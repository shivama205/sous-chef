import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Utensils, Search, Calendar, Timer, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MealPlan } from "@/types/mealPlan";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SavedMealPlan {
  id: string;
  name: string;
  plan: MealPlan;
  created_at: string;
}

export function SavedMealPlans() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mealPlans, setMealPlans] = useState<SavedMealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "days">("date");

  useEffect(() => {
    const loadMealPlans = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("saved_meal_plans")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setMealPlans(data || []);
      } catch (error) {
        console.error("Error loading meal plans:", error);
        toast({
          title: "Error",
          description: "Failed to load your saved meal plans.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMealPlans();
  }, [user, toast]);

  const filteredAndSortedMealPlans = mealPlans
    .filter((mealPlan) =>
      mealPlan.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "days":
          return b.plan.days.length - a.plan.days.length;
        case "date":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const handleMealPlanClick = (mealPlan: SavedMealPlan) => {
    navigate(`/meal-plan/${mealPlan.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search meal plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: "date" | "name" | "days") => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="days">Sort by Days</SelectItem>
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
      ) : filteredAndSortedMealPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedMealPlans.map((mealPlan) => (
            <Card
              key={mealPlan.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleMealPlanClick(mealPlan)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Utensils className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-medium line-clamp-1">{mealPlan.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{mealPlan.plan.days.length} days</span>
                  </div>
                  {mealPlan.created_at && (
                    <p className="text-xs text-muted-foreground">
                      Created on {new Date(mealPlan.created_at).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {mealPlan.plan.days[0].meals.slice(0, 2).map((meal, i) => (
                      <span
                        key={i}
                        className="text-xs bg-primary/5 text-primary px-2 py-1 rounded-full"
                      >
                        {meal.name}
                      </span>
                    ))}
                    {mealPlan.plan.days[0].meals.length > 2 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{mealPlan.plan.days[0].meals.length - 2} more meals
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
          <Utensils className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Meal Plans Found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? "No meal plans match your search. Try different keywords."
              : "You haven't saved any meal plans yet."}
          </p>
          <Button onClick={() => navigate("/meal-plan")}>
            Create New Meal Plan
          </Button>
        </Card>
      )}
    </div>
  );
} 