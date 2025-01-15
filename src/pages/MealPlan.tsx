import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PreferencesForm } from "@/components/PreferencesForm";
import { MealPlan as MealPlanType } from "@/types/mealPlan";
import { supabase } from "@/lib/supabase";
import NavigationBar from "@/components/NavigationBar";
import { RefreshCw, Save } from "lucide-react";
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
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { OutOfCreditDialog } from "@/components/OutOfCreditDialog";
import { LoginDialog } from "@/components/LoginDialog";

const MealPlan = () => {
  const [open, setOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlanType | null>(null);
  const [name, setName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPreferences, setCurrentPreferences] = useState<Preferences | null>(null);
  const mealPlanRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSaveMealPlan = async () => {
    if (!mealPlan) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setLoginDialogOpen(true);
      return;
    }

    const { error } = await supabase
      .from("saved_meal_plans")
      .insert([{ user_id: session.user.id, name: name, plan: mealPlan }]);

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
    setIsGenerating(true);
    setCurrentPreferences(preferences);

    try {
      // Check if user is logged in and has credits
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoginDialogOpen(true);
        setIsGenerating(false);
        return;
      }

      const { data: credits } = await supabase
        .from('user_credits')
        .select('credits_available, credits_used')
        .eq('user_id', session.user.id)
        .single();

      if (!credits || credits.credits_available <= 0) {
        setOpen(false); // Close save dialog if open
        setShowCreditDialog(true);
        setIsGenerating(false);
        return;
      }

      const mealPlan = await generateMealPlan(preferences);

      // Consume one credit after successful generation
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ 
          credits_available: credits.credits_available - 1,
          credits_used: credits.credits_used + 1
        })
        .eq('user_id', session.user.id);

      if (updateError) {
        toast({
          title: "Error updating credits",
          description: "Failed to update credits, but your meal plan was generated.",
          variant: "destructive",
        });
      }

      setMealPlan(mealPlan);
      navigate('/meal-plan/new', { state: { mealPlan } });
    } catch (error) {
      toast({
        title: "Error generating meal plan",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateMealPlan = async () => {
    if (!currentPreferences) return;
    setIsGenerating(true);
    try {
      const newMealPlan = await generateMealPlan(currentPreferences);
      setMealPlan(newMealPlan);
    } catch (error) {
      toast({
        title: "Error regenerating meal plan",
        description: "Failed to regenerate meal plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Create Your Perfect Meal Plan
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <PreferencesForm 
              onSubmit={handleSubmit} 
              disabled={isGenerating}
            />
          </div>

          {mealPlan && (
            <motion.div
              ref={mealPlanRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Your Generated Meal Plan
                </h2>
                <div className="flex gap-4">
                  <Button
                    onClick={handleRegenerateMealPlan}
                    variant="outline"
                    disabled={isGenerating}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate Plan
                  </Button>
                  <Button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Plan
                  </Button>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-primary to-primary/80">
                      <tr>
                        <th className="py-4 px-6 text-left text-white font-semibold">Day</th>
                        <th className="py-4 px-6 text-left text-white font-semibold">Meal</th>
                        <th className="py-4 px-6 text-center text-white font-semibold">Protein (g)</th>
                        <th className="py-4 px-6 text-center text-white font-semibold">Fat (g)</th>
                        <th className="py-4 px-6 text-center text-white font-semibold">Carbs (g)</th>
                        <th className="py-4 px-6 text-center text-white font-semibold">Calories</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mealPlan.days.map((day, dayIndex) => (
                        <React.Fragment key={`day-${dayIndex}`}>
                          {day.meals.map((meal, mealIndex) => (
                            <tr 
                              key={`${dayIndex}-${mealIndex}`}
                              className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                            >
                              {mealIndex === 0 && (
                                <td 
                                  className="py-4 px-6 font-medium"
                                  rowSpan={day.meals.length}
                                >
                                  {day.day}
                                </td>
                              )}
                              <td className="py-4 px-6">
                                <div className="font-medium">{meal.name}</div>
                                <div className="text-sm text-gray-500">{meal.time}</div>
                              </td>
                              <td className="py-4 px-6 text-center">{meal.nutritionInfo.protein}</td>
                              <td className="py-4 px-6 text-center">{meal.nutritionInfo.fat}</td>
                              <td className="py-4 px-6 text-center">{meal.nutritionInfo.carbs}</td>
                              <td className="py-4 px-6 text-center">{meal.nutritionInfo.calories}</td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50/80 font-semibold">
                            <td colSpan={2} className="py-3 px-6">Daily Total</td>
                            <td className="py-3 px-6 text-center">
                              {day.meals.reduce((sum, meal) => sum + meal.nutritionInfo.protein, 0)}g
                            </td>
                            <td className="py-3 px-6 text-center">
                              {day.meals.reduce((sum, meal) => sum + meal.nutritionInfo.fat, 0)}g
                            </td>
                            <td className="py-3 px-6 text-center">
                              {day.meals.reduce((sum, meal) => sum + meal.nutritionInfo.carbs, 0)}g
                            </td>
                            <td className="py-3 px-6 text-center">
                              {day.meals.reduce((sum, meal) => sum + meal.nutritionInfo.calories, 0)}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

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

        <LoginDialog 
          open={loginDialogOpen} 
          onOpenChange={setLoginDialogOpen} 
        />

        <OutOfCreditDialog 
          open={showCreditDialog} 
          onOpenChange={setShowCreditDialog} 
        />
      </main>
    </div>
  );
};

export default MealPlan;