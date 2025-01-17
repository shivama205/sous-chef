import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { generateMealPlan } from "@/utils/mealPlanGenerator";
import type { MealPlan } from "@/types/mealPlan";
import type { Preferences } from "@/types/preferences";
import { Save, RefreshCw } from "lucide-react";

export function NewMealPlan() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [planName, setPlanName] = useState("My Meal Plan");
  
  // Get the meal plan and preferences from location state
  const mealPlan = location.state?.mealPlan as MealPlan;
  const preferences = location.state?.preferences as Preferences;

  if (!mealPlan || !preferences) {
    navigate("/meal-plan");
    return null;
  }

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const { data: credits } = await supabase
        .from("user_credits")
        .select("credits")
        .single();

      if (!credits || credits.credits <= 0) {
        toast({
          title: "No Credits",
          description: "You need credits to generate meal plans.",
          variant: "destructive"
        });
        return;
      }

      const newMealPlan = await generateMealPlan(preferences);
      
      // Replace the current history entry instead of pushing a new one
      navigate("/meal-plan/new", { 
        state: { mealPlan: newMealPlan, preferences }, 
        replace: true 
      });
    } catch (error) {
      console.error("Error regenerating meal plan:", error);
      toast({
        title: "Error",
        description: "Failed to regenerate meal plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Not Logged In",
          description: "Please log in to save meal plans.",
          variant: "destructive"
        });
        return;
      }

      // Save the meal plan
      const { data: savedPlan, error: saveError } = await supabase
        .from("saved_meal_plans")
        .insert([
          {
            user_id: session.user.id,
            name: planName,
            plan: mealPlan
          }
        ])
        .select()
        .single();

      if (saveError) throw saveError;

      // Deduct credits
      const { data: credits } = await supabase
        .from("user_credits")
        .select("credits")
        .single();

      if (credits) {
        await supabase
          .from("user_credits")
          .update({ credits: credits.credits - 1 })
          .eq("user_id", session.user.id);
      }

      toast({
        title: "Success",
        description: "Your meal plan has been saved successfully!",
      });

      // Navigate to the saved meal plan
      navigate(`/meal-plan/${savedPlan.id}`);
    } catch (error) {
      console.error("Error saving meal plan:", error);
      toast({
        title: "Error",
        description: "Failed to save meal plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium text-foreground/90 mb-2">Generated Meal Plan</h1>
            <p className="text-lg text-muted-foreground">
              Review your meal plan and save it or generate a new one
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Enter meal plan name"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="max-w-xs"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </Button>
              <Button 
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Meal Plan Preview */}
        <div className="space-y-6">
          {mealPlan.days.map((day, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-primary/5">
                <CardTitle>Day {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {day.meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="p-4 rounded-lg bg-muted/50">
                      <h3 className="font-medium mb-2">{meal.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        <p>Calories: {meal.nutritionInfo.calories}</p>
                        <p>Protein: {meal.nutritionInfo.protein}g</p>
                        <p>Carbs: {meal.nutritionInfo.carbs}g</p>
                        <p>Fat: {meal.nutritionInfo.fat}g</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </BaseLayout>
  );
} 