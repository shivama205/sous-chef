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
import { HealthTip } from "./HealthTip";
import { ComingSoon } from "./ComingSoon";
import { Sparkles, ArrowRight } from "lucide-react";

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
        // Reset stats and activities on error
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
    return null; // Or a loading spinner
  }

  return (
    <div className="container mx-auto py-4 sm:py-8">
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-2 sm:pt-4"
        >
          <PageHeader
            icon={Sparkles}
            title={`Welcome back, ${user?.user_metadata?.full_name?.split(' ')[0] || 'User'}!`}
            description="Your personal AI-powered meal planning assistant"
            className="text-left"
          />
        </motion.div>

        {/* Health Tip of the Day */}
        <HealthTip />

        {/* Quick Actions */}
        <section className="space-y-2 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold">Quick Actions</h2>
          </div>
          <QuickActions />
        </section>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DashboardStats
            savedPlansCount={stats.savedPlansCount}
            savedRecipesCount={stats.savedRecipesCount}
            totalActivities={stats.totalActivities}
          />
        </motion.div>

        {/* Recent Activity */}
        <section className="space-y-2 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold">Recent Activity</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <RecentActivity activities={activities} />
        </section>

        {/* Coming Soon Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ComingSoon />
        </motion.div>
      </div>
    </div>
  );
}; 