import { Label } from "@/components/ui/label";
import { StandardButton } from "@/components/ui/StandardButton";
import { Cuisine } from "@/types/preferences";

interface CuisineSelectorProps {
  cuisinePreferences: Cuisine[];
  setCuisinePreferences: (cuisines: Cuisine[]) => void;
}

const cuisines: Cuisine[] = [
  "italian",
  "mexican",
  "chinese",
  "japanese",
  "indian",
  "mediterranean",
  "american",
  "thai",
  "korean",
  "vietnamese",
  "indonesian",
  "greek",
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
      <Label className="text-base font-semibold">
        Cuisine Preferences
        <span className="text-sm font-normal text-muted-foreground ml-2">(Optional)</span>
      </Label>
      <p className="text-sm text-muted-foreground">
        Select your preferred cuisines. We'll prioritize recipes from these cuisines in your meal plan.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cuisines.map((cuisine) => (
          <StandardButton
            key={cuisine}
            type="button"
            variant={cuisinePreferences.includes(cuisine) ? "default" : "outline"}
            onClick={() => toggleCuisine(cuisine)}
            size="default"
            className="justify-start font-normal capitalize"
          >
            {cuisine}
          </StandardButton>
        ))}
      </div>
    </div>
  );
}