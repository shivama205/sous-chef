import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator, HelpCircle, ArrowRight } from "lucide-react";
import { Preferences, MealTargets, Cuisine } from "../types/preferences";
import { MacroCalculator } from "./MacroCalculator";
import { DaysSelector } from "./preferences/DaysSelector";
import { NutritionalTargets } from "./preferences/NutritionalTargets";
import { CuisineSelector } from "./preferences/CuisineSelector";
import { DietaryRestrictions } from "./preferences/DietaryRestrictions";

const loadingMessages = [
  "Cooking up your perfect meal plan... 🍳",
  "Mixing healthy ingredients... 🥗",
  "Balancing your macros... 💪",
  "Sprinkling some nutrition magic... ✨",
  "Taste-testing your menu... 😋",
  "Adding a pinch of variety... 🌮",
  "Making sure everything is delicious... 🍽️",
  "Almost ready to serve... 🍽️"
];

export function PreferencesForm({ 
  onSubmit,
  disabled
}: { 
  onSubmit: (preferences: Preferences) => void;
  disabled?: boolean;
}) {
  const [days, setDays] = useState(7);
  const [proteinGoal, setProteinGoal] = useState("");
  const [calorieIntakeGoal, setCalorieIntakeGoal] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [cuisinePreferences, setCuisinePreferences] = useState<Cuisine[]>([]);
  const [showPerMealTargets, setShowPerMealTargets] = useState(false);
  const [mealTargets, setMealTargets] = useState<MealTargets>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [showMacroCalculator, setShowMacroCalculator] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingInterval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);

    try {
      const preferences: Preferences = {
        days,
        proteinGoal: proteinGoal || undefined,
        calorieIntakeGoal: calorieIntakeGoal || undefined,
        dietaryRestrictions: dietaryRestrictions || undefined,
        cuisinePreferences: cuisinePreferences.length > 0 ? cuisinePreferences : undefined,
        mealTargets: showPerMealTargets ? {
          proteinPerMeal: mealTargets.proteinPerMeal || undefined,
          caloriesPerMeal: mealTargets.caloriesPerMeal || undefined,
        } : undefined,
      };
      await onSubmit(preferences);
    } finally {
      clearInterval(loadingInterval);
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card className="w-full backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-2xl p-4 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <DaysSelector 
              days={days}
              setDays={setDays}
              isLoading={isLoading}
            />

            <NutritionalTargets
              showPerMealTargets={showPerMealTargets}
              setShowPerMealTargets={setShowPerMealTargets}
              proteinGoal={proteinGoal}
              setProteinGoal={setProteinGoal}
              calorieIntakeGoal={calorieIntakeGoal}
              setCalorieIntakeGoal={setCalorieIntakeGoal}
              mealTargets={mealTargets}
              setMealTargets={setMealTargets}
              isLoading={isLoading}
            />

            <CuisineSelector
              cuisinePreferences={cuisinePreferences}
              setCuisinePreferences={setCuisinePreferences}
              isLoading={isLoading}
            />

            <DietaryRestrictions
              dietaryRestrictions={dietaryRestrictions}
              setDietaryRestrictions={setDietaryRestrictions}
              isLoading={isLoading}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold transition-all duration-200 hover:scale-105 bg-gradient-to-r from-primary to-primary/80"
            >
              Generate Meal Plan
            </Button>
          </form>
        </Card>

        {/* Help Section */}
        <Card className="w-full backdrop-blur-sm bg-gradient-to-r from-secondary/10 to-primary/10 border-0 shadow-xl rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Need Help with Your Nutritional Goals?</h3>
              <p className="text-muted-foreground mb-4">
                Not sure about your daily caloric needs or macro targets? Our calculator can help you determine the right numbers based on your goals.
              </p>
              <Button
                type="button"
                onClick={() => setShowMacroCalculator(true)}
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                Calculate Your Macros
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {showMacroCalculator && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <MacroCalculator />
        </motion.div>
      )}
    </div>
  );
}