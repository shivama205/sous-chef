import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Brain, ChefHat, Utensils, Apple, Calendar, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { SEO } from "@/components/SEO";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { SocialProof } from "@/components/sections/social-proof";
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
    <Card className="h-full bg-white border hover:border-primary/20 hover:shadow-md transition-all group">
      <div className="p-4 flex flex-col gap-2">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  </Link>
);

const MobileQuickAction = ({ icon: Icon, title, to }: any) => (
  <Link 
    to={to}
    className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
  >
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <span className="text-xs font-medium">{title}</span>
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
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<SavedMealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"recipes" | "meal-plans">("recipes");

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        // Load user data in parallel
        const [recipesData, plansData] = await Promise.all([
          supabase
            .from("saved_recipes")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("saved_meal_plans")
            .select("*")
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
        setMealPlans(plansData.data || []);

      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const quickActions = [
    {
      icon: Brain,
      title: "Quick Ideas",
      description: "Get instant meal suggestions",
      to: "/meal-suggestions"
    },
    {
      icon: ChefHat,
      title: "Meal Plan",
      description: "Plan your weekly meals",
      to: "/meal-plan"
    },
    {
      icon: Utensils,
      title: "Find Recipes",
      description: "Search healthy recipes",
      to: "/recipe-finder"
    },
    {
      icon: Apple,
      title: "Healthy Swaps",
      description: "Find better alternatives",
      to: "/healthy-alternative"
    }
  ];

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
            Get started with quick actions or check your saved items
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Quick Actions - Desktop */}
          <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} {...action} />
            ))}
          </motion.div>

          {/* Content Tabs */}
          <div className="space-y-6">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value: "recipes" | "meal-plans") => setActiveTab(value)}>
              <div className="flex items-center justify-center sm:justify-start">
                <TabsList className="bg-white border w-full sm:w-auto">
                  <TabsTrigger 
                    value="recipes" 
                    className="flex-1 sm:flex-none data-[state=active]:bg-primary/5"
                  >
                    <ChefHat className="w-4 h-4 mr-2" />
                    Saved Recipes
                  </TabsTrigger>
                  <TabsTrigger 
                    value="meal-plans" 
                    className="flex-1 sm:flex-none data-[state=active]:bg-primary/5"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Meal Plans
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="recipes">
                <Card className="border bg-white">
                  {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <SavedRecipes initialRecipes={recipes} />
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="meal-plans">
                <Card className="border bg-white">
                  {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <SavedMealPlans initialMealPlans={mealPlans} />
                  )}
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
