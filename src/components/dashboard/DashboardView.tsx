import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Activity } from "@/types/activity";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { QuickActions } from "./QuickActions";
import { DashboardStats } from "./DashboardStats";
import { RecentActivity } from "./RecentActivity";
import { ChefHat, Sparkles, Plus, Users } from "lucide-react";

interface DashboardViewProps {
  user: User;
}

export const DashboardView = ({ user }: DashboardViewProps) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    savedPlansCount: 0,
    savedRecipesCount: 0,
    totalActivities: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user stats and activities
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch saved plans in last week
        const { data: plans, error: plansError } = await supabase
          .from('saved_meal_plans')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });

        if (plansError) throw plansError;

        // Fetch saved recipes in last week
        const { data: recipes, error: recipesError } = await supabase
          .from('saved_recipes')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });

        if (recipesError) throw recipesError;

        // Fetch feature uses in last week
        const { data: activities, error: activitiesError } = await supabase
          .from('user_activity')
          .select('*')
          .eq('user_id', user.id)
          .eq('activity_type', 'feature_use')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });

        if (activitiesError) throw activitiesError;

        // Fetch recent activities
        const { data: recentActivities, error: recentError } = await supabase
          .from('user_activity')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentError) throw recentError;

        setStats({
          savedPlansCount: plans?.length || 0,
          savedRecipesCount: recipes?.length || 0,
          totalActivities: activities?.length || 0
        });
        setActivities(recentActivities || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setStats({
          savedPlansCount: 0,
          savedRecipesCount: 0,
          totalActivities: 0
        });
        setActivities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4 sm:px-6">
      <div className="space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-2 sm:pt-4"
        >
          <PageHeader
            icon={Sparkles}
            title={`Welcome back, ${user?.user_metadata?.full_name?.split(' ')[0] || 'Chef'}!`}
            description="Create, share, and discover amazing recipes with our community"
            className="text-left"
          />
        </motion.div>

        {/* Main Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Button
            size="lg"
            className="h-32 relative overflow-hidden group"
            onClick={() => navigate('/create-recipe')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 group-hover:scale-105 transition-transform duration-300" />
            <div className="relative flex flex-col items-center gap-2">
              <ChefHat className="w-8 h-8" />
              <div className="text-center">
                <h3 className="font-semibold text-lg">Create Recipe</h3>
                <p className="text-sm text-muted-foreground">Share your culinary creations</p>
              </div>
            </div>
          </Button>

          <Button
            size="lg"
            className="h-32 relative overflow-hidden group"
            onClick={() => navigate('/meal-plan')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-secondary/5 group-hover:scale-105 transition-transform duration-300" />
            <div className="relative flex flex-col items-center gap-2">
              <Plus className="w-8 h-8" />
              <div className="text-center">
                <h3 className="font-semibold text-lg">Create Meal Plan</h3>
                <p className="text-sm text-muted-foreground">Plan your weekly meals</p>
              </div>
            </div>
          </Button>
        </motion.div>

        {/* Community Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-lg p-6 border shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Community Highlights</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/community')}>
              View All
            </Button>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            Connect with other chefs and discover new recipes from our growing community.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Placeholder for community content */}
            <div className="h-32 rounded-lg bg-accent/5 border flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Coming Soon</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DashboardStats
            savedPlansCount={stats.savedPlansCount}
            savedRecipesCount={stats.savedRecipesCount}
            totalActivities={stats.totalActivities}
          />
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <RecentActivity activities={activities} />
        </motion.div>
      </div>
    </div>
  );
};