import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Leaf, 
  Apple, 
  Users, 
  ChefHat,
  Star,
  Package as PackageIcon,
  CalendarCheck,
  History,
  ArrowUpRight,
  Sparkles,
  Calculator
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { StatsCard } from "@/components/ui/StatsCard";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SavedMealPlan {
  id: string;
  name: string;
  created_at: string;
}

interface UserMetrics {
  savedPlans: number;
  recentPlans: SavedMealPlan[];
  currentPlan: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null;
}

const features = [
  {
    icon: PackageIcon,
    title: "Personalized Meal Plans",
    description: "Get AI-powered meal plans tailored to your dietary preferences and nutritional goals"
  },
  {
    icon: Leaf,
    title: "Healthy Alternatives",
    description: "Discover healthier versions of your favorite meals without compromising on taste"
  },
  {
    icon: Apple,
    title: "Nutritional Tracking",
    description: "Track your daily nutritional intake with detailed breakdowns of macros and calories"
  }
];

const testimonials = [
  {
    name: "Priya R.",
    role: "Fitness Enthusiast",
    content: "This app has transformed how I plan my meals. The AI suggestions are spot-on!"
  },
  {
    name: "Rahul M.",
    role: "Busy Professional",
    content: "Finally, an app that makes healthy eating simple and achievable."
  },
  {
    name: "Anjali S.",
    role: "Health Coach",
    content: "I recommend this to all my clients. The meal plans are fantastic!"
  }
];

const featureHighlights = [
  {
    icon: ChefHat,
    title: "AI-Powered Meal Planning",
    description: "Get personalized meal plans tailored to your preferences and nutritional goals",
    cta: "Create Plan",
    path: "/meal-plan"
  },
  {
    icon: Leaf,
    title: "Healthy Alternatives",
    description: "Transform your favorite meals into nutritious versions without sacrificing taste",
    cta: "Find Alternatives",
    path: "/healthy-alternative"
  },
  {
    icon: Users,
    title: "Community & Sharing",
    description: "Share your meal plans and discover recipes from other health enthusiasts",
    cta: "Join Community",
    path: "/blog"
  }
];

function Index() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [metrics, setMetrics] = useState<UserMetrics>({
    savedPlans: 0,
    recentPlans: [],
    currentPlan: 'BASIC',
    macros: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setIsLoading(true);
        try {
          // Fetch user metrics
          const [savedPlansResult, recentPlansResult, userCreditsResult, macrosResult] = await Promise.all([
            supabase
              .from('saved_meal_plans')
              .select('*', { count: 'exact' })
              .eq('user_id', session.user.id),
            supabase
              .from('saved_meal_plans')
              .select('id, name, created_at')
              .eq('user_id', session.user.id)
              .order('created_at', { ascending: false })
              .limit(2),
            supabase
              .from('user_credits')
              .select('pricing_plan_id')
              .eq('user_id', session.user.id)
              .single(),
            supabase
              .from('user_macros')
              .select('calories, protein, carbs, fat')
              .eq('user_id', session.user.id)
              .single()
          ]);

          setMetrics({
            savedPlans: savedPlansResult.count ?? 0,
            recentPlans: recentPlansResult.data ?? [],
            currentPlan: userCreditsResult.data?.pricing_plan_id ?? 'BASIC',
            macros: macrosResult.data
          });
        } catch (error) {
          console.error('Error fetching metrics:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getUser();
  }, []);

  const LoggedInView = () => (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h1 className="text-xl font-medium text-foreground/80 mb-2">Welcome back, {user?.user_metadata.full_name}!</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">Track your progress and manage your meal plans</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          icon={CalendarCheck}
          label="Saved Meal Plans"
          value={metrics.savedPlans}
          subtext="Click to view all"
          onClick={() => navigate('/profile')}
        />
        {metrics.macros && (
          <StatsCard
            icon={Calculator}
            label="Daily Calories"
            value={metrics.macros.calories}
            subtext="Click to recalculate"
            onClick={() => navigate('/meal-plan')}
          />
        )}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              Current Plan
              <Badge variant="secondary" className="ml-auto">
                {metrics.currentPlan}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/pricing')}
              className="w-full"
            >
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <History className="w-4 h-4 text-primary" />
            </div>
            Recent Meal Plans
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {metrics.recentPlans.map(plan => (
            <div 
              key={plan.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/meal-plan/${plan.id}`)}
            >
              <div>
                <p className="font-medium">{plan.name || 'Untitled Plan'}</p>
                <p className="text-sm text-gray-500">
                  {new Date(plan.created_at).toLocaleDateString()}
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
          {metrics.recentPlans.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No meal plans created yet. Create your first plan now!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const LoggedOutView = () => (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Your Personal AI Chef
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create personalized meal plans, discover healthy alternatives, and achieve your nutritional goals with AI-powered assistance.
        </p>
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
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
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

      {/* CTA Section */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold">Ready to Start Your Journey?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join thousands of users who have transformed their eating habits with SousChef.
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate('/meal-plan')}
          className="w-full sm:w-auto"
        >
          Get Started Now
        </Button>
      </section>
    </div>
  );

  return (
    <BaseLayout>
      {user ? <LoggedInView /> : <LoggedOutView />}
    </BaseLayout>
  );
}

export default Index;
