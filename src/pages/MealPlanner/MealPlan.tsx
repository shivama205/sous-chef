import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { LoginDialog } from "@/components/LoginDialog";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { PageHeader } from "@/components/ui/PageHeader";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Calculator, RefreshCw, Save, Sparkles, ChefHat, Clock, Utensils, ArrowRight, Loader2, Brain, Coffee } from "lucide-react";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { MacroCalculator } from "@/components/MacroCalculator";
import { PreferencesForm } from "@/components/PreferencesForm";
import { generateMealPlan } from "@/services/mealPlan";
import { mealPlanLoadingMessages } from "@/lib/loadingMessages";
import type { Preferences } from "@/types/preferences";
import type { UserMacros } from "@/types/macros";
import type { User } from "@supabase/supabase-js";
import { MealPlanGenerationRequest } from "@/types/mealPlan";
import { type SuggestedMeal, type MealSuggestionRequest } from "@/services/mealSuggestions";
import { useAuth } from "@/providers/AuthProvider";
import { usePageTracking } from "@/hooks/usePageTracking";
import { dataLayer } from "@/services/dataLayer";

const features = [
  {
    icon: Calculator,
    title: "Smart Macro Tracking",
    description: "Automatically calculate and track your daily nutritional needs"
  },
  {
    icon: RefreshCw,
    title: "Easy Regeneration",
    description: "Don't like a meal? Regenerate it instantly while keeping your preferences"
  },
  {
    icon: Save,
    title: "Save & Share",
    description: "Save your favorite meal plans and share them with friends and family"
  }
];

const exampleMealPlans = [
  {
    title: "High Protein Plan",
    description: "Perfect for muscle building and recovery",
    details: "2000 calories, 180g protein, balanced carbs and fats"
  },
  {
    title: "Mediterranean Diet",
    description: "Heart-healthy meals with fresh ingredients",
    details: "Rich in healthy fats, whole grains, and lean proteins"
  },
  {
    title: "Vegetarian Delight",
    description: "Plant-based nutrition without compromising protein",
    details: "Complete proteins from diverse plant sources"
  }
];

const initialPreferences: Preferences = {
  days: 7,
  targetCalories: 2000,
  targetProtein: 150,
  targetCarbs: 200,
  targetFat: 65,
  dietaryRestrictions: "",
  cuisinePreferences: []
};

export function MealPlan() {
  usePageTracking();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavingMacros, setIsSavingMacros] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [showMacroCalculator, setShowMacroCalculator] = useState(false);
  const [calculatedMacros, setCalculatedMacros] = useState<UserMacros | null>(null);
  const [savedMacros, setSavedMacros] = useState<UserMacros | null>(null);
  const [currentPreferences, setCurrentPreferences] = useState<Preferences>(initialPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedMeal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<SuggestedMeal | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [request, setRequest] = useState<MealSuggestionRequest>({
    preferences: [],
    mealType: undefined,
    cookingTime: undefined,
    difficulty: undefined,
    dietaryRestrictions: "",
    instructions: ""
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Fetch user's macros
        const { data: userMacros } = await supabase
          .from("user_macros")
          .select("*")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (userMacros) {
          setSavedMacros(userMacros);
          // Update preferences with saved macros
          setCurrentPreferences(prev => ({
            ...prev,
            targetCalories: userMacros.calories,
            targetProtein: userMacros.protein,
            targetCarbs: userMacros.carbs,
            targetFat: userMacros.fat
          }));
        }
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {      
      if (session?.user) {
        // Fetch user's macros on auth state change
        const { data: userMacros } = await supabase
          .from("user_macros")
          .select("*")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (userMacros) {
          setSavedMacros(userMacros);
          // Update preferences with saved macros
          setCurrentPreferences(prev => ({
            ...prev,
            targetCalories: userMacros.calories,
            targetProtein: userMacros.protein,
            targetCarbs: userMacros.carbs,
            targetFat: userMacros.fat
          }));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (request: MealPlanGenerationRequest) => {
    // check if user is logged in, if not, show login dialog
    if (!user) {
      setLoginDialogOpen(true);
      return;
    }

    setIsGenerating(true);

    try {
      // Track meal plan creation start
      dataLayer.trackMealPlanCreate({
        plan_duration: request.days.toString(),
        recipe_count: 0,
        user_id: user?.id
      });

      const newMealPlan = await generateMealPlan(request);
      
      navigate("/meal-plan/new", { 
        state: { 
          mealPlan: newMealPlan,
          request: request
        }
      });
    } catch (error) {
      console.error("Error generating meal plan:", error);
      toast({
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUserMacros = async (macros: UserMacros) => {
    if (!user) {
      setLoginDialogOpen(true);
      return;
    }

    setIsSavingMacros(true);

    try {
      // First check if user has existing macros
      const { data: existingMacros } = await supabase
        .from("user_macros")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      let error;
      if (existingMacros) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("user_macros")
          .update({
            calories: macros.calories,
            protein: macros.protein,
            carbs: macros.carbs,
            fat: macros.fat,
            last_updated: new Date().toISOString(),
            age: macros.age,
            weight: macros.weight,
            height: macros.height,
            gender: macros.gender,
            activity_level: macros.activity_level,
            fitness_goal: macros.fitness_goal
          })
          .eq("user_id", user.id);
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from("user_macros")
          .insert([{
            user_id: user.id,
            calories: macros.calories,
            protein: macros.protein,
            carbs: macros.carbs,
            fat: macros.fat,
            last_updated: new Date().toISOString(),
            age: macros.age,
            weight: macros.weight,
            height: macros.height,
            gender: macros.gender,
            activity_level: macros.activity_level,
            fitness_goal: macros.fitness_goal
          }]);
        error = insertError;
      }

      if (error) throw error;

      // Update local state
      setCalculatedMacros(macros);
      setSavedMacros({
        user_id: user.id,
        ...macros,
        last_updated: new Date().toISOString()
      });

      // Update preferences
      setCurrentPreferences(prev => ({
        ...prev,
        targetCalories: macros.calories,
        targetProtein: macros.protein,
        targetCarbs: macros.carbs,
        targetFat: macros.fat
      }));

      toast({
        title: "Macros Saved",
        description: "Your macro targets have been saved successfully.",
      });

      setShowMacroCalculator(false);
    } catch (error) {
      console.error("Error saving macros:", error);
      toast({
        title: "Error",
        description: "Failed to save your macros. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSavingMacros(false);
    }
  };

  const handleSharePlan = async (planId: string, planData: any) => {
    try {
      // Track meal plan share
      dataLayer.trackMealPlanShare({
        plan_id: planId,
        plan_duration: planData.duration,
        recipe_count: planData.recipes.length,
        user_id: user?.id
      });

      // ... rest of share plan logic
    } catch (error) {
      console.error('Error sharing meal plan:', error);
    }
  };

  const handleViewPlan = (planId: string, planData: any) => {
    // Track meal plan view
    dataLayer.trackMealPlanView({
      plan_id: planId,
      plan_duration: planData.duration,
      recipe_count: planData.recipes.length,
      user_id: user?.id
    });

    // ... rest of view plan logic
  };

  const handleRecipeSelect = (recipe: any) => {
    // Track recipe selection in meal plan
    dataLayer.trackRecipeView({
      recipe_id: recipe.id,
      recipe_name: recipe.name,
      recipe_category: 'meal_plan',
      cooking_time: recipe.cookingTime,
      user_id: user?.id
    });

    // ... rest of recipe selection logic
  };

  const handleFormFieldChange = (field: string, value: any) => {
    // Track significant form field changes
    dataLayer.trackFormField({
      field_name: field,
      field_value: value,
      user_id: user?.id
    });

    // ... rest of form field change logic
  };

  const LoggedInView = () => (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <PageHeader
        icon={Sparkles}
        title="Your Meal Planner"
        description="Create personalized meal plans that match your nutritional goals and dietary preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
            <PreferencesForm
              onSubmit={handleSubmit}
              preferences={currentPreferences}
              setPreferences={setCurrentPreferences}
              isLoading={isGenerating}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Saved Macros */}
          {savedMacros ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Your Saved Macros</h2>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(savedMacros.last_updated).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Daily Calories</p>
                  <p className="text-xl font-semibold text-primary">{savedMacros.calories}</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="text-xl font-semibold text-primary">{savedMacros.protein}g</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Carbs</p>
                  <p className="text-xl font-semibold text-primary">{savedMacros.carbs}g</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Fat</p>
                  <p className="text-xl font-semibold text-primary">{savedMacros.fat}g</p>
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={() => setShowMacroCalculator(true)}
                className="w-full mt-4"
                disabled={isSavingMacros}
              >
                Recalculate Macros
              </Button>
            </Card>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Calculate Your Macros</h2>
                  <p className="text-sm text-muted-foreground">
                    Get personalized macro targets
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => setShowMacroCalculator(true)}
                className="w-full"
              >
                Calculate Now
              </Button>
            </Card>
          )}

          {/* Quick Tips */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Tips</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                Calculate your macros first for better meal planning
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                Be specific with your dietary restrictions
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                Choose cuisines you enjoy for better adherence
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Macro Calculator Dialog */}
      {showMacroCalculator && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
            <div className="relative w-full h-full sm:h-auto sm:max-w-2xl overflow-hidden rounded-none sm:rounded-lg border-0 sm:border bg-background shadow-lg animate-in fade-in-0 zoom-in-95">
              <div className="sticky top-0 z-20 border-b bg-background px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold">Macro Calculator</h2>
                    <p className="text-sm text-muted-foreground">
                      Calculate your recommended daily intake
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMacroCalculator(false)}
                    className="rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto h-[calc(100vh-8rem)]">
                <div className="px-4 sm:px-6 py-6">
                  <MacroCalculator 
                    onSaveMacros={handleUserMacros}
                    isLoading={isSavingMacros}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const LoggedOutView = () => (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Plan Your Meals Like a Pro Chef 👨‍🍳
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get personalized meal plans that match your goals, preferences, and dietary needs. Save time, eat better, and reach your health goals faster.
        </p>
        <Button size="lg" onClick={() => setLoginDialogOpen(true)} className="bg-gradient-to-r from-primary to-primary/80">
          Start Planning Your Meals
        </Button>
      </section>

      {/* Features Grid */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Smart Features for Better Meal Planning</h2>
          <p className="text-muted-foreground mt-2">Everything you need to plan your meals efficiently</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Example Meal Plans */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Example Meal Plans</h2>
          <p className="text-muted-foreground mt-2">Get inspired by our curated meal plans</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exampleMealPlans.map((plan, index) => (
            <Card key={index} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{plan.title}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="text-sm font-medium text-primary">{plan.details}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300"
                  onClick={() => setLoginDialogOpen(true)}
                >
                  Try This Plan
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Macro Calculator Preview */}
      <section className="relative">
        <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/10">
          <div className="p-8 md:p-12 space-y-6">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h2 className="text-2xl font-semibold">Calculate Your Perfect Macros</h2>
              <p className="text-muted-foreground">
                Our smart calculator helps you determine the ideal macronutrient ratios based on your goals, body composition, and activity level.
              </p>
              <Button 
                size="lg"
                onClick={() => setLoginDialogOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                Calculate Your Macros
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Sign Up CTA */}
      <section className="text-center space-y-6">
        <h2 className="text-2xl font-semibold">Ready to Transform Your Meal Planning?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join thousands of happy users who have simplified their meal planning with MySideChef.
        </p>
        <Button 
          size="lg" 
          onClick={() => setLoginDialogOpen(true)}
          className="bg-gradient-to-r from-primary to-primary/80"
        >
          Get Started for Free
        </Button>
      </section>

      <LoginDialog 
        open={loginDialogOpen} 
        onOpenChange={setLoginDialogOpen}
      />
    </div>
  );

  return (
    <BaseLayout>
      <div className="relative">
        <LoadingOverlay isLoading={isGenerating} messages={mealPlanLoadingMessages} />
        {user ? <LoggedInView /> : <LoggedOutView />}
      </div>
    </BaseLayout>
  );
}