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
    <div className="space-y-6">
      <div>
        <Label className="text-base sm:text-lg font-semibold block mb-4">
          Nutritional Targets
          <span className="text-xs sm:text-sm text-muted-foreground font-normal ml-2">(Optional)</span>
        </Label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="proteinGoal" className="text-sm font-medium text-gray-700">
              Daily Protein (g)
            </Label>
            <Input
              id="proteinGoal"
              type="number"
              value={proteinGoal}
              onChange={(e) => setProteinGoal(e.target.value)}
              placeholder="Default: 100g per day"
              className="h-10 text-base w-full"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="calorieIntakeGoal" className="text-sm font-medium text-gray-700">
              Daily Calories
            </Label>
            <Input
              id="calorieIntakeGoal"
              type="number"
              value={calorieIntakeGoal}
              onChange={(e) => setCalorieIntakeGoal(e.target.value)}
              placeholder="Default: 2000 per day"
              className="h-10 text-base w-full"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPerMealTargets(!showPerMealTargets)}
          className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
          disabled={isLoading}
        >
          <span>Per-Meal Targets</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              showPerMealTargets ? "rotate-180" : ""
            }`}
          />
        </Button>

        <AnimatePresence>
          {showPerMealTargets && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="proteinPerMeal" className="text-sm font-medium text-gray-700">
                    Protein per Meal (g)
                  </Label>
                  <Input
                    id="proteinPerMeal"
                    type="number"
                    value={mealTargets.protein || ""}
                    onChange={(e) =>
                      setMealTargets({
                        ...mealTargets,
                        protein: Number(e.target.value),
                      })
                    }
                    placeholder="Default: 25g per meal"
                    className="h-10 text-base w-full"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="caloriesPerMeal" className="text-sm font-medium text-gray-700">
                    Calories per Meal
                  </Label>
                  <Input
                    id="caloriesPerMeal"
                    type="number"
                    value={mealTargets.calories || ""}
                    onChange={(e) =>
                      setMealTargets({
                        ...mealTargets,
                        calories: Number(e.target.value),
                      })
                    }
                    placeholder="Default: 500 per meal"
                    className="h-10 text-base w-full"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};