import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavigationBar from "@/components/NavigationBar";
import { motion } from "framer-motion";
import { Utensils, Salad, Apple } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      
      <main className="container mx-auto px-4">
        <div className="py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight">
                Make Healthy Eating Simple
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Transform your eating habits with personalized meal plans and healthy alternatives. 
                We help you make better food choices without compromising on taste.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate("/meal-plan")}
                  className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all duration-200"
                >
                  Create Meal Plan
                </Button>
                <Button
                  onClick={() => navigate("/healthy-swap")}
                  variant="secondary"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-secondary to-secondary/80 hover:opacity-90 transition-all duration-200"
                >
                  Find Healthy Alternatives
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative flex justify-center items-center"
            >
              <div className="relative w-72 h-72">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Utensils className="w-16 h-16 text-primary" />
                </motion.div>
                <motion.div
                  animate={{
                    rotate: [360, 0],
                    y: [0, 10, 0]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Salad className="w-20 h-20 text-secondary" />
                </motion.div>
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, -360]
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Apple className="w-14 h-14 text-accent" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;