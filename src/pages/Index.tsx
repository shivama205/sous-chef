import { Link } from "react-router-dom";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Brain, ChefHat, ArrowRight, Sparkles, Clock, Star, Utensils, Apple, Heart, Users, Trophy, Check } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { SEO } from "@/components/SEO";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { SocialProof } from "@/components/sections/social-proof";

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

const LoggedInView = () => {
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
    <div className="container mx-auto px-4 py-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
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

        {/* Quick Actions */}
        <motion.section variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Need Quick Ideas?",
              description: "Get instant meal suggestions based on your mood",
              icon: Brain,
              path: "/meal-suggestions",
              color: "blue"
            },
            {
              title: "Weekly Meal Plan",
              description: "Plan your meals for the upcoming week",
              icon: ChefHat,
              path: "/meal-plan",
              color: "green"
            },
            {
              title: "Find Recipes",
              description: "Search our collection of healthy recipes",
              icon: Utensils,
              path: "/recipe-finder",
              color: "orange"
            },
            {
              title: "Healthy Swaps",
              description: "Discover healthier alternatives",
              icon: Apple,
              path: "/healthy-alternative",
              color: "green"
            }
          ].map((action) => (
            <Link key={action.path} to={action.path}>
              <Card
                variant={getCardVariant(action.color)}
                hover={true}
                className="p-6 h-full"
              >
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <action.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </motion.section>

        {/* Recent Activity & Stats */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card variant="glass" className="col-span-2 p-6">
            <h3 className="text-lg font-semibold mb-4">Your Recent Activity</h3>
            <div className="space-y-4">
              {/* Placeholder for recent activity */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>You haven't created any meal plans yet. Ready to start?</span>
              </div>
              <Button asChild variant="glass-primary" size="sm">
                <Link to="/meal-plan" className="gap-2">
                  Create Your First Plan
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </Card>
          <Card variant="glass" className="p-6">
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
        </motion.div>
      </motion.div>
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
