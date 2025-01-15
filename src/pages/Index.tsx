import { useNavigate } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";
import { motion } from "framer-motion";
import { Leaf, Apple, Sparkles, Users, Star, Package, ArrowRight, ChefHat, Coins, CalendarCheck, Repeat, Save, Lightbulb, Settings, CircleDot, Circle, ShoppingCart, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { createClient, PostgrestError } from '@supabase/supabase-js';

interface PricingPlan {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  credits_per_month: number;
  is_popular: boolean;
  sort_order: number;
}

interface UserCredits {
  credits_available: number;
  credits_used: number;
  pricing_plans?: {
    id: string;
    slug: string;
    name: string;
    description: string;
    credits_per_month: number;
    features: string[];
  };
}

const features = [
  {
    icon: <Package className="w-6 h-6" />,
    title: "Personalized Meal Plans",
    description: "Get AI-powered meal plans tailored to your dietary preferences and nutritional goals"
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: "Healthy Alternatives",
    description: "Discover healthier versions of your favorite meals without compromising on taste"
  },
  {
    icon: <Apple className="w-6 h-6" />,
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

const upcomingFeatures = [
  "Recipe customization based on available ingredients",
  "Integration with grocery delivery services",
  "Mobile app with offline meal planning",
  "Community recipe sharing platform"
];

export function Index() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [creditsAvailable, setCreditsAvailable] = useState(0);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [subscriptionTier, setSubscriptionTier] = useState<'BASIC' | 'STANDARD' | 'PREMIUM'>('BASIC');
  const [savedPlansCount, setSavedPlansCount] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState<{
    plansCreated: number;
    healthySwaps: number;
  }>({
    plansCreated: 0,
    healthySwaps: 0
  });
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "meal_plan" as const,
      description: "Created a new meal plan",
      date: "2 hours ago"
    },
    {
      id: 2,
      type: "healthy_swap" as const,
      description: "Found alternative for pasta",
      date: "Yesterday"
    }
  ]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setIsLoading(true);

        try {
          // First check and initialize credits if needed
          const { data: userCredits, error: creditsError } = await supabase
            .from('user_credits')
            .select('credits_available, credits_used, pricing_plan_id')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (creditsError) {
            console.error('Error fetching user credits:', creditsError);
            return;
          }

          if (!userCredits) {
            // First fetch the BASIC plan
            const { data: basicPlan, error: planError } = await supabase
              .from('pricing_plans')
              .select('id, credits_per_month')
              .eq('slug', 'BASIC')
              .single();

            if (planError) {
              console.error('Error fetching BASIC plan:', planError);
              return;
            }

            // Initialize user credits with BASIC plan
            const { error: insertError } = await supabase
              .from('user_credits')
              .insert({
                user_id: session.user.id,
                credits_available: basicPlan.credits_per_month,
                credits_used: 0,
                pricing_plan_id: basicPlan.id
              });

            if (insertError) {
              console.error('Error initializing user credits:', insertError);
              return;
            }

            // Set the initial state values
            setCreditsAvailable(basicPlan.credits_per_month);
            setCreditsUsed(0);
            setSubscriptionTier('BASIC');
          } else {
            setCreditsAvailable(userCredits.credits_available);
            setCreditsUsed(userCredits.credits_used);
            // Set the current plan info
            if (userCredits.pricing_plan_id) {
              const { data: pricingPlan, error: planError } = await supabase
                .from('pricing_plans')
                .select('slug')
                .eq('id', userCredits.pricing_plan_id)
                .single();

              if (planError) {
                console.error('Error fetching pricing plan:', planError);
                return;
              }

              setSubscriptionTier(pricingPlan?.slug as 'BASIC' | 'STANDARD' | 'PREMIUM');
            }
          }

          // After credits are initialized, fetch other metrics
          const lastWeek = new Date();
          lastWeek.setDate(lastWeek.getDate() - 7);
          
          const [weeklyPlansResult, weeklySwapsResult, totalPlansResult] = await Promise.all([
            supabase
              .from('saved_meal_plans')
              .select('*', { count: 'exact' })
              .eq('user_id', session.user.id)
              .gte('created_at', lastWeek.toISOString()),

            supabase
              .from('healthy_swaps')
              .select('*', { count: 'exact' })
              .eq('user_id', session.user.id)
              .gte('created_at', lastWeek.toISOString()),

            supabase
              .from('saved_meal_plans')
              .select('*', { count: 'exact' })
              .eq('user_id', session.user.id)
          ]);

          setSavedPlansCount(totalPlansResult.count ?? 0);
          setWeeklyStats({
            plansCreated: weeklyPlansResult.count ?? 0,
            healthySwaps: weeklySwapsResult.count ?? 0
          });
        } catch (error) {
          console.error('Error:', error);
          toast({
            title: "Error",
            description: "Something went wrong. Please refresh the page.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    getUser();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setSavedPlansCount(0);
        setCreditsUsed(0);
        setCreditsAvailable(0);
        setSubscriptionTier('BASIC');
        setWeeklyStats({
          plansCreated: 0,
          healthySwaps: 0
        });
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchPricingPlans = async () => {
      setIsLoadingPlans(true);
      try {
        const { data: plans, error } = await supabase
          .from('pricing_plans')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setPricingPlans(plans || []);
      } catch (error) {
        console.error('Error fetching pricing plans:', error);
        toast({
          title: "Error",
          description: "Failed to load pricing information. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingPlans(false);
      }
    };

    fetchPricingPlans();
  }, []);

  const LoggedInView = () => (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {/* Welcome & Plan Status Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <ChefHat className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Welcome back, {user?.user_metadata.full_name}!</CardTitle>
                    <p className="text-sm text-muted-foreground">Here's your dashboard overview</p>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <h3 className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Star className="w-4 h-4 text-primary" />
                    </div>
                    Current Plan
                  </h3>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold capitalize">
                        {pricingPlans.find(plan => plan.slug === subscriptionTier)?.name || 'Basic Plan'}
                      </p>
                      <Badge variant="outline" className="capitalize">
                        {subscriptionTier === 'BASIC' ? 'Limited' : 'Unlimited'}
                      </Badge>
                    </div>
                    {subscriptionTier === 'BASIC' && pricingPlans.length > 0 && (
                      <Button
                        onClick={() => navigate('/pricing')}
                        variant="ghost"
                        size="sm"
                        className="w-full text-sm text-muted-foreground hover:text-primary hover:bg-primary/5"
                      >
                        Upgrade to get {pricingPlans.find(plan => plan.slug === 'STANDARD')?.credits_per_month} credits/month{' '}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                  <h3 className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Coins className="w-4 h-4 text-secondary" />
                    </div>
                    Credits
                  </h3>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <CircleDot className="w-3 h-3 text-secondary" />
                        <span className="text-muted-foreground">Used</span>
                      </div>
                      <span className="font-medium">{creditsUsed}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary/10 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-secondary to-secondary/80 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(creditsUsed / (creditsAvailable + creditsUsed)) * 100}%`
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Circle className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Remaining</span>
                      </div>
                      <span className="font-medium">{creditsAvailable}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg group hover:bg-primary/5 transition-colors duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                    <CalendarCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Plans Created</h3>
                    <p className="text-xl font-semibold text-primary">{weeklyStats.plansCreated}</p>
                    <span className="text-xs text-muted-foreground">This week</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg group hover:bg-secondary/5 transition-colors duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors duration-200">
                    <Repeat className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Healthy Swaps</h3>
                    <p className="text-xl font-semibold text-secondary">{weeklyStats.healthySwaps}</p>
                    <span className="text-xs text-muted-foreground">This week</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg group hover:bg-primary/5 transition-colors duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                    <Save className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Total Plans</h3>
                    <p className="text-xl font-semibold text-primary">{savedPlansCount}</p>
                    <span className="text-xs text-muted-foreground">All time</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips & Coming Soon */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Healthy Tips */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg group hover:bg-primary/5 transition-colors duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                    <Lightbulb className="w-4 h-4 text-primary" />
                  </div>
                  Healthy Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors duration-200">
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-1">
                    <Leaf className="w-4 h-4 text-primary" />
                    Meal Prep Success
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Prepare ingredients in advance for easier weekday cooking.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/10 hover:bg-secondary/10 transition-colors duration-200">
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-1">
                    <Apple className="w-4 h-4 text-green-500" />
                    Smart Substitutions
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Try cauliflower rice for a low-carb alternative.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Coming Soon */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Exciting New Features Coming Soon
                  </span>
                </CardTitle>
                <CardDescription>We're working on these amazing features to enhance your experience</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors duration-200">
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Settings className="w-4 h-4 text-primary" />
                    <span className="text-primary">Smart Recipe Customization</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Customize recipes based on ingredients you have in your kitchen. Our AI will suggest creative alternatives.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10 hover:bg-secondary/10 transition-colors duration-200">
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-secondary" />
                    <span className="text-secondary">Community Recipe Sharing</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Share your favorite recipes and meal plans with the community. Discover new ideas from other health enthusiasts.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors duration-200">
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                    <ShoppingCart className="w-4 h-4 text-primary" />
                    <span className="text-primary">Smart Grocery Lists</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate optimized shopping lists from your meal plans with smart categorization.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10 hover:bg-secondary/10 transition-colors duration-200">
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Smartphone className="w-4 h-4 text-secondary" />
                    <span className="text-secondary">Mobile App</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Take SousChef with you everywhere. Plan meals, track nutrition, and shop for ingredients on the go.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );

  const LoggedOutView = () => (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Make Healthy Eating Simple
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Transform your eating habits with personalized meal plans and healthy alternatives. 
              We help you make better food choices without compromising on taste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate("/meal-plan")}
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all duration-200 animate-fade-in"
              >
                Create Meal Plan
              </Button>
              <Button
                onClick={() => navigate("/pricing")}
                variant="secondary"
                className="text-lg px-8 py-6 bg-gradient-to-r from-secondary to-secondary/80 hover:opacity-90 transition-all duration-200 animate-fade-in"
              >
                View Pricing
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative grid grid-cols-3 gap-6"
          >
            <motion.div
              className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl flex flex-col items-center text-center gap-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-gray-600">AI-Powered Meal Planning</p>
            </motion.div>
            <motion.div
              className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl flex flex-col items-center text-center gap-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Apple className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-sm font-medium text-gray-600">Healthy Alternatives</p>
            </motion.div>
            <motion.div
              className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl flex flex-col items-center text-center gap-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-sm font-medium text-gray-600">Nutritional Tracking</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white/50 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Why Choose SousChef?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform makes healthy eating accessible and enjoyable for everyone
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-12 h-12 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              What Our Users Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm shadow-xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ready to Start Your Healthy Journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of users who have transformed their eating habits with SousChef
            </p>
            <Button
              onClick={() => navigate("/meal-plan")}
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all duration-200"
            >
              Get Started Now <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );

  return user ? <LoggedInView /> : <LoggedOutView />;
}

export default Index;
