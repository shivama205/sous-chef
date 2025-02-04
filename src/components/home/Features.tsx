import { Card } from "@/components/ui/card";
import { ChefHat, Sparkles, ShoppingCart, Users, Star, Timer } from "lucide-react";

const features = [
  {
    icon: ChefHat,
    title: "AI-Powered Meal Planning",
    description: "Get personalized meal plans tailored to your preferences and nutritional goals"
  },
  {
    icon: Sparkles,
    title: "Smart Recipe Suggestions",
    description: "Discover new recipes based on ingredients you already have"
  },
  {
    icon: ShoppingCart,
    title: "Automated Grocery Lists",
    description: "Generate shopping lists from your meal plans with one click"
  },
  {
    icon: Users,
    title: "Share & Collaborate",
    description: "Share your meal plans with family and friends"
  },
  {
    icon: Star,
    title: "Healthy Alternatives",
    description: "Find healthier versions of your favorite meals"
  },
  {
    icon: Timer,
    title: "Time-Saving",
    description: "Save hours of meal planning and grocery shopping time"
  }
];

export function Features() {
  return (
    <section className="py-8 sm:py-12 bg-accent/30">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Why Choose MySideChef?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto sm:mx-0">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold text-base sm:text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}