import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { DaysToGenerate } from "@/components/preferences/DaysToGenerate";
import { NutritionalTargets } from "@/components/preferences/NutritionalTargets";
import { DietaryRestrictions } from "@/components/preferences/DietaryRestrictions";
import { CuisineSelector } from "@/components/preferences/CuisineSelector";
import { Preferences } from "@/types/preferences";

interface PreferencesFormProps {
  onSubmit: (preferences: Preferences) => void;
  isLoading?: boolean;
  initialPreferences?: Preferences;
}

interface MealTargets {
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
}

export function PreferencesForm({
  onSubmit,
  isLoading,
  initialPreferences,
}: PreferencesFormProps) {
  const [showPerMealTargets, setShowPerMealTargets] = useState(false);
  const [mealTargets, setMealTargets] = useState<MealTargets>({
    protein: Math.round(100 / 5), // Default 100g protein per day / 5 meals
    calories: Math.round(2000 / 5), // Default 2000 calories per day / 5 meals
    carbs: Math.round(250 / 5), // Default 250g carbs per day / 5 meals
    fat: Math.round(65 / 5), // Default 65g fat per day / 5 meals
  });
  const [preferences, setPreferences] = useState<Preferences>(
    initialPreferences || {
      days: 7,
      targetCalories: 2000,
      targetProtein: 100,
      dietaryRestrictions: "",
      cuisinePreferences: [],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <DaysToGenerate
        days={preferences.days}
        setDays={(days) => setPreferences({ ...preferences, days })}
        isLoading={isLoading}
      />

      <NutritionalTargets
        showPerMealTargets={showPerMealTargets}
        setShowPerMealTargets={setShowPerMealTargets}
        proteinGoal={preferences.targetProtein.toString()}
        setProteinGoal={(value) => setPreferences({ ...preferences, targetProtein: parseInt(value) || 0 })}
        calorieIntakeGoal={preferences.targetCalories.toString()}
        setCalorieIntakeGoal={(value) => setPreferences({ ...preferences, targetCalories: parseInt(value) || 0 })}
        mealTargets={mealTargets}
        setMealTargets={setMealTargets}
        isLoading={isLoading}
      />

      <DietaryRestrictions
        dietaryRestrictions={preferences.dietaryRestrictions}
        setDietaryRestrictions={(value) => setPreferences({ ...preferences, dietaryRestrictions: value })}
        isLoading={isLoading}
      />

      <CuisineSelector
        cuisinePreferences={preferences.cuisinePreferences}
        setCuisinePreferences={(value) => setPreferences({ ...preferences, cuisinePreferences: value })}
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Meal Plan"
        )}
      </Button>
    </form>
  );
} 