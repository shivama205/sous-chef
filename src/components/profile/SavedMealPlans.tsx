import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Utensils, Search, Calendar, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MealPlan } from "@/types/mealPlan";
import { useToast } from "@/components/ui/use-toast";
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

interface SavedMealPlansProps {
  initialMealPlans: SavedMealPlan[];
}

const ITEMS_PER_PAGE = 6;

export function SavedMealPlans({ initialMealPlans }: SavedMealPlansProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mealPlans, setMealPlans] = useState(initialMealPlans);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "days">("date");
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(filteredAndSortedMealPlans.length / ITEMS_PER_PAGE);
  const paginatedMealPlans = filteredAndSortedMealPlans.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleMealPlanClick = (mealPlan: SavedMealPlan) => {
    navigate(`/meal-plan/${mealPlan.id}`);
  };

  const handleDelete = async (e: React.MouseEvent, mealPlanId: string) => {
    e.stopPropagation();
    
    try {
      const { error } = await supabase
        .from("saved_meal_plans")
        .delete()
        .eq('id', mealPlanId);

      if (error) throw error;

      // Update local state
      setMealPlans(mealPlans.filter(plan => plan.id !== mealPlanId));
      
      // Adjust current page if necessary
      const newTotalPages = Math.ceil((filteredAndSortedMealPlans.length - 1) / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }

      toast({
        title: "Meal plan deleted",
        description: "Meal plan has been removed from your collection.",
      });
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete meal plan. Please try again.",
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
            placeholder="Search meal plans..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-9 bg-white border-input hover:bg-gray-50/50"
          />
        </div>
        <Select 
          value={sortBy} 
          onValueChange={(value: "date" | "name" | "days") => {
            setSortBy(value);
            setCurrentPage(1); // Reset to first page on sort change
          }}
        >
          <SelectTrigger className="w-[180px] bg-white border-input hover:bg-gray-50/50">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="days">Sort by Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {paginatedMealPlans.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedMealPlans.map((mealPlan) => (
              <Card
                key={mealPlan.id}
                className="group hover:shadow-md transition-all duration-300 overflow-hidden bg-white border cursor-pointer"
                onClick={() => handleMealPlanClick(mealPlan)}
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
                        {mealPlan.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{mealPlan.plan.days.length} days</span>
                        </div>
                        <span>•</span>
                        <span>
                          {mealPlan.plan.days.reduce((total, day) => total + day.meals.length, 0)} meals
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 -mr-2 -mt-2"
                      onClick={(e) => handleDelete(e, mealPlan.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Created on {new Date(mealPlan.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', 
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedMealPlans.length)} of {filteredAndSortedMealPlans.length} meal plans
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <Card className="p-6 text-center bg-white border">
          <Utensils className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Meal Plans Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "No meal plans match your search. Try different keywords."
              : "You haven't saved any meal plans yet."}
          </p>
          <Button 
            onClick={() => navigate("/meal-plan")}
            className="bg-primary hover:bg-primary/90"
          >
            Create New Meal Plan
          </Button>
        </Card>
      )}
    </div>
  );
} 