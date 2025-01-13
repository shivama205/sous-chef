import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavigationBar from "@/components/NavigationBar";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      
      <main className="container mx-auto px-4">
        {/* Hero Section */}
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
                  className="text-lg px-8 py-6"
                >
                  Create Meal Plan
                </Button>
                <Button
                  onClick={() => navigate("/healthy-swap")}
                  variant="secondary"
                  className="text-lg px-8 py-6"
                >
                  Find Healthy Alternatives
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8">
                <img
                  src="/placeholder.svg"
                  alt="Healthy Food Illustration"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;