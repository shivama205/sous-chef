import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DaysToGenerateProps {
  days: number;
  setDays: (days: number) => void;
  isLoading?: boolean;
}

export function DaysToGenerate({ days, setDays, isLoading }: DaysToGenerateProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="days" className="text-base sm:text-lg font-semibold">
        Days to Generate
        <span className="text-xs sm:text-sm text-muted-foreground font-normal ml-2">(Optional)</span>
      </Label>
      <Input
        id="days"
        type="number"
        min={1}
        max={14}
        value={days}
        onChange={(e) => setDays(parseInt(e.target.value) || 7)}
        placeholder="Default: 7 days"
        className="h-10 text-base w-full"
        disabled={isLoading}
      />
      <p className="text-sm text-muted-foreground">
        Choose between 1-14 days. We recommend 7 days for optimal meal planning.
      </p>
    </div>
  );
} 