import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Cuisine } from "@/types/preferences";

interface CuisineSelectorProps {
  cuisinePreferences: Cuisine[];
  setCuisinePreferences: (cuisines: Cuisine[]) => void;
}

const cuisines: Cuisine[] = [
  "Italian",
  "Mexican",
  "Chinese",
  "Japanese",
  "Indian",
  "Mediterranean",
  "American",
  "Thai",
  "Korean",
  "Vietnamese",
  "French",
  "Greek",
];

export function CuisineSelector({
  cuisinePreferences,
  setCuisinePreferences,
}: CuisineSelectorProps) {
  const toggleCuisine = (cuisine: Cuisine) => {
    if (cuisinePreferences.includes(cuisine)) {
      setCuisinePreferences(cuisinePreferences.filter((c) => c !== cuisine));
    } else {
      setCuisinePreferences([...cuisinePreferences, cuisine]);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base sm:text-lg font-semibold">
        Cuisine Preferences
        <span className="text-xs sm:text-sm text-muted-foreground font-normal ml-2">(Optional)</span>
      </Label>
      <p className="text-sm text-muted-foreground">
        Select your preferred cuisines. We'll prioritize recipes from these cuisines in your meal plan.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cuisines.map((cuisine) => (
          <Button
            key={cuisine}
            type="button"
            variant={cuisinePreferences.includes(cuisine) ? "default" : "outline"}
            onClick={() => toggleCuisine(cuisine)}
            className="h-auto py-2 px-4 justify-start font-normal"
          >
            {cuisine}
          </Button>
        ))}
      </div>
    </div>
  );
}