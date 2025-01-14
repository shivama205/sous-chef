import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PreferencesForm } from "@/components/PreferencesForm";
import { MealPlan as MealPlanType } from "@/types/mealPlan";
import { supabase } from "@/lib/supabase";
import NavigationBar from "@/components/NavigationBar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Preferences } from "@/types/preferences";
import { generateMealPlan } from "@/utils/mealPlanGenerator";
import GoogleSignInButton from "@/components/GoogleSignInButton";

const MealPlan = () => {
  const [open, setOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlanType | null>(null);
  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleSaveMealPlan = async () => {
    if (!mealPlan) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoginDialogOpen(true);
      return;
    }


    console.log("Saving meal plan:", user.id, name, mealPlan);
    const { data, error } = await supabase
      .from("saved_meal_plans")
      .insert([{ user_id: user.id, name: name, plan: mealPlan }]);

    if (error) {
      toast({
        title: "Error saving meal plan",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Meal plan saved!",
        description: "Your meal plan has been saved successfully.",
      });
      setOpen(false);
      setName("");
    }
  };

  const handleSubmit = async (preferences: Preferences) => {
    const mealPlan = await generateMealPlan(preferences);
    setMealPlan(mealPlan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Meal Plan</h1>
        <PreferencesForm onSubmit={handleSubmit} />

        {mealPlan && (
          <div className="mt-4">
            <h2 className="text-2xl font-bold mb-2">Generated Meal Plan</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="py-2 px-4">Day</th>
                    <th className="py-2 px-4">Meal</th>
                    <th className="py-2 px-4">Protein (g)</th>
                    <th className="py-2 px-4">Fat (g)</th>
                    <th className="py-2 px-4">Carbs (g)</th>
                    <th className="py-2 px-4">Fiber (g)</th>
                    <th className="py-2 px-4">Sugar (g)</th>
                    <th className="py-2 px-4">Calories</th>
                  </tr>
                </thead>
                <tbody>
                  {mealPlan.days.map((day, dayIndex) => {
                    const totalNutrients = day.meals.reduce(
                      (totals, meal) => {
                        totals.protein += meal.nutritionInfo.protein;
                        totals.fat += meal.nutritionInfo.fat;
                        totals.carbs += meal.nutritionInfo.carbs;
                        totals.fiber += meal.nutritionInfo.fiber;
                        totals.sugar += meal.nutritionInfo.sugar;
                        totals.calories += meal.nutritionInfo.calories;
                        return totals;
                      },
                      { protein: 0, fat: 0, carbs: 0, fiber: 0, sugar: 0, calories: 0 }
                    );

                    return (
                      <>
                        {day.meals.map((meal, mealIndex) => (
                          <tr key={`${dayIndex}-${mealIndex}`} className="border-b">
                            {mealIndex === 0 && (
                              <td className="border px-4 py-2" rowSpan={day.meals.length}>
                                {day.day}
                              </td>
                            )}
                            <td className="border px-4 py-2">{meal.name}</td>
                            <td className="border px-4 py-2">{meal.nutritionInfo.protein}</td>
                            <td className="border px-4 py-2">{meal.nutritionInfo.fat}</td>
                            <td className="border px-4 py-2">{meal.nutritionInfo.carbs}</td>
                            <td className="border px-4 py-2">{meal.nutritionInfo.fiber}</td>
                            <td className="border px-4 py-2">{meal.nutritionInfo.sugar}</td>
                            <td className="border px-4 py-2">{meal.nutritionInfo.calories}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-100 font-bold">
                          <td className="border px-4 py-2" colSpan={2}>Total</td>
                          <td className="border px-4 py-2">{totalNutrients.protein}</td>
                          <td className="border px-4 py-2">{totalNutrients.fat}</td>
                          <td className="border px-4 py-2">{totalNutrients.carbs}</td>
                          <td className="border px-4 py-2">{totalNutrients.fiber}</td>
                          <td className="border px-4 py-2">{totalNutrients.sugar}</td>
                          <td className="border px-4 py-2">{totalNutrients.calories}</td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {mealPlan && (
          <Button
            onClick={() => setOpen(true)}
            className="mt-4"
          >
            Save Meal Plan
          </Button>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Meal Plan</DialogTitle>
              <DialogDescription>
                Enter a name for your meal plan.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <Label htmlFor="meal-plan-name">Meal Plan Name</Label>
              <Input
                id="meal-plan-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter meal plan name"
              />
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveMealPlan}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login Required</DialogTitle>
              <DialogDescription>
                You need to log in to save your meal plan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setLoginDialogOpen(false)}>
                Cancel
              </Button>
              <GoogleSignInButton />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default MealPlan;
