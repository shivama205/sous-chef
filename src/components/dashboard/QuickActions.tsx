import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat, Search, Leaf } from "lucide-react";
import { motion } from "framer-motion";

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Create Meal Plan",
      description: "Generate personalized meal plans with AI",
      icon: ChefHat,
      path: "/meal-plan",
      color: "bg-primary/10"
    },
    {
      title: "Recipe Finder",
      description: "Discover recipes based on ingredients",
      icon: Search,
      path: "/recipe-finder",
      color: "bg-secondary/10"
    },
    {
      title: "Healthy Alternatives",
      description: "Find healthier versions of your meals",
      icon: Leaf,
      path: "/healthy-alternative",
      color: "bg-accent/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            className="w-full h-auto p-6 flex flex-col items-center gap-4 bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all"
            onClick={() => navigate(action.path)}
          >
            <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center`}>
              <action.icon className="w-6 h-6 text-foreground/80" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-1">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </div>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}