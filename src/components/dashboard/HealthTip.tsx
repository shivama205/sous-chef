import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const healthTips = [
  {
    tip: "Try replacing white rice with quinoa for added protein and fiber",
    category: "Nutrition"
  },
  {
    tip: "Add turmeric to your meals for its anti-inflammatory properties",
    category: "Spices & Health"
  },
  {
    tip: "Include dal in your daily diet for a complete protein source",
    category: "Protein"
  },
  {
    tip: "Steam your vegetables instead of frying to retain more nutrients",
    category: "Cooking"
  },
  {
    tip: "Use jaggery instead of refined sugar for natural sweetness",
    category: "Substitution"
  },
  {
    tip: "Include seasonal fruits in your breakfast for better immunity",
    category: "Wellness"
  },
  {
    tip: "Try overnight oats with Indian spices for a healthy breakfast",
    category: "Meal Prep"
  },
  {
    tip: "Add methi (fenugreek) leaves to your roti dough for extra nutrition",
    category: "Traditional Wisdom"
  },
  {
    tip: "Replace regular tea with green tea or masala chai for antioxidants",
    category: "Beverages"
  },
  {
    tip: "Include amla (Indian gooseberry) in your diet for vitamin C boost",
    category: "Superfoods"
  },
  {
    tip: "Use mustard oil for cooking to improve heart health",
    category: "Cooking Oils"
  },
  {
    tip: "Add ajwain (carom seeds) to lentils to improve digestion",
    category: "Digestive Health"
  },
  {
    tip: "Include sprouted moong in your breakfast for extra protein",
    category: "Protein"
  },
  {
    tip: "Replace white bread with multigrain roti for better nutrition",
    category: "Substitution"
  },
  {
    tip: "Add curry leaves to your meals for iron and antioxidants",
    category: "Traditional Herbs"
  },
  {
    tip: "Include buttermilk (chaas) in your meals for probiotics",
    category: "Gut Health"
  },
  {
    tip: "Use kokum in curries as a healthy souring agent",
    category: "Traditional Ingredients"
  },
  {
    tip: "Add moringa leaves to your diet for essential minerals",
    category: "Superfoods"
  },
  {
    tip: "Include ragi (finger millet) in your diet for calcium",
    category: "Ancient Grains"
  },
  {
    tip: "Use rock salt (sendha namak) for its mineral content",
    category: "Minerals"
  }
];

export function HealthTip() {
  const [currentTip, setCurrentTip] = useState(healthTips[0]);

  useEffect(() => {
    // Get today's date and use it to select a tip
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const tipIndex = dayOfYear % healthTips.length;
    setCurrentTip(healthTips[tipIndex]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-4 bg-white/80 backdrop-blur-sm border-0">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-sm text-muted-foreground">
              Tip of the Day • {currentTip.category}
            </h3>
            <p className="text-base">
              {currentTip.tip}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
} 