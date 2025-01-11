import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generateMealPlan } from "@/utils/mealPlanGenerator";

export const PreferencesForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    days: "7",
    dietaryRestrictions: "",
    proteinGoal: "",
    carbGoal: "",
    cuisinePreferences: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const mealPlan = await generateMealPlan(preferences);
      navigate("/meal-plan", { state: { preferences, mealPlan } });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
    <Card className="w-full backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-2xl p-8 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <Label htmlFor="days" className="text-lg font-semibold">Days to Plan</Label>
          <Select
            value={preferences.days}
            onValueChange={(value) => setPreferences({ ...preferences, days: value })}
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
          <Label htmlFor="dietaryRestrictions" className="text-lg font-semibold">Dietary Restrictions</Label>
          <Textarea
            id="dietaryRestrictions"
            placeholder="Enter any dietary restrictions (e.g., gluten-free, dairy-free, allergies)"
            value={preferences.dietaryRestrictions}
            onChange={(e) => setPreferences({ ...preferences, dietaryRestrictions: e.target.value })}
            className="min-h-[100px] text-base resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label htmlFor="proteinGoal" className="text-lg font-semibold">Protein Goal (g)</Label>
            <Input
              id="proteinGoal"
              type="number"
              value={preferences.proteinGoal}
              onChange={(e) => setPreferences({ ...preferences, proteinGoal: e.target.value })}
              placeholder="e.g., 150"
              className="h-12 text-base"
            />
          </div>
          <div className="space-y-4">
            <Label htmlFor="carbGoal" className="text-lg font-semibold">Carb Goal (g)</Label>
            <Input
              id="carbGoal"
              type="number"
              value={preferences.carbGoal}
              onChange={(e) => setPreferences({ ...preferences, carbGoal: e.target.value })}
              placeholder="e.g., 200"
              className="h-12 text-base"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-semibold">Preferred Cuisines</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {cuisineOptions.map((cuisine) => (
              <Button
                key={cuisine}
                type="button"
                variant={preferences.cuisinePreferences.includes(cuisine) ? "default" : "outline"}
                onClick={() => toggleCuisine(cuisine)}
                className="w-full h-12 text-base font-medium transition-all duration-200 hover:scale-105"
              >
                {cuisine}
              </Button>
            ))}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-14 text-lg font-semibold transition-all duration-200 hover:scale-105" 
          disabled={isLoading}
        >
          {isLoading ? "Creating Meal Plan..." : "Create Meal Plan"}
        </Button>
      </form>
    </Card>
  );
};