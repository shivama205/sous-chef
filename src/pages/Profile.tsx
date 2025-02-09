import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Settings, ChefHat, History, Star, Clock, Calendar, Utensils, Loader2 } from "lucide-react";
import { SavedRecipes } from "@/components/profile/SavedRecipes";
import { SavedMealPlans } from "@/components/profile/SavedMealPlans";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Activity } from "@/types/activity";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { useToast } from "@/components/ui/use-toast";
import type { Recipe } from "@/types/recipeFinder";
import type { MealPlan } from "@/types/mealPlan";

interface UserStats {
  recipesCount: number;
  plansCount: number;
  recentActivities: Activity[];
}

interface SavedMealPlan {
  id: string;
  name: string;
  plan: MealPlan;
  created_at: string;
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

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("recipes");
  const [stats, setStats] = useState<UserStats>({
    recipesCount: 0,
    plansCount: 0,
    recentActivities: []
  });
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<SavedMealPlan[]>([]);
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set());
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [isLoadingMealPlans, setIsLoadingMealPlans] = useState(false);

  // Load basic stats only once on mount
  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setIsLoadingStats(true);
        const [recipesCount, plansCount, activities] = await Promise.all([
          supabase
            .from("saved_recipes")
            .select("id", { count: "exact" })
            .eq("user_id", user.id),
          supabase
            .from("saved_meal_plans")
            .select("id", { count: "exact" })
            .eq("user_id", user.id),
          supabase
            .from("user_activity")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(3)
        ]);

        if (isMounted) {
          setStats({
            recipesCount: recipesCount.count || 0,
            plansCount: plansCount.count || 0,
            recentActivities: (activities.data as Activity[]) || []
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        if (isMounted) {
          toast({
            title: "Error loading profile",
            description: "Failed to load profile stats. Please try refreshing the page.",
            variant: "destructive"
          });
        }
      } finally {
        if (isMounted) {
          setIsLoadingStats(false);
        }
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [user?.id]); // Only depend on user.id, not the entire user object

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
        case "activity":
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
                <Avatar className="w-20 h-20 sm:w-32 sm:h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={user.user_metadata.avatar_url} />
                  <AvatarFallback className="text-2xl bg-primary/10">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left flex-1 space-y-1 sm:space-y-2 pb-2">
                  <h1 className="text-xl sm:text-3xl font-bold">
                    {user.user_metadata.full_name || user.email}
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
                <TabsTrigger 
                  value="activity" 
                  className="data-[state=active]:bg-primary/5"
                >
                  <History className="w-4 h-4 mr-2" />
                  Activity
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

              <TabsContent value="activity" className="focus-visible:outline-none mt-0">
                <Card className="border bg-white p-6">
                  {isLoading("activity") ? (
                    <LoadingSpinner />
                  ) : stats.recentActivities.length > 0 ? (
                    <RecentActivity activities={stats.recentActivities} />
                  ) : (
                    <div className="text-center py-6">
                      <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Recent Activity</h3>
                      <p className="text-muted-foreground mb-6">
                        Start exploring our features to see your activity here!
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                        <Button 
                          variant="outline" 
                          className="w-full hover:bg-primary/5"
                          onClick={() => navigate("/recipe-finder")}
                        >
                          <ChefHat className="w-4 h-4 mr-2" />
                          Find Recipes
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full hover:bg-primary/5"
                          onClick={() => navigate("/meal-plan")}
                        >
                          <Utensils className="w-4 h-4 mr-2" />
                          Plan Meals
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
    </BaseLayout>
  );
}