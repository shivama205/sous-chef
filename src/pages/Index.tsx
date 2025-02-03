import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ComingSoon } from "@/components/dashboard/ComingSoon";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { HealthTip } from "@/components/dashboard/HealthTip";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Sparkles, 
  ChefHat, 
  ArrowRight, 
  Star,
  Utensils,
  Apple,
  Clock,
  Leaf
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Activity } from "@/types/activity";
import { SEO } from "@/components/SEO";
import { MealSuggester } from "@/components/home/MealSuggester";

const featureHighlights = [
  {
    icon: ChefHat,
    title: "AI Meal Planning",
    description: "Get personalized meal plans based on your preferences and dietary needs",
    path: "/meal-plan",
    gradient: "from-primary/20 to-primary/5"
  },
  {
    icon: Utensils,
    title: "Recipe Finder",
    description: "Find recipes that match your ingredients and preferences",
    path: "/recipe-finder",
    gradient: "from-primary/20 to-primary/5"
  },
  {
    icon: Leaf,
    title: "Healthy Alternatives",
    description: "Find healthy alternatives to your favorite recipes",
    path: "/healthy-alternative",
    gradient: "from-primary/20 to-primary/5"
  }
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Fitness Enthusiast",
    content: "SousChef has transformed how I plan my meals. The AI suggestions perfectly blend modern nutrition with traditional Indian cooking!"
  },
  {
    name: "Arjun Patel",
    role: "Busy Professional",
    content: "Finally, a meal planning app that understands my dietary preferences and busy schedule. Great for maintaining a healthy diet!"
  },
  {
    name: "Meera Desai",
    role: "Health Coach",
    content: "I recommend SousChef to all my clients. The healthy alternatives feature helps them make better choices while enjoying their favorite dishes."
  }
];

export default function Index() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    savedPlansCount: 0,
    savedRecipesCount: 0,
    totalActivities: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Handle user authentication
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user stats and activities when user is available
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

  const LoggedInView = () => (
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

        {/* Meal Suggester */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MealSuggester />
        </motion.div>

        {/* Health Tip of the Day */}
        <HealthTip />

        {/* Quick Actions with improved visuals */}
        <section className="space-y-2 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold">Quick Actions</h2>
          </div>
          <QuickActions />
        </section>

        {/* Stats Grid with animation */}
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

        {/* Recent Activity with improved header */}
        <section className="space-y-2 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold">Recent Activity</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <RecentActivity activities={activities} />
        </section>

        {/* Coming Soon with subtle animation */}
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

  const LoggedOutView = () => (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-4"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent pb-2">
            Your Personal AI Chef Assistant
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mt-6">
            Create personalized meal plans, discover healthy alternatives, and achieve your nutritional goals with AI-powered assistance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button 
              size="lg" 
              onClick={() => navigate('/meal-plan')}
              className="w-full sm:w-auto text-base"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/pricing')}
              className="w-full sm:w-auto text-base"
            >
              View Pricing
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Feature Highlights */}
      <section className="py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to Eat Better
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features to help you plan, cook, and maintain a healthy lifestyle
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {featureHighlights.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br border-0"
                onClick={() => navigate(feature.path)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 bg-accent/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Simple steps to your personalized meal plan</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Set Your Preferences",
                description: "Tell us about your dietary needs, restrictions, and goals"
              },
              {
                icon: ChefHat,
                title: "Get Your Plan",
                description: "Our AI creates a personalized meal plan just for you"
              },
              {
                icon: Star,
                title: "Start Cooking",
                description: "Follow easy recipes and track your progress"
              }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground">Join thousands of satisfied users</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-0">
                  <p className="text-muted-foreground mb-4">{testimonial.content}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 bg-primary/5 rounded-3xl">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Transform Your Meal Planning?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who have simplified their meal planning and achieved their health goals with SousChef.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/meal-plan')}
            className="text-base"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );

  return (
    <BaseLayout>
      <SEO 
        title="SousChef - AI-Powered Meal Planning Made Easy"
        description="Transform your eating habits with personalized AI-generated meal plans. Get healthy food alternatives, track nutrition, and achieve your health goals with SousChef."
        keywords={["meal planning", "healthy eating", "AI meal planner", "nutrition tracking", "healthy recipes", "diet planning"]}
        type="website"
      />
      {user ? <LoggedInView /> : <LoggedOutView />}
    </BaseLayout>
  );
}
