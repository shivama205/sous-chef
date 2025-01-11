import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface PreferencesFormProps {
  onSubmit: (preferences: any) => void;
}

export const PreferencesForm = ({ onSubmit }: PreferencesFormProps) => {
  const [preferences, setPreferences] = useState({
    days: "7",
    dietaryRestrictions: [] as string[],
    proteinGoal: "",
    carbGoal: "",
    cuisinePreference: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  const dietaryOptions = [
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "Vegan" },
    { id: "gluten-free", label: "Gluten Free" },
    { id: "dairy-free", label: "Dairy Free" },
  ];

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
          <Label>Dietary Restrictions</Label>
          <div className="grid grid-cols-2 gap-4">
            {dietaryOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={preferences.dietaryRestrictions.includes(option.id)}
                  onCheckedChange={(checked) => {
                    setPreferences({
                      ...preferences,
                      dietaryRestrictions: checked
                        ? [...preferences.dietaryRestrictions, option.id]
                        : preferences.dietaryRestrictions.filter((id) => id !== option.id),
                    });
                  }}
                />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </div>
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
          <Label htmlFor="cuisine">Preferred Cuisine</Label>
          <Select
            value={preferences.cuisinePreference}
            onValueChange={(value) => setPreferences({ ...preferences, cuisinePreference: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select cuisine" />
            </SelectTrigger>
            <SelectContent>
              {["Italian", "Asian", "Mexican", "Mediterranean", "Indian"].map((cuisine) => (
                <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                  {cuisine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full">
          Create Meal Plan
        </Button>
      </form>
    </Card>
  );
};