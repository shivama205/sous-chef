import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Loader2 } from "lucide-react";
import { Preferences, MealTargets, Cuisine } from "../types/preferences";

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
    <Card className="w-full backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-2xl p-4 sm:p-8 animate-fade-in relative">
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4 z-10">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-lg font-medium text-primary">{loadingMessages[loadingMessageIndex]}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Label htmlFor="days" className="text-base sm:text-lg font-semibold">Days to Plan</Label>
          <Select
            value={days.toString()}
            onValueChange={(value) => setDays(Number(value))}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full h-12 text-base">
              <SelectValue placeholder="Select days" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day} {day === 1 ? "day" : "days"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base sm:text-lg font-semibold flex items-center gap-2">
              Nutritional Targets
              <span className="text-xs sm:text-sm text-muted-foreground font-normal">(Optional)</span>
            </Label>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {!showPerMealTargets 
              ? "Set your daily targets, or leave empty for a balanced meal plan (approximately 2000 calories and 100g protein per day)."
              : "Set your targets per meal, or leave empty for a balanced meal plan (approximately 500 calories and 25g protein per meal)."
            }
          </p>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {!showPerMealTargets ? (
                <motion.div
                  key="daily-targets"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2 sm:space-y-4">
                      <Label htmlFor="proteinGoal" className="text-base font-medium">
                        Target Daily Protein (g)
                      </Label>
                      <Input
                        id="proteinGoal"
                        type="number"
                        value={proteinGoal}
                        onChange={(e) => setProteinGoal(e.target.value)}
                        placeholder="Default: 100g per day"
                        className="h-12 text-base"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2 sm:space-y-4">
                      <Label htmlFor="calorieIntakeGoal" className="text-base font-medium">
                        Target Daily Calories
                      </Label>
                      <Input
                        id="calorieIntakeGoal"
                        type="number"
                        value={calorieIntakeGoal}
                        onChange={(e) => setCalorieIntakeGoal(e.target.value)}
                        placeholder="Default: 2000 per day"
                        className="h-12 text-base"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowPerMealTargets(true);
                        setProteinGoal("");
                        setCalorieIntakeGoal("");
                      }}
                      className="w-full h-10 text-sm font-medium flex items-center justify-between hover:bg-transparent hover:text-primary"
                      disabled={isLoading}
                    >
                      <span className="flex items-center gap-2">
                        <ChevronDown className="w-4 h-4" />
                        Want to set targets per meal instead?
                      </span>
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="per-meal-targets"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2 sm:space-y-4">
                      <Label htmlFor="proteinPerMeal" className="text-base font-medium">
                        Target Protein per Meal (g)
                      </Label>
                      <Input
                        id="proteinPerMeal"
                        type="number"
                        value={mealTargets.proteinPerMeal || ""}
                        onChange={(e) =>
                          setMealTargets({
                            ...mealTargets,
                            proteinPerMeal: e.target.value,
                          })
                        }
                        placeholder="Default: 25g per meal"
                        className="h-12 text-base"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2 sm:space-y-4">
                      <Label htmlFor="caloriesPerMeal" className="text-base font-medium">
                        Target Calories per Meal
                      </Label>
                      <Input
                        id="caloriesPerMeal"
                        type="number"
                        value={mealTargets.caloriesPerMeal || ""}
                        onChange={(e) =>
                          setMealTargets({
                            ...mealTargets,
                            caloriesPerMeal: e.target.value,
                          })
                        }
                        placeholder="Default: 500 per meal"
                        className="h-12 text-base"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowPerMealTargets(false);
                        setMealTargets({});
                      }}
                      className="w-full h-10 text-sm font-medium flex items-center justify-between hover:bg-transparent hover:text-primary"
                      disabled={isLoading}
                    >
                      <span className="flex items-center gap-2">
                        <ChevronDown className="w-4 h-4 rotate-180" />
                        Switch back to daily targets
                      </span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base sm:text-lg font-semibold flex items-center gap-2">
            Preferred Cuisines
            <span className="text-xs sm:text-sm text-muted-foreground font-normal">(Optional)</span>
          </Label>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Click multiple cuisines to include them in your meal plan. Leave all unselected to include dishes from any cuisine.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              {Object.entries(Cuisine).map(([key, cuisine]) => (
                <Button
                  key={`cuisine-${key}`}
                  type="button"
                  variant={cuisinePreferences.includes(cuisine) ? "default" : "outline"}
                  onClick={() => {
                    setCuisinePreferences(prev =>
                      prev.includes(cuisine)
                        ? prev.filter(c => c !== cuisine)
                        : [...prev, cuisine]
                    );
                  }}
                  className="w-full h-10 sm:h-12 text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105"
                  disabled={isLoading}
                >
                  {cuisine}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-4">
          <Label htmlFor="dietaryRestrictions" className="text-base sm:text-lg font-semibold flex items-center gap-2">
            Dietary Restrictions
            <span className="text-xs sm:text-sm text-muted-foreground font-normal">(Optional)</span>
          </Label>
          <Textarea
            id="dietaryRestrictions"
            value={dietaryRestrictions}
            onChange={(e) => setDietaryRestrictions(e.target.value)}
            placeholder="e.g., vegetarian, gluten-free, dairy-free"
            className="min-h-[100px] text-sm sm:text-base resize-none"
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold transition-all duration-200 hover:scale-105 bg-gradient-to-r from-primary to-primary/80"
        >
          Generate Meal Plan
        </Button>
      </form>
    </Card>
  );
}