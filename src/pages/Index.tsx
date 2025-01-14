import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavigationBar from "@/components/NavigationBar";
import { motion } from "framer-motion";
import { Leaf, Salad, Apple, CheckCircle2, Sparkles, Users, Star, Package, ArrowRight, ChartBar, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
    name: "Sarah J.",
    role: "Fitness Enthusiast",
    content: "This app has transformed how I plan my meals. The AI suggestions are spot-on!"
  },
  {
    name: "Mike R.",
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setIsLoading(true);
        // Fetch saved plans count
        const { count: plansCount } = await supabase
          .from('saved_meal_plans')
          .select('*', { count: 'exact' })
          .eq('user_id', session.user.id);
          
        // Fetch credits used
        const { data: credits } = await supabase
          .from('user_credits')
          .select('credits_used')
          .eq('user_id', session.user.id)
          .single();
          
        setSavedPlansCount(plansCount ?? 0);
        setCreditsUsed(credits?.credits_used ?? 0);
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  const LoggedInView = () => (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* Welcome Card */}
          <Card className="col-span-full bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">
                Welcome back, {user?.user_metadata.full_name}! 👋
              </CardTitle>
              <CardDescription>
                Here's an overview of your meal planning journey
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Stats Cards */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Saved Meal Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{savedPlansCount}</div>
              <Button 
                variant="link" 
                onClick={() => navigate('/profile')}
                className="p-0 h-auto font-normal text-sm text-muted-foreground"
              >
                View all plans →
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBar className="w-5 h-5 text-primary" />
                Credits Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{creditsUsed}</div>
              <Progress value={(creditsUsed / 10) * 100} className="mt-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {10 - creditsUsed} credits remaining
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Free</div>
              <Button 
                onClick={() => navigate('/pricing')}
                className="mt-4 bg-gradient-to-r from-primary to-primary/80"
              >
                Upgrade Now
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="col-span-full bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button
                onClick={() => navigate('/meal-plan')}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                Create New Meal Plan
              </Button>
              <Button
                onClick={() => navigate('/healthy-swap')}
                variant="secondary"
                className="bg-gradient-to-r from-secondary to-secondary/80"
              >
                Find Healthy Alternatives
              </Button>
              <Button
                onClick={() => navigate('/pricing')}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                View Premium Features
              </Button>
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
            className="relative grid grid-cols-2 gap-4"
          >
            {[Leaf, Salad, Apple].map((Icon, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-full h-full text-primary" />
              </motion.div>
            ))}
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
              We're constantly working on new features to make your healthy eating journey even better
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {upcomingFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg"
              >
                <Sparkles className="w-6 h-6 text-secondary flex-shrink-0" />
                <span>{feature}</span>
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
};

export default Index;
