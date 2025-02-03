import { Link } from "react-router-dom";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Brain, ChefHat, ArrowRight, Sparkles, Clock, Star, Utensils, Apple, Heart, Users, Trophy, Check } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { SEO } from "@/components/SEO";

const LoggedInView = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Need Quick Ideas?",
              description: "Get instant meal suggestions based on your mood",
              icon: Brain,
              path: "/meal-suggestions",
              color: "from-blue-500/20 to-blue-600/20"
            },
            {
              title: "Weekly Meal Plan",
              description: "Plan your meals for the upcoming week",
              icon: ChefHat,
              path: "/meal-plan",
              color: "from-green-500/20 to-green-600/20"
            },
            {
              title: "Find Recipes",
              description: "Search our collection of healthy recipes",
              icon: Utensils,
              path: "/recipe-finder",
              color: "from-purple-500/20 to-purple-600/20"
            },
            {
              title: "Healthy Swaps",
              description: "Discover healthier alternatives",
              icon: Apple,
              path: "/healthy-alternative",
              color: "from-orange-500/20 to-orange-600/20"
            }
          ].map((action) => (
            <Link key={action.path} to={action.path}>
              <Card className="p-6 h-full hover:shadow-lg transition-all duration-200 group cursor-pointer bg-gradient-to-br border-0">
                <div className="flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </section>

        {/* Recent Activity & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-2 p-6">
            <h3 className="text-lg font-semibold mb-4">Your Recent Activity</h3>
            <div className="space-y-4">
              {/* Placeholder for recent activity */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>You haven't created any meal plans yet. Ready to start?</span>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Meals Planned</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Recipes Saved</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Days Active</span>
                <span className="font-medium">1</span>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

const LoggedOutView = () => {
  const features = [
    {
      id: "quick-ideas",
      icon: Brain,
      title: "Quick Meal Ideas",
      heading: "Instant Meal Suggestions When You Need Them",
      description: "Too tired to think? Let our AI suggest meals based on your energy level and cravings. No account needed - just tell us how you feel!",
      benefits: [
        "Personalized to your energy level",
        "Quick and easy options available",
        "Considers your dietary restrictions"
      ],
      path: "/meal-suggestions",
      buttonText: "Try It Now",
      imagePosition: "right"
    },
    {
      id: "recipe-finder",
      icon: Utensils,
      title: "Recipe Finder",
      heading: "Find the Perfect Recipe",
      description: "Search our extensive recipe collection by ingredients, cuisine, or dietary requirements. Find exactly what you're craving!",
      benefits: [
        "Search by available ingredients",
        "Filter by cuisine and diet",
        "Detailed instructions and tips"
      ],
      path: "/recipe-finder",
      buttonText: "Find Recipes",
      imagePosition: "left"
    },
    {
      id: "healthy-swaps",
      icon: Apple,
      title: "Healthy Alternatives",
      heading: "Make Your Favorites Healthier",
      description: "Love your favorite dishes but want to make them healthier? Our AI suggests smart ingredient swaps and cooking modifications.",
      benefits: [
        "Smart ingredient substitutions",
        "Nutritional comparisons",
        "Healthier cooking methods"
      ],
      path: "/healthy-alternative",
      buttonText: "Discover Alternatives",
      imagePosition: "right"
    },
    {
      id: "meal-planning",
      icon: ChefHat,
      title: "Meal Planning",
      heading: "Plan Your Week with AI Assistance",
      description: "Take the stress out of weekly meal planning. Our AI helps you create balanced, varied meal plans that fit your schedule and preferences.",
      benefits: [
        "Automated grocery lists",
        "Nutritional balance tracking",
        "Flexible and customizable plans"
      ],
      path: "/meal-plan",
      buttonText: "Start Planning",
      imagePosition: "left"
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-4xl lg:text-5xl font-bold">
                Too Tired to Think About What to Cook? 😴
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Get instant, personalized meal ideas based on your energy level and cravings. 
                <span className="font-medium text-primary">No account needed!</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80">
                  <Link to="/meal-suggestions" className="gap-2">
                    <Brain className="w-5 h-5" />
                    Get Quick Ideas
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/meal-plan" className="gap-2">
                    Try Meal Planning
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>10k+ Happy Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>50k+ Recipes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>100% Free</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <Link to="/meal-suggestions" className="block">
                <div className="relative bg-white/50 backdrop-blur-sm border border-primary/10 rounded-3xl p-6 group hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">Instant Meal Ideas</h3>
                      <p className="text-sm text-muted-foreground">Based on your mood and energy</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>

                  <div className="space-y-6">
                    {/* Cook at Home Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-primary">Recommended: Cook at Home</span>
                        <div className="h-px flex-1 bg-primary/10" />
                      </div>
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-primary/5 to-green-500/5 rounded-xl p-3 border border-primary/10 relative overflow-hidden group-hover:border-primary/30 transition-all">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🍗</span>
                            <div>
                              <p className="font-medium text-sm">Lemon Herb Chicken</p>
                              <p className="text-xs text-muted-foreground">Ready in 30 mins</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-primary/5 to-green-500/5 rounded-xl p-3 border border-primary/10 group-hover:border-primary/30 transition-all">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🐟</span>
                            <div>
                              <p className="font-medium text-sm">Baked Salmon Bowl</p>
                              <p className="text-xs text-muted-foreground">Ready in 25 mins</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Eat Out Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-primary/80">Eat Out Options</span>
                        <div className="h-px flex-1 bg-primary/10" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/80 rounded-xl p-3 border border-primary/5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🍜</span>
                            <p className="font-medium text-sm">Ramen Bowl</p>
                          </div>
                        </div>
                        <div className="bg-white/80 rounded-xl p-3 border border-primary/5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🥗</span>
                            <p className="font-medium text-sm">Poke Bowl</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order In Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-primary/80">Order In Options</span>
                        <div className="h-px flex-1 bg-primary/10" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/80 rounded-xl p-3 border border-primary/5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🍛</span>
                            <p className="font-medium text-sm">Thai Curry</p>
                          </div>
                        </div>
                        <div className="bg-white/80 rounded-xl p-3 border border-primary/5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🥘</span>
                            <p className="font-medium text-sm">Burrito Bowl</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Previews */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            Your AI-Powered Kitchen Assistant
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Experience how SousChef makes meal planning and cooking easier
          </motion.p>
        </div>

        {/* Quick Meal Ideas Preview */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-24"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-2xl font-semibold">Quick Meal Ideas</h3>
            </div>
            <p className="text-lg text-muted-foreground">
              Feeling tired? Tell us your mood and energy level, and we'll suggest personalized meal options - whether you want to cook, order, or eat out.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-blue-500" />
                </div>
                <span>Instant suggestions based on your energy level</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-blue-500" />
                </div>
                <span>Multiple options: cook, order, or eat out</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-blue-500" />
                </div>
                <span>Considers dietary restrictions and preferences</span>
              </li>
            </ul>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/meal-suggestions">
                Try Quick Ideas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-primary/20 rounded-3xl blur-3xl" />
            <div className="relative bg-white/50 backdrop-blur-sm border border-blue-500/10 rounded-3xl overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-500/5 to-primary/5">
                {/* We'll add a video/animation preview here */}
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 w-3/4 bg-blue-500/10 rounded-lg" />
                    <div className="h-24 bg-blue-500/5 rounded-lg" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-16 bg-blue-500/5 rounded-lg" />
                      <div className="h-16 bg-blue-500/5 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recipe Finder Preview */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-24"
        >
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-primary/20 rounded-3xl blur-3xl" />
            <div className="relative bg-white/50 backdrop-blur-sm border border-purple-500/10 rounded-3xl overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-purple-500/5 to-primary/5">
                {/* We'll add a video/animation preview here */}
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 w-3/4 bg-purple-500/10 rounded-lg" />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-32 bg-purple-500/5 rounded-lg" />
                      <div className="h-32 bg-purple-500/5 rounded-lg" />
                      <div className="h-32 bg-purple-500/5 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <Utensils className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-2xl font-semibold">Recipe Finder</h3>
            </div>
            <p className="text-lg text-muted-foreground">
              Find the perfect recipe using ingredients you already have. Our AI understands your preferences and suggests recipes that match your needs.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-purple-500" />
                </div>
                <span>Search by available ingredients</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-purple-500" />
                </div>
                <span>Filter by cuisine and dietary needs</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-purple-500" />
                </div>
                <span>Detailed instructions and nutritional info</span>
              </li>
            </ul>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/recipe-finder">
                Try Recipe Finder
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Meal Planning Preview */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-2xl font-semibold">AI Meal Planning</h3>
            </div>
            <p className="text-lg text-muted-foreground">
              Let AI handle your weekly meal planning. Get personalized plans that match your nutritional goals and schedule.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <span>Personalized weekly meal plans</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <span>Automatic macro tracking</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <span>Smart grocery lists</span>
              </li>
            </ul>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/meal-plan">
                Try Meal Planning
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-primary/20 rounded-3xl blur-3xl" />
            <div className="relative bg-white/50 backdrop-blur-sm border border-green-500/10 rounded-3xl overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-green-500/5 to-primary/5">
                {/* We'll add a video/animation preview here */}
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 w-3/4 bg-green-500/10 rounded-lg" />
                    <div className="grid grid-cols-7 gap-2">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-6 bg-green-500/10 rounded" />
                          <div className="h-24 bg-green-500/5 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">How It Works</h2>
          <p className="text-lg text-muted-foreground">Get meal ideas in seconds, no strings attached</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: "Tell Us How You Feel",
              description: "Tired? Energetic? Just let us know your current mood"
            },
            {
              icon: Sparkles,
              title: "Get Instant Ideas",
              description: "Our AI suggests meals that match your energy level"
            },
            {
              icon: ChefHat,
              title: "Start Cooking",
              description: "Follow easy recipes with step-by-step instructions"
            }
          ].map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl -rotate-6" />
              <Card className="relative p-6 bg-white/50 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Sections */}
      <div className="space-y-16">
        {features.map((feature) => (
          <section key={feature.id} className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {feature.imagePosition === "left" && (
                <div className="relative">
                  {/* Placeholder for future animation */}
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <span className="text-muted-foreground">Feature Preview</span>
                  </div>
                </div>
              )}
              
              <div className={feature.imagePosition === "left" ? "order-2" : ""}>
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-primary">
                    <feature.icon className="w-5 h-5" />
                    <span className="font-medium">{feature.title}</span>
                  </div>
                  <h2 className="text-2xl font-bold">{feature.heading}</h2>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 text-primary" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <Button asChild className="mt-4">
                    <Link to={feature.path} className="gap-2">
                      {feature.buttonText}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {feature.imagePosition === "right" && (
                <div className="relative">
                  {/* Placeholder for future animation */}
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <span className="text-muted-foreground">Feature Preview</span>
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* Social Proof */}
      <section className="container mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground">Join thousands of happy users</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Sarah Chen",
              role: "Busy Parent",
              content: "The meal suggestions feature is a lifesaver when I'm too tired to think about dinner. Quick, easy, and always delicious!"
            },
            {
              name: "Mike Johnson",
              role: "Fitness Enthusiast",
              content: "I love how it suggests meals based on my energy level. Perfect for maintaining my nutrition goals while being realistic about my cooking energy."
            },
            {
              name: "Priya Patel",
              role: "Student",
              content: "As a student, I appreciate that I can get quick meal ideas without signing up. The recipes are easy to follow and budget-friendly!"
            }
          ].map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full bg-white/50 backdrop-blur-sm">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <p className="text-muted-foreground mb-4">{testimonial.content}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Explore Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-lg text-muted-foreground">Start with what interests you most</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Link key={feature.id} to={feature.path}>
              <Card className="group hover:shadow-lg transition-all duration-200">
                <div className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.benefits[0]}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default function Index() {
  const { user } = useAuth();

  return (
    <BaseLayout>
      <SEO 
        title="SousChef - Your AI-Powered Kitchen Assistant"
        description="Get instant, personalized meal ideas based on your energy level and cravings. Plan meals, find recipes, and discover healthy alternatives with your AI kitchen assistant."
        keywords="meal planning, recipe finder, healthy cooking, AI kitchen assistant, meal suggestions, cooking tips, personalized meals"
        type="website"
        canonical="https://sous-chef.in"
        image="/og-image.png"
      />
      <main>
        {user ? <LoggedInView /> : <LoggedOutView />}
      </main>
    </BaseLayout>
  );
}
