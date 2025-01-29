import { motion } from "framer-motion";
import { 
  ChefHat, 
  Sparkles, 
  Brain,
  ShoppingCart,
  Leaf,
  Clock,
  Share2,
  Users,
  Trophy,
  Instagram,
  Heart,
  Rocket
} from "lucide-react";

const features = [
  {
    icon: Share2,
    title: "Recipe Sharing",
    description: "Share your unique recipes with our global community of food enthusiasts",
    gradient: "from-primary/20 to-primary/5",
    isNew: true
  },
  {
    icon: Users,
    title: "Chef Community",
    description: "Connect with other home chefs, share tips, and get inspired by their creations",
    gradient: "from-secondary/20 to-secondary/5",
    isNew: true
  },
  {
    icon: Instagram,
    title: "Social Integration",
    description: "Share your recipes directly to social media with beautiful, auto-generated visuals",
    gradient: "from-primary/20 to-primary/5",
    isNew: true
  },
  {
    icon: ChefHat,
    title: "AI Meal Planning",
    description: "Get personalized meal plans based on your preferences and dietary needs",
    gradient: "from-secondary/20 to-secondary/5"
  },
  {
    icon: Brain,
    title: "Smart Recipe Suggestions",
    description: "Discover new recipes tailored to your taste preferences and nutritional goals",
    gradient: "from-primary/20 to-primary/5"
  },
  {
    icon: Leaf,
    title: "Healthy Alternatives",
    description: "Find healthier versions of your favorite dishes without compromising on taste",
    gradient: "from-secondary/20 to-secondary/5"
  },
  {
    icon: ShoppingCart,
    title: "Smart Shopping Lists",
    description: "Automatically generated shopping lists with smart ingredient combinations",
    gradient: "from-primary/20 to-primary/5"
  },
  {
    icon: Trophy,
    title: "Chef Rankings",
    description: "Get recognized for your contributions and climb the chef leaderboard",
    gradient: "from-secondary/20 to-secondary/5",
    isNew: true,
    comingSoon: true
  },
  {
    icon: Heart,
    title: "Recipe Collections",
    description: "Create and share themed recipe collections with your followers",
    gradient: "from-primary/20 to-primary/5",
    isNew: true,
    comingSoon: true
  },
  {
    icon: Clock,
    title: "Time-Saving Tools",
    description: "Efficient meal prep features and time-saving cooking tips",
    gradient: "from-secondary/20 to-secondary/5"
  },
  {
    icon: Sparkles,
    title: "Nutrition Insights",
    description: "Get detailed nutritional information and personalized recommendations",
    gradient: "from-primary/20 to-primary/5"
  },
  {
    icon: Rocket,
    title: "Chef Monetization",
    description: "Monetize your recipes and cooking expertise through our platform",
    gradient: "from-secondary/20 to-secondary/5",
    isNew: true,
    comingSoon: true
  }
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="relative group"
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-300"
           style={{ backgroundImage: `linear-gradient(${feature.gradient})` }} />
      <div className="relative p-8 h-full rounded-3xl border bg-card transition-colors duration-300">
        <div className="flex items-center justify-between mb-5">
          <feature.icon className="w-12 h-12 text-primary" />
          {feature.isNew && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              {feature.comingSoon ? 'Coming Soon' : 'New'}
            </span>
          )}
        </div>
        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
        <p className="text-muted-foreground">{feature.description}</p>
      </div>
    </motion.div>
  );
};

export const Features = () => {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            Powerful Features for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Home Chefs
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Share your culinary creations, build your following, and join a community of passionate home chefs. 
            All powered by AI to make cooking and sharing easier than ever.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};