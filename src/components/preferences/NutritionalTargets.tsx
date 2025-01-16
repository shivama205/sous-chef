import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MealTargets } from "@/types/preferences";

interface NutritionalTargetsProps {
  showPerMealTargets: boolean;
  setShowPerMealTargets: (show: boolean) => void;
  proteinGoal: string;
  setProteinGoal: (goal: string) => void;
  calorieIntakeGoal: string;
  setCalorieIntakeGoal: (goal: string) => void;
  mealTargets: MealTargets;
  setMealTargets: (targets: MealTargets) => void;
  isLoading: boolean;
}

export const NutritionalTargets = ({
  showPerMealTargets,
  setShowPerMealTargets,
  proteinGoal,
  setProteinGoal,
  calorieIntakeGoal,
  setCalorieIntakeGoal,
  mealTargets,
  setMealTargets,
  isLoading,
}: NutritionalTargetsProps) => {
  return (
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};