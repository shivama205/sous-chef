import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DietaryRestrictionsProps {
  dietaryRestrictions: string;
  setDietaryRestrictions: (value: string) => void;
  isLoading?: boolean;
}

export function DietaryRestrictions({
  dietaryRestrictions,
  setDietaryRestrictions,
  isLoading,
}: DietaryRestrictionsProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="dietaryRestrictions" className="text-base sm:text-lg font-semibold">
        Dietary Restrictions
        <span className="text-xs sm:text-sm text-muted-foreground font-normal ml-2">(Optional)</span>
      </Label>
      <Textarea
        id="dietaryRestrictions"
        value={dietaryRestrictions}
        onChange={(e) => setDietaryRestrictions(e.target.value)}
        placeholder="Enter any dietary restrictions or allergies (e.g., gluten-free, dairy-free, nut allergies)"
        className="min-h-[100px] text-base"
        disabled={isLoading}
      />
      <p className="text-sm text-muted-foreground">
        List any foods you want to avoid or can't eat. We'll ensure your meal plan accommodates these restrictions.
      </p>
    </div>
  );
}