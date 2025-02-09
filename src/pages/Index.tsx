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

const LoggedInView = () => {
  const { user } = useAuth();
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [stats, setStats] = useState({
    plansCount: 0,
    recipesCount: 0,
    daysActive: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        // Load user stats and recent data in parallel
        const [recipes, plans, activityData] = await Promise.all([
          getUserRecipes(user.id),
          getUserMealPlans(user.id),
          supabase
            .from("user_activity")
            .select("created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
        ]);

        // Set recent recipes (up to 3)
        setRecentRecipes(recipes.slice(0, 3));

        // Set stats
        setStats({
          recipesCount: recipes.length,
          plansCount: plans.length,
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
                    asChild
                  >
                    <Link to="/recipe-finder">
                      Find More Recipes
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
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
