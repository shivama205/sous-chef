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
      
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Create Your Perfect Meal Plan
              </h1>
              <p className="text-lg text-muted-foreground">
                Tell us your preferences, and we'll create a personalized meal plan just for you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Why Use Our Meal Planner?</h2>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Personalized to your dietary needs and preferences</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Balanced nutrition with every meal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Save time on meal planning and grocery shopping</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Reduce food waste with smart planning</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Not Sure About Your Needs?</h2>
                <p className="text-muted-foreground mb-4">
                  Let us help you calculate your daily nutritional requirements based on your goals.
                </p>
                <Button
                  onClick={() => setShowMacroCalculator(true)}
                  variant="outline"
                  className="w-full"
                >
                  Calculate Your Macros
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:sticky lg:top-24"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
              <PreferencesForm 
                onSubmit={handleSubmit} 
                disabled={isGenerating}
              />
            </div>
          </motion.div>
        </div>

        {/* Macro Calculator Dialog */}
        <Dialog open={showMacroCalculator} onOpenChange={setShowMacroCalculator}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Calculate Your Daily Needs</DialogTitle>
              <DialogDescription>
                Let's find out your optimal macro nutrient ratios.
              </DialogDescription>
            </DialogHeader>
            <MacroCalculator />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default MealPlan;
