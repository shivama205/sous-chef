import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ComingSoon } from "@/components/dashboard/ComingSoon";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Sparkles, Star, ChefHat, Brain, Carrot } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Feature highlights data
const featureHighlights = [
  {
    icon: ChefHat,
    title: "AI Meal Planning",
    description: "Get personalized meal plans tailored to your preferences and goals",
    path: "/meal-plan"
  },
  {
    icon: Brain,
    title: "Smart Alternatives",
    description: "Discover healthy alternatives to your favorite dishes",
    path: "/healthy-alternative"
  },
  {
    icon: Carrot,
    title: "Nutrition Tracking",
    description: "Track your nutrition goals with our smart macro calculator",
    path: "/meal-plan"
  }
];

// Testimonials data
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Fitness Enthusiast",
    content: "SousChef has transformed how I plan my meals. The AI suggestions are spot-on!"
  },
  {
    name: "Mike Chen",
    role: "Busy Professional",
    content: "Finally, a meal planning app that understands my dietary restrictions and schedule."
  },
  {
    name: "Emma Davis",
    role: "Health Coach",
    content: "I recommend SousChef to all my clients. The healthy alternatives feature is amazing!"
  }
];

export default function Index() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [stats, setStats] = useState({
    savedPlansCount: 0,
    creditsUsed: 0,
    maxCredits: 10
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchRecentActivity();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;
    
    try {
      const { data: plans } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id);

      setStats({
        savedPlansCount: plans?.length || 0,
        creditsUsed: 0,
        maxCredits: 0
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('feature_analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('used_at', { ascending: false })
        .limit(5);

      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const LoggedInView = () => (
    <div className="container mx-auto py-8 sm:py-10">
      <div className="space-y-8 px-4 sm:px-6">
        <div className="pt-4">
          <PageHeader
            icon={Sparkles}
            title={`Welcome back, ${user?.user_metadata?.full_name || 'User'}!`}
            description="Your personal AI-powered meal planning assistant"
            className="text-left"
          />
        </div>

        {/* Quick Actions */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <QuickActions />
        </section>

        {/* Stats Grid */}
        <DashboardStats
          savedPlansCount={stats.savedPlansCount}
          totalFeatureUsage={stats.creditsUsed}
        />

        {/* Recent Activity */}
        <RecentActivity activities={activities} />

        {/* Coming Soon */}
        <ComingSoon />
      </div>
    </div>
  );

  const LoggedOutView = () => (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Your Personal AI Chef
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            Create personalized meal plans, discover healthy alternatives, and achieve your nutritional goals with AI-powered assistance.
          </p>
        </motion.div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            onClick={() => navigate('/meal-plan')}
            className="w-full sm:w-auto"
          >
            Create Your Meal Plan
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate('/healthy-alternative')}
            className="w-full sm:w-auto"
          >
            Try Healthy Alternatives
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Discover Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureHighlights.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                onClick={() => navigate(feature.path)}
                className="h-full cursor-pointer hover:shadow-lg transition-shadow duration-200"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-gray-600 mb-4">{testimonial.content}</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <BaseLayout>
      {user ? <LoggedInView /> : <LoggedOutView />}
    </BaseLayout>
  );
}
