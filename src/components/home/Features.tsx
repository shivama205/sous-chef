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
    <section className="py-12 bg-accent/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose SousChef?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}