import { useState, useEffect, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Utensils, Search, Calendar, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MealPlan } from "@/types/mealPlan";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import React from "react";
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
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number, searchQuery: string, sortBy?: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  currentPage?: number;
  searchQuery?: string;
}

const ITEMS_PER_PAGE = 9;

function SavedMealPlansComponent({ 
  initialMealPlans, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  onRefresh,
  isLoading,
  error,
  currentPage: propCurrentPage = 1,
}: SavedMealPlansProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(propCurrentPage);
  const [sortBy, setSortBy] = useState<"date" | "name" | "meals">("date");

  // Update local state when props change
  useEffect(() => {
    setCurrentPage(propCurrentPage);
  }, [propCurrentPage]);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Sort meal plans based on selected criteria
  const sortedMealPlans = useMemo(() => {
    if (!initialMealPlans) return [];
    
    return [...initialMealPlans].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || '').localeCompare(b.name || '');
        case "meals":
          const aMeals = a.plan.days.reduce((total, day) => total + day.meals.length, 0);
          const bMeals = b.plan.days.reduce((total, day) => total + day.meals.length, 0);
          return bMeals - aMeals;
        case "date":
        default:
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
    });
  }, [initialMealPlans, sortBy]);

  const handleMealPlanClick = useCallback((mealPlan: SavedMealPlan) => {
    if (mealPlan.id) {
      navigate(`/meal-plan/${mealPlan.id}`);
    }
  }, [navigate]);

  const handleDelete = useCallback(async (e: React.MouseEvent, mealPlanId: string) => {
    e.stopPropagation();
    
    try {
      const { error: deleteError } = await supabase
        .from("saved_meal_plans")
        .delete()
        .eq('id', mealPlanId);

      if (deleteError) throw deleteError;

      // Refresh current page data
      onPageChange(currentPage, '', sortBy);
      
      toast({
        title: "Meal Plan deleted",
        description: "Meal Plan has been removed from your collection.",
      });
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete meal plan. Please try again.",
        variant: "destructive",
      });
    }
  }, [onPageChange, currentPage, toast, sortBy]);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage < 1 || newPage > totalPages || isLoading) return;
    onPageChange(newPage, '', sortBy);
  }, [onPageChange, totalPages, isLoading, sortBy]);

  // Error state
  if (error) {
    return (
      <Card className="p-6 text-center bg-white border">
        <Calendar className="w-12 h-12 mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error Loading Meal Plans</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button 
          onClick={onRefresh}
          className="bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          Try Again
        </Button>
      </Card>
    );
  }

  // Empty state
  if (!isLoading && (!initialMealPlans || initialMealPlans.length === 0)) {
    return (
      <Card className="p-6 text-center bg-white border">
        <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Meal Plans Found</h3>
        <p className="text-muted-foreground mb-4">
          You haven't saved any meal plans yet.
        </p>
        <Button 
          onClick={() => navigate("/meal-plan")}
          className="bg-primary hover:bg-primary/90"
        >
          Create New Meal Plan
        </Button>
      </Card>
    );
  }

  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Main content
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-700">Your Meal Plans</h2>
        </div>
        <Select 
          value={sortBy} 
          onValueChange={(value: "date" | "name" | "meals") => {
            setSortBy(value);
            setCurrentPage(1);
            onPageChange(1, '', value);
          }}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[180px] bg-white border-input hover:bg-gray-50/50">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="meals">Sort by Meals</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedMealPlans.map((mealPlan) => (
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
                  disabled={isLoading}
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
            {totalItems > 0 ? (
              <>Showing {startItem} to {endItem} of {totalItems} meal plans</>
            ) : (
              'No meal plans found'
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            {totalPages > 2 && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className="gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrap the component with React.memo
export const SavedMealPlans = React.memo(SavedMealPlansComponent); 