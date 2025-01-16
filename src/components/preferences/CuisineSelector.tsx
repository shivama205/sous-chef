import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Cuisine } from "@/types/preferences";

interface CuisineSelectorProps {
  cuisinePreferences: Cuisine[];
  setCuisinePreferences: (cuisines: Cuisine[]) => void;
  isLoading: boolean;
}

export const CuisineSelector = ({
  cuisinePreferences,
  setCuisinePreferences,
  isLoading,
}: CuisineSelectorProps) => {
  return (
    <div className="space-y-4">
      <Label className="text-base sm:text-lg font-semibold flex items-center gap-2">
        Preferred Cuisines
        <span className="text-xs sm:text-sm text-muted-foreground font-normal">(Optional)</span>
      </Label>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Click multiple cuisines to include them in your meal plan. Leave all unselected to include dishes from any cuisine.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
          {Object.entries(Cuisine).map(([key, cuisine]) => (
            <Button
              key={`cuisine-${key}`}
              type="button"
              variant={cuisinePreferences.includes(cuisine) ? "default" : "outline"}
              onClick={() => {
                setCuisinePreferences(prev =>
                  prev.includes(cuisine)
                    ? prev.filter(c => c !== cuisine)
                    : [...prev, cuisine]
                );
              }}
              className="w-full h-10 sm:h-12 text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105"
              disabled={isLoading}
            >
              {cuisine}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};