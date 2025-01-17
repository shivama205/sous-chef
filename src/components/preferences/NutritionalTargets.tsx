import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface MealTargets {
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
}

interface NutritionalTargetsProps {
  showPerMealTargets: boolean;
  setShowPerMealTargets: (show: boolean) => void;
  proteinGoal: string;
  setProteinGoal: (value: string) => void;
  calorieIntakeGoal: string;
  setCalorieIntakeGoal: (value: string) => void;
  mealTargets: MealTargets;
  setMealTargets: (targets: MealTargets) => void;
  isLoading?: boolean;
}

export function NutritionalTargets({
  showPerMealTargets,
  setShowPerMealTargets,
  proteinGoal,
  setProteinGoal,
  calorieIntakeGoal,
  setCalorieIntakeGoal,
  mealTargets,
  setMealTargets,
  isLoading,
}: NutritionalTargetsProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base sm:text-lg font-semibold">
            Nutritional Targets
            <span className="text-xs sm:text-sm text-muted-foreground font-normal ml-2">(Optional)</span>
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPerMealTargets(!showPerMealTargets)}
            className="flex items-center gap-2"
          >
            {showPerMealTargets ? 'Show Daily Totals' : 'Show Per Meal'}
            <ChevronDown className={`w-4 h-4 transition-transform ${showPerMealTargets ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="proteinGoal" className="text-sm font-medium text-gray-700">
              {showPerMealTargets ? 'Protein Per Meal (g)' : 'Daily Protein (g)'}
            </Label>
            <Input
              id="proteinGoal"
              type="number"
              value={showPerMealTargets ? Math.round(parseInt(proteinGoal) / 5) : proteinGoal}
              onChange={(e) => {
                const value = e.target.value;
                setProteinGoal(showPerMealTargets ? (parseInt(value) * 5).toString() : value);
              }}
              placeholder={showPerMealTargets ? "Default: 20g per meal" : "Default: 100g per day"}
              className="h-10 text-base w-full"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="calorieIntakeGoal" className="text-sm font-medium text-gray-700">
              {showPerMealTargets ? 'Calories Per Meal' : 'Daily Calories'}
            </Label>
            <Input
              id="calorieIntakeGoal"
              type="number"
              value={showPerMealTargets ? Math.round(parseInt(calorieIntakeGoal) / 5) : calorieIntakeGoal}
              onChange={(e) => {
                const value = e.target.value;
                setCalorieIntakeGoal(showPerMealTargets ? (parseInt(value) * 5).toString() : value);
              }}
              placeholder={showPerMealTargets ? "Default: 400 per meal" : "Default: 2000 per day"}
              className="h-10 text-base w-full"
              disabled={isLoading}
            />
          </div>
        </div>

        {showPerMealTargets && (
          <p className="text-sm text-muted-foreground mt-4">
            Values are calculated for 5 meals per day. Daily totals will be adjusted automatically.
          </p>
        )}
      </div>
    </div>
  );
}