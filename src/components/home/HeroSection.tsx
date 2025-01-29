import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChefHat, Share2, Heart, Users, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartSharing = () => {
    console.log("Navigating to profile page");
    navigate('/create-recipe');
  };

  const handleExploreCommunity = () => {
    console.log("Navigating to community page");
    navigate('/community');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/5 py-20 sm:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 text-center"
      >
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center space-x-2 mb-8"
          >
            <ChefHat className="w-8 h-8 text-primary" />
            <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Your Recipe Sharing Community
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
          >
            Share Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">
              Recipes
            </span>
            {" "}& Build Your Following
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Join a thriving community of passionate home chefs. Share your recipes, get discovered, 
            build your following, and connect with food enthusiasts from around the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto group" 
              onClick={handleStartSharing}
            >
              Start Sharing 
              <Share2 className="ml-2 w-4 h-4 group-hover:animate-bounce" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto" 
              onClick={handleExploreCommunity}
            >
              Explore Community 
              <Users className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center">
              <Share2 className="w-4 h-4 mr-2 text-primary" />
              Free Recipe Sharing
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-2 text-primary" />
              Build Your Following
            </div>
            <div className="flex items-center">
              <Trophy className="w-4 h-4 mr-2 text-primary" />
              Chef Rankings
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-primary" />
              Active Community
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};