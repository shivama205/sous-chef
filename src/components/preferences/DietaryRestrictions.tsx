import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DietaryRestrictionsProps {
  dietaryRestrictions: string;
  setDietaryRestrictions: (restrictions: string) => void;
  isLoading: boolean;
}

export const DietaryRestrictions = ({
  dietaryRestrictions,
  setDietaryRestrictions,
  isLoading,
}: DietaryRestrictionsProps) => {
  return (
    <div className="space-y-2 sm:space-y-4">
      <Label htmlFor="dietaryRestrictions" className="text-base sm:text-lg font-semibold flex items-center gap-2">
        Dietary Restrictions
        <span className="text-xs sm:text-sm text-muted-foreground font-normal">(Optional)</span>
      </Label>
      <Textarea
        id="dietaryRestrictions"
        value={dietaryRestrictions}
        onChange={(e) => setDietaryRestrictions(e.target.value)}
        placeholder="e.g., vegetarian, gluten-free, dairy-free"
        className="min-h-[100px] text-sm sm:text-base resize-none"
        disabled={isLoading}
      />
    </div>
  );
};