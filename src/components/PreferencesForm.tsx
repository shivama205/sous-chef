import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Preferences, Cuisine } from "../types/preferences";
import { MacroCalculator } from "./MacroCalculator";
import { DaysSelector } from "./preferences/DaysSelector";
import { NutritionalTargets } from "./preferences/NutritionalTargets";
import { CuisineSelector } from "./preferences/CuisineSelector";
import { DietaryRestrictions } from "./preferences/DietaryRestrictions";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ChevronDown } from "lucide-react";

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

interface PreferencesFormProps {
  onSubmit: (preferences: Preferences) => void;
  isLoading?: boolean;
  preferences: Preferences | null;
  setPreferences: (preferences: Preferences) => void;
}

type PreferenceValue = string | number | Cuisine[];

export function PreferencesForm({ onSubmit, isLoading, preferences, setPreferences }: PreferencesFormProps) {
  const [showPerMealTargets, setShowPerMealTargets] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (preferences) {
      onSubmit(preferences);
    }
  };

  const handlePreferenceChange = (key: keyof Preferences, value: PreferenceValue) => {
    if (preferences) {
      setPreferences({
        ...preferences,
        [key]: value
      });
    }
  };

  if (!preferences) return null;

  return (
    <Card className="w-full backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-2xl p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="days" className="text-base font-semibold">Days to Plan</Label>
            <Select 
              value={preferences.days.toString()} 
              onValueChange={(value) => handlePreferenceChange('days', parseInt(value))}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select number of days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="5">5 days</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Nutritional Targets</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPerMealTargets(!showPerMealTargets)}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {showPerMealTargets ? "Switch to Daily Totals" : "Switch to Per Meal"}
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showPerMealTargets ? "rotate-180" : ""}`} />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetCalories" className="text-sm text-muted-foreground">
                  {showPerMealTargets ? "Calories per Meal" : "Daily Calories"}
                </Label>
                <Input
                  id="targetCalories"
                  type="number"
                  value={showPerMealTargets && preferences.targetCalories 
                    ? Math.round(preferences.targetCalories / 5) 
                    : preferences.targetCalories}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    handlePreferenceChange('targetCalories', showPerMealTargets ? value * 5 : value);
                  }}
                  placeholder={showPerMealTargets ? "e.g. 400" : "e.g. 2000"}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetProtein" className="text-sm text-muted-foreground">
                  {showPerMealTargets ? "Protein per Meal (g)" : "Daily Protein (g)"}
                </Label>
                <Input
                  id="targetProtein"
                  type="number"
                  value={showPerMealTargets && preferences.targetProtein 
                    ? Math.round(preferences.targetProtein / 5) 
                    : preferences.targetProtein}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    handlePreferenceChange('targetProtein', showPerMealTargets ? value * 5 : value);
                  }}
                  placeholder={showPerMealTargets ? "e.g. 30" : "e.g. 150"}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetCarbs" className="text-sm text-muted-foreground">
                  {showPerMealTargets ? "Carbs per Meal (g)" : "Daily Carbs (g)"}
                </Label>
                <Input
                  id="targetCarbs"
                  type="number"
                  value={showPerMealTargets && preferences.targetCarbs 
                    ? Math.round(preferences.targetCarbs / 5) 
                    : preferences.targetCarbs}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    handlePreferenceChange('targetCarbs', showPerMealTargets ? value * 5 : value);
                  }}
                  placeholder={showPerMealTargets ? "e.g. 40" : "e.g. 200"}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetFat" className="text-sm text-muted-foreground">
                  {showPerMealTargets ? "Fat per Meal (g)" : "Daily Fat (g)"}
                </Label>
                <Input
                  id="targetFat"
                  type="number"
                  value={showPerMealTargets && preferences.targetFat 
                    ? Math.round(preferences.targetFat / 5) 
                    : preferences.targetFat}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    handlePreferenceChange('targetFat', showPerMealTargets ? value * 5 : value);
                  }}
                  placeholder={showPerMealTargets ? "e.g. 13" : "e.g. 65"}
                  className="h-11"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Cuisine Preferences</Label>
            <CuisineSelector 
              cuisinePreferences={preferences.cuisinePreferences} 
              setCuisinePreferences={(cuisines) => handlePreferenceChange('cuisinePreferences', cuisines)} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietaryRestrictions" className="text-base font-semibold">
              Dietary Restrictions
              <span className="text-sm font-normal text-muted-foreground ml-2">(Optional)</span>
            </Label>
            <Textarea
              id="dietaryRestrictions"
              value={preferences.dietaryRestrictions}
              onChange={(e) => handlePreferenceChange('dietaryRestrictions', e.target.value)}
              placeholder="Enter any dietary restrictions or allergies..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full h-11 text-base font-medium">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating your meal plan...
            </>
          ) : (
            'Generate Meal Plan'
          )}
        </Button>
      </form>
    </Card>
  );
}