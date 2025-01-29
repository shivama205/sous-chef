import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat, Calendar, Search, Users } from "lucide-react";
import { motion } from "framer-motion";

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Create Recipe",
      description: "Share your culinary creations",
      icon: ChefHat,
      path: "/create-recipe",
      color: "bg-primary/10"
    },
    {
      title: "Meal Planning",
      description: "Plan your weekly meals",
      icon: Calendar,
      path: "/meal-plan",
      color: "bg-secondary/10"
    },
    {
      title: "Recipe Finder",
      description: "Discover new recipes",
      icon: Search,
      path: "/recipe-finder",
      color: "bg-accent/10"
    },
    {
      title: "Community",
      description: "Connect with other chefs",
      icon: Users,
      path: "/community",
      color: "bg-primary/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            className="w-full h-auto p-6 flex flex-col items-center gap-4 bg-white/80 backdrop-blur-sm hover:bg-accent/5 transition-all"
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