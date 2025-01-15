import { useNavigate } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";
import { motion } from "framer-motion";
import { Leaf, Salad, Apple, CheckCircle2, Sparkles, Users, Star, Package, ArrowRight, ChefHat } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    name: "Tasya Z.",
    role: "Fitness Enthusiast",
    content: "This app has transformed how I plan my meals. The AI suggestions are spot-on!"
  },
  {
    name: "Vivek N.",
    role: "Busy Professional",
    content: "Finally, an app that makes healthy eating simple and achievable."
  },
  {
    name: "Lisa M.",
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

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [savedPlansCount, setSavedPlansCount] = useState(0);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [creditsAvailable, setCreditsAvailable] = useState(0);
  const [subscriptionTier, setSubscriptionTier] = useState<string>('free');
  const [weeklyStats, setWeeklyStats] = useState({
    plansCreated: 0,
    healthySwaps: 0
  });
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setIsLoading(true);
        
        // Get the date 7 days ago
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        // Fetch weekly meal plans count
        const { count: weeklyPlans } = await supabase
          .from('saved_meal_plans')
          .select('*', { count: 'exact' })
          .eq('user_id', session.user.id)
          .gte('created_at', lastWeek.toISOString());

        // Fetch weekly healthy swaps count
        const { count: weeklySwaps } = await supabase
          .from('healthy_swaps')
          .select('*', { count: 'exact' })
          .eq('user_id', session.user.id)
          .gte('created_at', lastWeek.toISOString());
          
        // Fetch total saved plans count
        const { count: totalPlans } = await supabase
          .from('saved_meal_plans')
          .select('*', { count: 'exact' })
          .eq('user_id', session.user.id);
          
        // Fetch credits and subscription
        const { data: credits } = await supabase
          .from('user_credits')
          .select('credits_available, credits_used')
          .eq('user_id', session.user.id)
          .single();

        if (credits) {
          setCreditsUsed(credits.credits_used);
          setCreditsAvailable(credits.credits_available);
        }

        setSavedPlansCount(totalPlans ?? 0);
        setWeeklyStats({
          plansCreated: weeklyPlans ?? 0,
          healthySwaps: weeklySwaps ?? 0
        });
        setIsLoading(false);
      }
    };

    getUser();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setSavedPlansCount(0);
        setCreditsUsed(0);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getNextTier = (currentTier: string) => {
    switch (currentTier) {
      case 'free':
        return { name: 'Pro', features: 'unlimited meal plans' };
      case 'pro':
        return { name: 'Premium', features: 'advanced customization' };
      default:
        return null;
    }
  };

  const LoggedInView = () => (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Welcome Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex flex-col space-y-4">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <ChefHat className="w-6 h-6 text-secondary" />
                    Welcome back, {user?.user_metadata.full_name}!
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Your personal AI chef is ready to help you eat healthier
                  </CardDescription>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
                    <Package className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>
                          <span className="font-medium text-primary">Current Plan: </span>
                          <span className="capitalize">{subscriptionTier}</span>
                        </span>
                        {getNextTier(subscriptionTier) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/pricing")}
                            className="h-7 text-xs text-secondary hover:text-secondary/80"
                          >
                            Upgrade
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </div>
                      {getNextTier(subscriptionTier) && (
                        <div className="text-xs mt-0.5">
                          Upgrade to {getNextTier(subscriptionTier)?.name} for {getNextTier(subscriptionTier)?.features}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/5 p-3 rounded-lg border border-secondary/10">
                    <Sparkles className="w-4 h-4 text-secondary flex-shrink-0" />
                    <div>
                      <span>
                        <span className="font-medium text-primary">{creditsAvailable} credits</span> available
                      </span>
                      <div className="text-xs mt-0.5">
                        Each meal plan or healthy swap uses 1 credit
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Credit Status */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  Your Credit Balance
                </CardTitle>
                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div>
                    <div className="text-3xl font-bold text-primary">{creditsAvailable}</div>
                    <p className="text-sm text-muted-foreground">Available Credits</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-secondary">{creditsUsed}</div>
                    <p className="text-sm text-muted-foreground">Credits Used</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Weekly Activity */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  This Week's Activity
                </CardTitle>
                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div>
                    <div className="text-3xl font-bold text-primary">{weeklyStats.plansCreated}</div>
                    <p className="text-sm text-muted-foreground">Meal Plans Created</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-secondary">
                      {weeklyStats.healthySwaps}
                    </div>
                    <p className="text-sm text-muted-foreground">Healthy Alternatives</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Quick Actions and Tips */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Button
                  onClick={() => navigate("/meal-plan")}
                  className="w-full h-11 justify-start bg-gradient-to-r from-primary to-primary/80 text-white hover:opacity-90"
                >
                  <ChefHat className="w-4 h-4 mr-2" />
                  Generate New Meal Plan
                </Button>
                <Button
                  onClick={() => navigate("/healthy-swap")}
                  className="w-full h-11 justify-start bg-gradient-to-r from-secondary to-secondary/80 text-primary hover:opacity-90"
                >
                  <Apple className="w-4 h-4 mr-2" />
                  Find Healthy Alternatives
                </Button>
                <Button
                  onClick={() => navigate("/meal-plans")}
                  variant="outline"
                  className="w-full h-11 justify-start border-primary text-primary hover:bg-primary/5"
                >
                  <Package className="w-4 h-4 mr-2" />
                  View My Meal Plans
                </Button>
              </CardContent>
            </Card>

            {/* Tips and Recommendations */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-secondary" />
                  Healthy Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-secondary" />
                    Meal Planning Tips
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Plan your meals for the week ahead to save time and maintain a balanced diet.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Apple className="w-4 h-4 text-primary" />
                    Healthy Swaps
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Try replacing refined grains with whole grains for more nutrients and fiber.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Announcements */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                Coming Soon
              </CardTitle>
              <CardDescription>
                Exciting new features on the horizon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Recipe Customization</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Customize meal plans based on available ingredients in your kitchen
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-secondary/5 to-primary/5 border border-secondary/10">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Community Features</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Share and discover recipes with our growing community
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Salad className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Smart Grocery Lists</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Automatically generate shopping lists from your meal plans
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-secondary/5 to-primary/5 border border-secondary/10">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Premium Features</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Advanced customization options coming to Pro users
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
                <ChefHat className="w-6 h-6 text-primary" />
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
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary" />
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
        </div>
      </section>

      {/* Coming Soon Section */}
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
              Coming Soon
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Exciting new features on the horizon
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid gap-4 sm:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Recipe Customization</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Customize meal plans based on available ingredients in your kitchen
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-secondary/5 to-primary/5 border border-secondary/10"
              >
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Community Features</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Share and discover recipes with our growing community
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Salad className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Smart Grocery Lists</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automatically generate shopping lists from your meal plans
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-secondary/5 to-primary/5 border border-secondary/10"
              >
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Premium Features</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Advanced customization options coming to Pro users
                  </p>
                </div>
              </motion.div>
            </div>
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
};

export default Index;
