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

interface SavedRecipeRecord {
  id: string;
  name: string;
  description: string;
  cooking_time: number;
  ingredients: string[];
  instructions: string[];
  nutritional_value: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  image_url: string | null;
  cuisine_type: string;
  difficulty: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface SavedMealPlanRecord {
  id: string;
  name: string;
  plan: MealPlan;
  created_at: string;
  user_id: string;
}

interface UseDataLoaderProps {
  user: any;
  type: 'recipes' | 'meal-plans';
}

type DataLoaderState = {
  recipes: {
    data: Recipe[];
    type: 'recipes';
  };
  'meal-plans': {
    data: SavedMealPlan[];
    type: 'meal-plans';
  };
};

const useDataLoader = <T extends 'recipes' | 'meal-plans'>({ 
  user, 
  type,
}: UseDataLoaderProps) => {
  const [data, setData] = useState<DataLoaderState[T]['data']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState('');
  const ITEMS_PER_PAGE = 6;

  const loadData = useCallback(async (page: number = 1, searchQuery: string = '', sortBy: string = 'date') => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setCurrentPage(page);
      setCurrentSearch(searchQuery);
      
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const table = type === 'recipes' ? 'saved_recipes' : 'saved_meal_plans';
      const orderColumn = sortBy === 'date' ? 'created_at' : 
                         sortBy === 'name' ? 'name' :
                         sortBy === 'time' ? 'cooking_time' : 'created_at';

      // Get total count
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .ilike('name', `%${searchQuery}%`);

      // Get paginated data
      if (type === 'recipes') {
        const { data: items, error: fetchError } = await supabase
          .from('saved_recipes')
          .select('*')
          .eq('user_id', user.id)
          .ilike('name', `%${searchQuery}%`)
          .order(orderColumn, { ascending: sortBy === 'name' })
          .range(start, end);

        if (fetchError) throw fetchError;
        setTotalItems(count || 0);

        const transformedRecipes = (items as SavedRecipeRecord[] || []).map(record => ({
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
        setData(transformedRecipes as DataLoaderState[T]['data']);
      } else {
        const { data: items, error: fetchError } = await supabase
          .from('saved_meal_plans')
          .select('id, name, created_at, plan')
          .eq('user_id', user.id)
          .ilike('name', `%${searchQuery}%`)
          .order(orderColumn, { ascending: sortBy === 'name' })
          .range(start, end);

        if (fetchError) throw fetchError;
        setTotalItems(count || 0);

        const transformedMealPlans = (items as SavedMealPlanRecord[] || []).map(record => ({
          id: record.id,
          name: record.name || '',
          plan: record.plan || { days: [] },
          created_at: record.created_at
        }));
        setData(transformedMealPlans as DataLoaderState[T]['data']);
      }
    } catch (error) {
      console.error(`Error loading ${type}:`, error);
      setError(`Failed to load ${type}. Please try again.`);
      setData([] as DataLoaderState[T]['data']);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [user, type]);

  return {
    data,
    isLoading,
    error,
    totalItems,
    currentPage,
    currentSearch,
    loadData,
    ITEMS_PER_PAGE
  };
};

const LoggedInView = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"recipes" | "meal-plans">("recipes");
  const [hasLoadedInitialRecipes, setHasLoadedInitialRecipes] = useState(false);

  const {
    data: recipes,
    isLoading: isLoadingRecipes,
    error: recipesError,
    totalItems: totalRecipes,
    currentPage: currentRecipePage,
    currentSearch: currentRecipeSearch,
    loadData: loadRecipes,
    ITEMS_PER_PAGE
  } = useDataLoader<'recipes'>({ 
    user, 
    type: 'recipes'
  });

  const {
    data: mealPlans,
    isLoading: isLoadingMealPlans,
    error: mealPlansError,
    totalItems: totalMealPlans,
    currentPage: currentMealPlanPage,
    currentSearch: currentMealPlanSearch,
    loadData: loadMealPlans
  } = useDataLoader<'meal-plans'>({ 
    user, 
    type: 'meal-plans'
  });

  // Load initial recipes only once
  useEffect(() => {
    if (user && !hasLoadedInitialRecipes) {
      loadRecipes(1);
      setHasLoadedInitialRecipes(true);
    }
  }, [user, loadRecipes, hasLoadedInitialRecipes]);

  // Memoize props
  const recipesProps = useMemo(() => ({
    initialRecipes: recipes as Recipe[],
    totalItems: totalRecipes,
    itemsPerPage: ITEMS_PER_PAGE,
    onPageChange: loadRecipes,
    onRefresh: () => loadRecipes(1),
    isLoading: isLoadingRecipes,
    error: recipesError,
    currentPage: currentRecipePage,
    searchQuery: currentRecipeSearch
  }), [recipes, totalRecipes, loadRecipes, isLoadingRecipes, recipesError, currentRecipePage, currentRecipeSearch]);

  const mealPlansProps = useMemo(() => ({
    initialMealPlans: mealPlans as SavedMealPlan[],
    totalItems: totalMealPlans,
    itemsPerPage: ITEMS_PER_PAGE,
    onPageChange: loadMealPlans,
    onRefresh: () => loadMealPlans(1),
    isLoading: isLoadingMealPlans,
    error: mealPlansError,
    currentPage: currentMealPlanPage,
    searchQuery: currentMealPlanSearch
  }), [mealPlans, totalMealPlans, loadMealPlans, isLoadingMealPlans, mealPlansError, currentMealPlanPage, currentMealPlanSearch]);

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
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <picture>
          <source
            srcSet="/assets/hero-bg.webp"
            type="image/webp"
          />
          <img
            src="/assets/hero-bg.jpg"
            alt=""
            role="presentation"
            loading="eager"
            decoding="async"
            width="1920"
            height="1080"
            className="absolute inset-0 w-full h-full object-cover opacity-[0.15]"
            onError={(e) => {
              console.error('Error loading image:', e);
              e.currentTarget.style.display = 'none';
            }}
          />
        </picture>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Welcome Message */}
          <motion.div variants={item} className="text-center max-w-2xl mx-auto mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-3">
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
            className="space-y-6"
          >
            {/* Quick Actions - Desktop */}
            <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <QuickActionCard key={index} {...action} />
              ))}
            </motion.div>

            {/* Content Tabs */}
            <div className="space-y-4">
              <Tabs 
                defaultValue={activeTab} 
                value={activeTab} 
                onValueChange={(value: "recipes" | "meal-plans") => {
                  setActiveTab(value);
                  if (value === "meal-plans" && mealPlans.length === 0 && !mealPlansError) {
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
    </div>
  );
};

const LoggedOutView = () => {
  return (
    <div className="relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <picture>
          <source
            srcSet="/assets/hero-bg.webp"
            type="image/webp"
          />
          <img
            src="/assets/hero-bg.jpg"
            alt=""
            role="presentation"
            loading="eager"
            decoding="async"
            width="1920"
            height="1080"
            className="absolute inset-0 w-full h-full object-cover opacity-[0.15]"
            onError={(e) => {
              console.error('Error loading image:', e);
              e.currentTarget.style.display = 'none';
            }}
          />
        </picture>
      </div>

      <div className="relative z-10 space-y-8">
        <Hero />
        <Features />
        <SocialProof />
      </div>
    </div>
  );
};

export default function Index() {
  const { user } = useAuth();

  return (
    <BaseLayout>
      <SEO 
        title="MySideChef - Healthy Eating Made Simple, Fun, and Tailored Just for You"
        description="Say goodbye to decision fatigue! Get personalized meal suggestions, healthy swaps, and easy recipes to kickstart your healthy eating journey. Transform your cooking experience with AI-powered meal planning and personalized healthy alternatives."
        keywords="healthy eating, personalized meals, meal suggestions, healthy swaps, easy recipes, meal planning, healthy cooking, AI kitchen assistant, personalized nutrition, healthy alternatives"
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
