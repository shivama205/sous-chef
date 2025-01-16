import { Button } from "@/components/ui/button";
import { Cuisine } from "@/types/preferences";

interface CuisineSelectorProps {
  cuisinePreferences: Cuisine[];
  setCuisinePreferences: (cuisines: Cuisine[]) => void;
}

const availableCuisines: Cuisine[] = [
  "italian",
  "mexican",
  "indian",
  "chinese",
  "japanese",
  "thai",
  "mediterranean",
  "american",
  "french",
  "korean"
];

export function CuisineSelector({ cuisinePreferences, setCuisinePreferences }: CuisineSelectorProps) {
  const toggleCuisine = (cuisine: Cuisine) => {
    if (cuisinePreferences.includes(cuisine)) {
      setCuisinePreferences(cuisinePreferences.filter(c => c !== cuisine));
    } else {
      setCuisinePreferences([...cuisinePreferences, cuisine]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {availableCuisines.map((cuisine) => (
        <Button
          key={cuisine}
          type="button"
          variant={cuisinePreferences.includes(cuisine) ? "default" : "outline"}
          onClick={() => toggleCuisine(cuisine)}
          className="w-full capitalize"
        >
          {cuisine}
        </Button>
      ))}
    </div>
  );
}