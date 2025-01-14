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

const MealPlan = () => {
  const [open, setOpen] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlanType | null>(null);
  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleSaveMealPlan = async () => {
    if (!mealPlan) return;

    const { data, error } = await supabase
      .from("saved_meal_plans")
      .insert([{ user_id: supabase.auth.user()?.id, name, plan: mealPlan }]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Meal Plan</h1>
        <PreferencesForm setMealPlan={setMealPlan} />
        
        <Button onClick={() => setOpen(true)} className="mt-4">
          Save Meal Plan
        </Button>

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
      </main>
    </div>
  );
};

export default MealPlan;
