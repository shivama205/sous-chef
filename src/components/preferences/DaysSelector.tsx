import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface DaysSelectorProps {
  days: number;
  setDays: (days: number) => void;
  isLoading: boolean;
}

export const DaysSelector = ({ days, setDays, isLoading }: DaysSelectorProps) => {
  return (
    <div className="space-y-4">
      <Label htmlFor="days" className="text-base sm:text-lg font-semibold">Days to Plan</Label>
      <Select
        value={days.toString()}
        onValueChange={(value) => setDays(Number(value))}
        disabled={isLoading}
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
  );
};