import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChefHat, Share2, Heart, Users, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { LoginDialog } from "@/components/LoginDialog";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleStartSharing = async () => {
    try {
      setIsNavigating(true);
      if (!user) {
        setShowLoginDialog(true);
        setIsNavigating(false);
        return;
      }
      console.log("Navigating to create recipe page");
      await navigate('/create-recipe');
    } catch (error) {
      console.error("Navigation error:", error);
      toast({
        title: "Navigation Error",
        description: "Failed to navigate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsNavigating(false);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginDialog(false);
    navigate('/create-recipe');
  };

  const handleExploreCommunity = async () => {
    try {
      setIsNavigating(true);
      console.log("Navigating to community page");
      await navigate('/community');
    } catch (error) {
      console.error("Navigation error:", error);
      toast({
        title: "Navigation Error",
        description: "Failed to navigate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <>
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
                className="w-full sm:w-auto group relative"
                onClick={handleStartSharing}
                disabled={isNavigating}
              >
                {isNavigating ? (
                  <span className="flex items-center">
                    <motion.div
                      className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
                    />
                    Navigating...
                  </span>
                ) : (
                  <>
                    {user ? "Start Sharing" : "Sign In to Share"} 
                    <Share2 className="ml-2 w-4 h-4 group-hover:animate-bounce" />
                  </>
                )}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto relative" 
                onClick={handleExploreCommunity}
                disabled={isNavigating}
              >
                {isNavigating ? (
                  <span className="flex items-center">
                    <motion.div
                      className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
                    />
                    Navigating...
                  </span>
                ) : (
                  <>
                    Explore Community 
                    <Users className="ml-2 w-4 h-4" />
                  </>
                )}
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

      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
        onLoginSuccess={handleLoginSuccess}
        redirectPath="/create-recipe"
      />
    </>
  );
};