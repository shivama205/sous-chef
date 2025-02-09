import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ChefHat, Star, Clock, Calendar, Utensils, Loader2, Dumbbell, Target, ChevronRight, ChevronLeft, Brain, Sparkles } from "lucide-react";
import { SavedRecipes } from "@/components/profile/SavedRecipes";
import { SavedMealPlans } from "@/components/profile/SavedMealPlans";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import type { Recipe } from "@/types/recipeFinder";
import type { MealPlan } from "@/types/mealPlan";

interface UserStats {
  recipesCount: number;
  plansCount: number;
}

interface SavedMealPlan {
  id: string;
  name: string;
  plan: MealPlan;
  created_at: string;
}

interface UserMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const StatItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
  <div className="flex items-center gap-1">
    <Icon className="w-4 h-4" />
    <span>{value} {label}</span>
  </div>
);

const MacroInput = ({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">{label}</Label>
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      className="bg-white"
    />
  </div>
);

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("recipes");
  const [stats, setStats] = useState<UserStats>({
    recipesCount: 0,
    plansCount: 0
  });
  const [macros, setMacros] = useState<UserMacros>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65
  });
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<SavedMealPlan[]>([]);
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set());
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [isLoadingMealPlans, setIsLoadingMealPlans] = useState(false);
  const [isSavingMacros, setIsSavingMacros] = useState(false);
  const [showGoalsDialog, setShowGoalsDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Load basic stats and user macros
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!user) return;
      
      try {
        setIsLoadingStats(true);
        const [recipesCount, plansCount, macrosData] = await Promise.all([
          supabase
            .from("saved_recipes")
            .select("id", { count: "exact" })
            .eq("user_id", user.id),
          supabase
            .from("saved_meal_plans")
            .select("id", { count: "exact" })
            .eq("user_id", user.id),
          supabase
            .from("user_macros")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle()
        ]);

        if (isMounted) {
          setStats({
            recipesCount: recipesCount.count || 0,
            plansCount: plansCount.count || 0
          });

          if (macrosData.data) {
            setMacros({
              calories: macrosData.data.calories || 2000,
              protein: macrosData.data.protein || 150,
              carbs: macrosData.data.carbs || 200,
              fat: macrosData.data.fat || 65
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (isMounted) {
          toast({
            title: "Error loading profile",
            description: "Failed to load profile data. Please try refreshing the page.",
            variant: "destructive"
          });
        }
      } finally {
        if (isMounted) {
          setIsLoadingStats(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Handle tab changes and data loading
  useEffect(() => {
    let isMounted = true;

    const loadTabData = async () => {
      if (!user || loadedTabs.has(activeTab)) return;

      try {
        if (activeTab === "recipes" && !loadedTabs.has("recipes")) {
          setIsLoadingRecipes(true);
          const { data, error } = await supabase
            .from("saved_recipes")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (error) throw error;
          if (!isMounted) return;

          const transformedRecipes = (data || []).map(record => ({
            id: record.id,
            name: record.name || '',
            description: record.description || '',
            cookingTime: record.cooking_time || 0,
            ingredients: Array.isArray(record.ingredients) ? record.ingredients : [],
            instructions: Array.isArray(record.instructions) ? record.instructions : [],
            nutritionalValue: record.nutritional_value || {
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0
            },
            imageUrl: record.image_url || null,
            cuisineType: record.cuisine_type || 'Mixed',
            difficulty: (record.difficulty || 'medium').toLowerCase() as 'easy' | 'medium' | 'hard',
            created_at: record.created_at,
            updated_at: record.updated_at
          }));

          setRecipes(transformedRecipes);
          setLoadedTabs(prev => new Set([...prev, "recipes"]));
        }

        if (activeTab === "meal-plans" && !loadedTabs.has("meal-plans")) {
          setIsLoadingMealPlans(true);
          const { data, error } = await supabase
            .from("saved_meal_plans")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (error) throw error;
          if (!isMounted) return;

          setMealPlans(data || []);
          setLoadedTabs(prev => new Set([...prev, "meal-plans"]));
        }
      } catch (error) {
        console.error(`Error loading ${activeTab}:`, error);
        if (isMounted) {
          toast({
            title: `Error loading ${activeTab}`,
            description: `Failed to load your ${activeTab}. Please try again.`,
            variant: "destructive"
          });
        }
      } finally {
        if (isMounted) {
          setIsLoadingRecipes(false);
          setIsLoadingMealPlans(false);
        }
      }
    };

    loadTabData();
    return () => {
      isMounted = false;
    };
  }, [activeTab, user?.id, loadedTabs]);

  const handleSaveMacros = async () => {
    if (!user) return;

    setIsSavingMacros(true);
    try {
      const { error } = await supabase
        .from("user_macros")
        .upsert({
          user_id: user.id,
          ...macros
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your nutritional goals have been updated.",
      });
      setShowGoalsDialog(false);
    } catch (error) {
      console.error("Error saving macros:", error);
      toast({
        title: "Error",
        description: "Failed to save nutritional goals. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSavingMacros(false);
    }
  };

  const steps = [
    {
      title: "Daily Calories",
      description: "Set your target daily calorie intake",
      icon: Target,
      content: (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <Target className="w-8 h-8 mx-auto text-primary" />
            <h3 className="text-lg font-semibold">Set Your Daily Calorie Goal</h3>
            <p className="text-sm text-muted-foreground">
              This helps us tailor recipes and meal plans to your energy needs
            </p>
          </div>
          <MacroInput
            label="Daily Calories"
            value={macros.calories}
            onChange={(value) => setMacros(prev => ({ ...prev, calories: value }))}
          />
        </div>
      )
    },
    {
      title: "Protein Goal",
      description: "Set your daily protein target",
      icon: Dumbbell,
      content: (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <Dumbbell className="w-8 h-8 mx-auto text-primary" />
            <h3 className="text-lg font-semibold">Protein Target</h3>
            <p className="text-sm text-muted-foreground">
              Protein is essential for muscle maintenance and recovery
            </p>
          </div>
          <MacroInput
            label="Daily Protein (g)"
            value={macros.protein}
            onChange={(value) => setMacros(prev => ({ ...prev, protein: value }))}
          />
        </div>
      )
    },
    {
      title: "Carbs & Fat",
      description: "Set your carbs and fat targets",
      icon: Brain,
      content: (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <Brain className="w-8 h-8 mx-auto text-primary" />
            <h3 className="text-lg font-semibold">Carbs & Fat Balance</h3>
            <p className="text-sm text-muted-foreground">
              Balance your energy sources for optimal performance
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MacroInput
              label="Daily Carbs (g)"
              value={macros.carbs}
              onChange={(value) => setMacros(prev => ({ ...prev, carbs: value }))}
            />
            <MacroInput
              label="Daily Fat (g)"
              value={macros.fat}
              onChange={(value) => setMacros(prev => ({ ...prev, fat: value }))}
            />
          </div>
        </div>
      )
    }
  ];

  if (!user) {
    navigate("/");
    return null;
  }

  const isLoading = (tab: string): boolean => {
    if (!loadedTabs.has(tab)) {
      switch (tab) {
        case "recipes":
          return isLoadingRecipes;
        case "meal-plans":
          return isLoadingMealPlans;
        case "details":
          return isLoadingStats;
        default:
          return false;
      }
    }
    return false;
  };

  return (
    <BaseLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        {isLoadingStats ? (
          <div className="bg-gradient-to-b from-primary/5 to-background border-b">
            <div className="container mx-auto px-4 py-6 sm:py-12">
              <LoadingSpinner />
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-primary/5 to-background border-b">
            <div className="container mx-auto px-4 py-6 sm:py-12">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-8">
                <Avatar className="w-20 h-20 sm:w-32 sm:h-32 border-4 border-white shadow-lg bg-primary/10">
                  {user.user_metadata?.avatar_url ? (
                    <AvatarImage 
                      src={user.user_metadata.avatar_url} 
                      alt={user.user_metadata?.full_name || user.email}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="text-2xl font-semibold text-primary bg-primary/10">
                      {(user.user_metadata?.full_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-center sm:text-left flex-1 space-y-1 sm:space-y-2 pb-2">
                  <h1 className="text-xl sm:text-3xl font-bold">
                    {user.user_metadata?.full_name || user.email}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-muted-foreground">
                    <StatItem 
                      icon={Calendar}
                      label=""
                      value={`Joined ${format(new Date(user.created_at), 'MMM yyyy')}`}
                    />
                    <StatItem 
                      icon={Star}
                      label={stats.recipesCount === 1 ? 'Recipe' : 'Recipes'}
                      value={stats.recipesCount}
                    />
                    <StatItem 
                      icon={Clock}
                      label={stats.plansCount === 1 ? 'Plan' : 'Plans'}
                      value={stats.plansCount}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tab Bar */}
            <div className="flex items-center justify-center sm:justify-start">
              <TabsList className="bg-white border">
                <TabsTrigger 
                  value="recipes" 
                  className="data-[state=active]:bg-primary/5"
                >
                  <ChefHat className="w-4 h-4 mr-2" />
                  Recipes
                </TabsTrigger>
                <TabsTrigger 
                  value="meal-plans" 
                  className="data-[state=active]:bg-primary/5"
                >
                  <Utensils className="w-4 h-4 mr-2" />
                  Meal Plans
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              <TabsContent value="recipes" className="focus-visible:outline-none mt-0">
                <Card className="border bg-white">
                  {isLoading("recipes") ? (
                    <LoadingSpinner />
                  ) : (
                    <SavedRecipes initialRecipes={recipes} />
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="meal-plans" className="focus-visible:outline-none mt-0">
                <Card className="border bg-white">
                  {isLoading("meal-plans") ? (
                    <LoadingSpinner />
                  ) : (
                    <SavedMealPlans initialMealPlans={mealPlans} />
                  )}
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </main>

        {/* Floating Action Button */}
        <Button
          className="fixed bottom-6 right-6 rounded-full w-12 h-12 shadow-lg bg-primary hover:bg-primary/90 p-0"
          onClick={() => setShowGoalsDialog(true)}
        >
          <Target className="w-6 h-6" />
        </Button>

        {/* Goals Dialog */}
        <Dialog open={showGoalsDialog} onOpenChange={setShowGoalsDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Nutrition Goals
              </DialogTitle>
              <DialogDescription>
                Set your nutritional goals for personalized recommendations
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="mb-8">
                <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
              </div>

              {steps[currentStep].content}

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  disabled={currentStep === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  onClick={() => {
                    if (currentStep === steps.length - 1) {
                      handleSaveMacros();
                    } else {
                      setCurrentStep(prev => prev + 1);
                    }
                  }}
                  disabled={isSavingMacros}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  {currentStep === steps.length - 1 ? (
                    isSavingMacros ? "Saving..." : "Save Goals"
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </BaseLayout>
  );
}