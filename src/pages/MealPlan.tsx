import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PreferencesForm } from "@/components/PreferencesForm";
import { MealPlan as MealPlanType } from "@/types/mealPlan";
import { supabase } from "@/lib/supabase";
import NavigationBar from "@/components/NavigationBar";
import { Check, RefreshCw, Save, Calculator } from "lucide-react";
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
import { MacroCalculator } from "@/components/MacroCalculator";
import type { MacroResults } from "@/types/macros";
import { UserMacros } from "@/types/macros";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { mealPlanLoadingMessages, useLoadingMessages } from "@/lib/loadingMessages";

const initialPreferences: Preferences = {
  days: 7,
  targetCalories: undefined,
  targetProtein: undefined,
  targetCarbs: undefined,
  targetFat: undefined,
  dietaryRestrictions: "",
  cuisinePreferences: []
};

const MealPlan = () => {
  const [open, setOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const [showMacroCalculator, setShowMacroCalculator] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlanType | null>(null);
  const [name, setName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(mealPlanLoadingMessages[0].message);
  const [loadingSubmessage, setLoadingSubmessage] = useState(mealPlanLoadingMessages[0].submessage);
  const loadingMessagesHelper = useLoadingMessages(mealPlanLoadingMessages);
  const [currentPreferences, setCurrentPreferences] = useState<Preferences>(initialPreferences);
  const mealPlanRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [calculatedMacros, setCalculatedMacros] = useState<MacroResults | null>(null);
  const [savedMacros, setSavedMacros] = useState<UserMacros | null>(null);

  // Load saved macros on mount
  useEffect(() => {
    const loadSavedMacros = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('user_macros')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!error && data) {
        setSavedMacros(data);
      }
    };

    loadSavedMacros();
  }, []);

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
    loadingMessagesHelper.resetIndex();
    setLoadingMessage(loadingMessagesHelper.getCurrentMessage().message);
    setLoadingSubmessage(loadingMessagesHelper.getCurrentMessage().submessage);

    const messageInterval = setInterval(() => {
      const { message, submessage } = loadingMessagesHelper.getNextMessage();
      setLoadingMessage(message);
      setLoadingSubmessage(submessage);
    }, 3000);

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
      console.error('Error generating meal plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearInterval(messageInterval);
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

  const handleUseMacros = () => {
    if (calculatedMacros) {
      setCurrentPreferences(prev => ({
        ...prev,
        targetCalories: calculatedMacros.calories,
        targetProtein: calculatedMacros.protein,
        targetCarbs: calculatedMacros.carbs,
        targetFat: calculatedMacros.fat
      }));
      setShowMacroCalculator(false);
    }
  };

  return (
    <div className={cn("min-h-screen bg-background", isGenerating && "pointer-events-none")}>
      <LoadingOverlay 
        isLoading={isGenerating}
        messages={mealPlanLoadingMessages}
        defaultMessage={mealPlanLoadingMessages[0]}
      />
      <NavigationBar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Create Your Perfect Meal Plan
              </h1>
              <p className="text-lg text-muted-foreground">
                Tell us your preferences, and we'll create a personalized meal plan just for you.
              </p>
            </div>

            {!savedMacros && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent">
                  Why Use Our Meal Planner?
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg text-gray-700">Personalized to your dietary needs and preferences</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg text-gray-700">Balanced nutrition with every meal</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg text-gray-700">Save time on meal planning and grocery shopping</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg text-gray-700">Reduce food waste with smart planning</span>
                  </li>
                </ul>
              </div>
            )}

            {savedMacros && (
              <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-2xl p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-secondary">Your Saved Macros</h2>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {new Date(savedMacros.last_updated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/5 rounded-lg">
                      <p className="text-sm text-muted-foreground">Daily Calories</p>
                      <p className="text-2xl font-semibold text-secondary">{savedMacros.calories}</p>
                    </div>
                    <div className="p-4 bg-secondary/5 rounded-lg">
                      <p className="text-sm text-muted-foreground">Protein</p>
                      <p className="text-2xl font-semibold text-secondary">{savedMacros.protein}g</p>
                    </div>
                    <div className="p-4 bg-secondary/5 rounded-lg">
                      <p className="text-sm text-muted-foreground">Carbs</p>
                      <p className="text-2xl font-semibold text-secondary">{savedMacros.carbs}g</p>
                    </div>
                    <div className="p-4 bg-secondary/5 rounded-lg">
                      <p className="text-sm text-muted-foreground">Fat</p>
                      <p className="text-2xl font-semibold text-secondary">{savedMacros.fat}g</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => {
                        setCurrentPreferences(prev => ({
                          ...prev,
                          targetCalories: savedMacros.calories,
                          targetProtein: savedMacros.protein,
                          targetCarbs: savedMacros.carbs,
                          targetFat: savedMacros.fat
                        }));
                      }}
                      className="flex-1"
                    >
                      Use These Macros
                    </Button>
                    <Button
                      onClick={() => setShowMacroCalculator(true)}
                      variant="outline"
                    >
                      Recalculate
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {!savedMacros && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-secondary to-secondary/70 bg-clip-text text-transparent">
                  Not Sure About Your Needs?
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Let us help you calculate your daily nutritional requirements based on your goals.
                </p>
                <Button
                  onClick={() => setShowMacroCalculator(!showMacroCalculator)}
                  variant="outline"
                  className="h-12 px-6 text-lg font-medium bg-gradient-to-r from-secondary/10 to-secondary/5 hover:from-secondary/20 hover:to-secondary/10 text-secondary border-secondary/20 hover:border-secondary/30"
                >
                  {showMacroCalculator ? 'Back to Preferences' : 'Calculate Your Macros'}
                </Button>
              </div>
            )}
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {showMacroCalculator ? (
              <div className="space-y-6">
                <MacroCalculator onSaveMacros={(macros) => {
                  setCalculatedMacros(macros);
                  setSavedMacros({
                    user_id: '', // This will be set by the backend
                    ...macros,
                    last_updated: new Date().toISOString()
                  });
                  setCurrentPreferences(prev => ({
                    ...prev,
                    targetCalories: macros.calories,
                    targetProtein: macros.protein,
                    targetCarbs: macros.carbs,
                    targetFat: macros.fat
                  }));
                  setShowMacroCalculator(false);
                }} />
              </div>
            ) : (
              <PreferencesForm 
                onSubmit={handleSubmit} 
                isLoading={isGenerating} 
                preferences={currentPreferences}
                setPreferences={setCurrentPreferences}
              />
            )}
          </motion.div>
        </div>
      </main>

      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
      <OutOfCreditDialog open={showCreditDialog} onOpenChange={setShowCreditDialog} />
    </div>
  );
};

export default MealPlan;
