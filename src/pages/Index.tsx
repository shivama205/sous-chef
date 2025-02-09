import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Brain, ChefHat, ArrowRight, Sparkles, Clock, Star, Utensils, Apple, Heart, Users, Trophy, Check, Calendar } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { SEO } from "@/components/SEO";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { SocialProof } from "@/components/sections/social-proof";
import { getUserRecipes } from "@/services/recipeFinder";
import { getUserMealPlans } from "@/services/mealPlan";
import { supabase } from "@/lib/supabase";
import type { Recipe } from "@/types/recipeFinder";
import type { MealPlan } from "@/types/mealPlan";
import { SavedRecipes } from "@/components/profile/SavedRecipes";
import { SavedMealPlans } from "@/components/profile/SavedMealPlans";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

const QuickActionCard = ({ icon: Icon, title, description, to }: any) => (
  <Link to={to}>
    <Card className="p-6 bg-white border hover:border-primary/20 hover:shadow-md transition-all group">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  </Link>
);

interface SavedMealPlan {
  id: string;
  name: string;
  plan: MealPlan;
  created_at: string;
}

const LoggedInView = () => {
  const { user } = useAuth();
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<SavedMealPlan[]>([]);
  const [stats, setStats] = useState({
    plansCount: 0,
    recipesCount: 0,
    daysActive: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "recipes" | "meal-plans">("overview");

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        // Load user stats and data in parallel
        const [recipesData, plansData, activityData] = await Promise.all([
          supabase
            .from("saved_recipes")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("saved_meal_plans")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("user_activity")
            .select("created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
        ]);

        // Transform recipes data
        const transformedRecipes = (recipesData.data || []).map(record => ({
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

        // Set data
        setRecipes(transformedRecipes);
        setRecentRecipes(transformedRecipes.slice(0, 3));
        setMealPlans(plansData.data || []);

        // Set stats
        setStats({
          recipesCount: transformedRecipes.length,
          plansCount: (plansData.data || []).length,
          daysActive: activityData.data ? 
            new Set(activityData.data.map(a => 
              new Date(a.created_at).toDateString()
            )).size : 1
        });
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const getCardVariant = (color: string) => {
    switch (color) {
      case "blue":
        return "glass-secondary" as const;
      case "green":
        return "glass-primary" as const;
      case "orange":
        return "glass-primary" as const;
      default:
        return "glass" as const;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Message */}
        <motion.div variants={item} className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-4">
            Welcome Back
          </span>
          <h1 className="text-3xl font-bold mb-2">Ready to Cook Something Amazing?</h1>
          <p className="text-lg text-muted-foreground">
            Get started with quick actions or check your recent activity
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Quick Actions */}
          <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              icon={Brain}
              title="Need Quick Ideas?"
              description="Get instant meal suggestions based on your mood"
              to="/meal-suggestions"
            />
            <QuickActionCard
              icon={ChefHat}
              title="Weekly Meal Plan"
              description="Plan your meals for the upcoming week"
              to="/meal-plan"
            />
            <QuickActionCard
              icon={Utensils}
              title="Find Recipes"
              description="Search our collection of healthy recipes"
              to="/recipe-finder"
            />
            <QuickActionCard
              icon={Apple}
              title="Healthy Swaps"
              description="Discover healthier alternatives"
              to="/healthy-alternative"
            />
          </motion.div>

          {/* Tabs */}
          <div className="space-y-6">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value: "overview" | "recipes" | "meal-plans") => setActiveTab(value)}>
              <div className="flex items-center justify-center sm:justify-start">
                <TabsList className="bg-white border">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="recipes">Saved Recipes</TabsTrigger>
                  <TabsTrigger value="meal-plans">Meal Plans</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats and Recent Activity */}
                <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Activity */}
                  <Card className="col-span-2 p-6 bg-white border">
                    <h3 className="text-lg font-semibold mb-4">Recent Recipes</h3>
                    {recentRecipes.length > 0 ? (
                      <div className="space-y-4">
                        {recentRecipes.map((recipe, index) => (
                          <Link 
                            key={recipe.id} 
                            to={`/recipe/${recipe.id}`}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <ChefHat className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{recipe.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{recipe.cookingTime} mins</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                        <Button 
                          variant="outline" 
                          className="w-full mt-4 hover:bg-primary/5"
                          onClick={() => setActiveTab("recipes")}
                        >
                          View All Recipes
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <ChefHat className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h4 className="font-medium mb-2">No Recipes Yet</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Start exploring our collection of healthy recipes
                        </p>
                        <Button 
                          className="bg-primary hover:bg-primary/90"
                          asChild
                        >
                          <Link to="/recipe-finder">
                            Find Recipes
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </Card>

                  {/* Quick Stats */}
                  <Card className="p-6 bg-white border">
                    <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm">Meals Planned</span>
                        </div>
                        <span className="font-medium">{stats.plansCount}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                        <div className="flex items-center gap-2">
                          <ChefHat className="w-4 h-4 text-primary" />
                          <span className="text-sm">Recipes Saved</span>
                        </div>
                        <span className="font-medium">{stats.recipesCount}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-primary" />
                          <span className="text-sm">Days Active</span>
                        </div>
                        <span className="font-medium">{stats.daysActive}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="recipes">
                <Card className="border bg-white">
                  <SavedRecipes initialRecipes={recipes} />
                </Card>
              </TabsContent>

              <TabsContent value="meal-plans">
                <Card className="border bg-white">
                  <SavedMealPlans initialMealPlans={mealPlans} />
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const LoggedOutView = () => {
  return (
    <div className="space-y-24">
      <Hero />
      <Features />
      <SocialProof />
    </div>
  );
};

export default function Index() {
  const { user } = useAuth();

  return (
    <BaseLayout>
      <SEO 
        title="MySideChef - Your AI-Powered Kitchen Assistant"
        description="Get instant, personalized meal ideas based on your energy level and cravings. Plan meals, find recipes, and discover healthy alternatives with your AI kitchen assistant."
        keywords="meal planning, recipe finder, healthy cooking, AI kitchen assistant, meal suggestions, cooking tips, personalized meals"
        type="website"
        canonical="https://mysidechef.com"
        image="https://mysidechef.com/og-image-compressed.jpg"
      />
      <main>
        {user ? <LoggedInView /> : <LoggedOutView />}
      </main>
    </BaseLayout>
  );
}
