import { useState } from "react";
import { StandardButton } from "@/components/ui/StandardButton";
import { Card } from "@/components/ui/card";
import { Preferences, Cuisine } from "../types/preferences";
import { CuisineSelector } from "./preferences/CuisineSelector";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ChevronDown } from "lucide-react";

interface PreferencesFormProps {
  onSubmit: (preferences: Preferences) => void;
  isLoading?: boolean;
  preferences: Preferences | null;
  setPreferences: (preferences: Preferences) => void;
}

export function PreferencesForm({ onSubmit, isLoading, preferences, setPreferences }: PreferencesFormProps) {
  const [showPerMealTargets, setShowPerMealTargets] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (preferences) {
      onSubmit(preferences);
    }
  };

  const handlePreferenceChange = (key: keyof Preferences, value: string | number | Cuisine[]) => {
    if (preferences) {
      setPreferences({
        ...preferences,
        [key]: value
      });
    }
  };

  if (!preferences) return null;

  return (
    <Card className="w-full backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-2xl p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        <div className="space-y-4 sm:space-y-6">
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
              <StandardButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPerMealTargets(!showPerMealTargets)}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {showPerMealTargets ? "Switch to Daily Totals" : "Switch to Per Meal"}
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showPerMealTargets ? "rotate-180" : ""}`} />
              </StandardButton>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>
          </div>

          <div className="space-y-4">
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

        <StandardButton 
          type="submit" 
          disabled={isLoading} 
          size="lg"
          className="w-full font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating your meal plan...
            </>
          ) : (
            'Generate Meal Plan'
          )}
        </StandardButton>
      </form>
    </Card>
  );
}