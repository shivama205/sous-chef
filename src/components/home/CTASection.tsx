import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Share2, Users, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background/5 to-background py-20 sm:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4"
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight"
          >
            Join Our Growing Community of{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Recipe Creators
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-lg text-muted-foreground"
          >
            Share your culinary creations, connect with fellow food enthusiasts, and build your following. 
            Start your journey as a recipe creator today!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="w-full sm:w-auto group" onClick={() => navigate('/create-recipe')}>
              Start Sharing
              <Share2 className="ml-2 w-4 h-4 group-hover:animate-bounce" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => navigate('/community')}>
              Explore Community
              <Users className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <ChefHat className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">10,000+</h3>
              <p className="mt-2 text-muted-foreground">Active Chefs</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Share2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">50,000+</h3>
              <p className="mt-2 text-muted-foreground">Recipes Shared</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">100,000+</h3>
              <p className="mt-2 text-muted-foreground">Community Members</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}; 
