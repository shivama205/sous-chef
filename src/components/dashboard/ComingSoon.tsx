import { Star, Users, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Star,
    title: "Premium Recipes",
    description: "Access exclusive chef-curated recipes"
  },
  {
    icon: Users,
    title: "Community Features",
    description: "Share and discover community recipes"
  },
  {
    icon: Sparkles,
    title: "AI Recipe Creation",
    description: "Create unique recipes with AI assistance"
  }
];

export function ComingSoon() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Coming Soon</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <Card key={feature.title} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-lg bg-accent/30 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}