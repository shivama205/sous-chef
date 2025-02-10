import { useState, useEffect, useMemo, useCallback } from "react";
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
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [isLoadingMealPlans, setIsLoadingMealPlans] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"recipes" | "meal-plans">("recipes");
  const [totalMealPlans, setTotalMealPlans] = useState(0);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [hasLoadedInitialRecipes, setHasLoadedInitialRecipes] = useState(false);
  const [currentRecipePage, setCurrentRecipePage] = useState(1);
  const [currentRecipeSearch, setCurrentRecipeSearch] = useState('');
  const [currentMealPlanPage, setCurrentMealPlanPage] = useState(1);
  const [currentMealPlanSearch, setCurrentMealPlanSearch] = useState('');
  const ITEMS_PER_PAGE = 6;

  const loadMealPlans = useCallback(async (page: number = 1, searchQuery: string = '') => {
    if (!user) return;
    
    try {
      setIsLoadingMealPlans(true);
      setError(null);
      setCurrentMealPlanPage(page);
      setCurrentMealPlanSearch(searchQuery);
      
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      // Get total count for pagination
      const { count } = await supabase
        .from('saved_meal_plans')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .ilike('name', `%${searchQuery}%`);

      // Get paginated data
      const { data: plansData, error: fetchError } = await supabase
        .from('saved_meal_plans')
        .select('id, name, created_at, plan')
        .eq('user_id', user.id)
        .ilike('name', `%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .range(start, end);

      if (fetchError) throw fetchError;

      setTotalMealPlans(count || 0);

      // Transform meal plans data
      const transformedMealPlans = (plansData || []).map(record => ({
        id: record.id,
        name: record.name || '',
        plan: record.plan || { days: [] },
        created_at: record.created_at
      }));

      setMealPlans(transformedMealPlans);
    } catch (error) {
      console.error("Error loading meal plans:", error);
      setError("Failed to load meal plans. Please try again.");
      setMealPlans([]);
      setTotalMealPlans(0);
    } finally {
      setIsLoadingMealPlans(false);
    }
  }, [user]);

  const loadRecipes = useCallback(async (page: number = 1, searchQuery: string = '') => {
    if (!user) return;
    
    try {
      setIsLoadingRecipes(true);
      setError(null);
      setCurrentRecipePage(page);
      setCurrentRecipeSearch(searchQuery);
      
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      // Get total count for pagination
      const { count } = await supabase
        .from('saved_recipes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .ilike('name', `%${searchQuery}%`);

      // Get paginated data
      const { data: recipesData, error: fetchError } = await supabase
        .from("saved_recipes")
        .select("*")
        .eq("user_id", user.id)
        .ilike('name', `%${searchQuery}%`)
        .order("created_at", { ascending: false })
        .range(start, end);

      if (fetchError) throw fetchError;

      setTotalRecipes(count || 0);

      // Transform recipes data
      const transformedRecipes = (recipesData || []).map(record => ({
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
    } catch (error) {
      console.error("Error loading recipes:", error);
      setError("Failed to load recipes. Please try again.");
      setRecipes([]);
      setTotalRecipes(0);
    } finally {
      setIsLoadingRecipes(false);
    }
  }, [user]);

  // Load initial recipes only once when the component mounts and user is available
  useEffect(() => {
    if (user && !hasLoadedInitialRecipes) {
      loadRecipes(1);
      setHasLoadedInitialRecipes(true);
    }
  }, [user, loadRecipes, hasLoadedInitialRecipes]);

  // Memoize props to prevent unnecessary re-renders
  const mealPlansProps = useMemo(() => ({
    initialMealPlans: mealPlans,
    totalItems: totalMealPlans,
    itemsPerPage: ITEMS_PER_PAGE,
    onPageChange: loadMealPlans,
    onRefresh: () => loadMealPlans(1),
    isLoading: isLoadingMealPlans,
    error,
    currentPage: currentMealPlanPage,
    searchQuery: currentMealPlanSearch
  }), [mealPlans, totalMealPlans, loadMealPlans, isLoadingMealPlans, error, currentMealPlanPage, currentMealPlanSearch]);

  const recipesProps = useMemo(() => ({
    initialRecipes: recipes,
    totalItems: totalRecipes,
    itemsPerPage: ITEMS_PER_PAGE,
    onPageChange: loadRecipes,
    onRefresh: () => loadRecipes(1),
    isLoading: isLoadingRecipes,
    error,
    currentPage: currentRecipePage,
    searchQuery: currentRecipeSearch
  }), [recipes, totalRecipes, loadRecipes, isLoadingRecipes, error, currentRecipePage, currentRecipeSearch]);

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
            <Tabs 
              defaultValue={activeTab} 
              value={activeTab} 
              onValueChange={(value: "recipes" | "meal-plans") => {
                setActiveTab(value);
                if (value === "meal-plans" && mealPlans.length === 0 && !error) {
                  loadMealPlans(1);
                }
              }}
            >
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
                  {isLoadingRecipes ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <SavedRecipes {...recipesProps} />
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="meal-plans">
                <Card className="border bg-white">
                  {isLoadingMealPlans ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <SavedMealPlans {...mealPlansProps} />
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
        description="Transform your cooking experience with AI-powered meal planning, instant recipe suggestions, and personalized healthy alternatives. Save time, eat better, and enjoy cooking with MySideChef."
        keywords="meal planning, recipe finder, healthy cooking, AI kitchen assistant, meal suggestions, cooking tips, personalized meals, diet planning, healthy recipes, smart meal planner"
        type="website"
        canonical="https://mysidechef.com"
        image="/og-image-compressed.jpg"
        author="MySideChef Team"
      />
      <main>
        {user ? <LoggedInView /> : <LoggedOutView />}
      </main>
    </BaseLayout>
  );
}
