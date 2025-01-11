import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface PreferencesFormProps {
  onSubmit: (preferences: any) => void;
}

export const PreferencesForm = ({ onSubmit }: PreferencesFormProps) => {
  const [preferences, setPreferences] = useState({
    days: "7",
    dietaryRestrictions: "",
    proteinGoal: "",
    carbGoal: "",
    cuisinePreferences: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  const cuisineOptions = ["Italian", "Asian", "Mexican", "Mediterranean", "Indian"];

  const toggleCuisine = (cuisine: string) => {
    setPreferences(prev => ({
      ...prev,
      cuisinePreferences: prev.cuisinePreferences.includes(cuisine)
        ? prev.cuisinePreferences.filter(c => c !== cuisine)
        : [...prev.cuisinePreferences, cuisine]
    }));
  };

  return (
    <Card className="w-full max-w-md p-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="days">Days to Plan</Label>
          <Select
            value={preferences.days}
            onValueChange={(value) => setPreferences({ ...preferences, days: value })}
          >
            <SelectTrigger>
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

        <div className="space-y-2">
          <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
          <Textarea
            id="dietaryRestrictions"
            placeholder="Enter any dietary restrictions (e.g., gluten-free, dairy-free, allergies)"
            value={preferences.dietaryRestrictions}
            onChange={(e) => setPreferences({ ...preferences, dietaryRestrictions: e.target.value })}
            className="min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="proteinGoal">Protein Goal (g)</Label>
            <Input
              id="proteinGoal"
              type="number"
              value={preferences.proteinGoal}
              onChange={(e) => setPreferences({ ...preferences, proteinGoal: e.target.value })}
              placeholder="e.g., 150"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="carbGoal">Carb Goal (g)</Label>
            <Input
              id="carbGoal"
              type="number"
              value={preferences.carbGoal}
              onChange={(e) => setPreferences({ ...preferences, carbGoal: e.target.value })}
              placeholder="e.g., 200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Preferred Cuisines (Select multiple)</Label>
          <div className="grid grid-cols-2 gap-2">
            {cuisineOptions.map((cuisine) => (
              <Button
                key={cuisine}
                type="button"
                variant={preferences.cuisinePreferences.includes(cuisine) ? "default" : "outline"}
                onClick={() => toggleCuisine(cuisine)}
                className="w-full"
              >
                {cuisine}
              </Button>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Create Meal Plan
        </Button>
      </form>
    </Card>
  );
};