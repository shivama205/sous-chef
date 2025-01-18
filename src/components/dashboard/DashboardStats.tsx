import { Card } from "@/components/ui/card";
import { Sparkles, ListChecks, Heart } from "lucide-react";

export interface DashboardStatsProps {
  savedPlansCount: number;
  totalFeatureUses: number;
}

export function DashboardStats({ savedPlansCount, totalFeatureUses }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Total Feature Uses</h3>
        </div>
        <p className="text-2xl font-bold">{totalFeatureUses}</p>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Saved Meal Plans</h3>
        </div>
        <p className="text-2xl font-bold">{savedPlansCount}</p>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Active Streak</h3>
        </div>
        <p className="text-2xl font-bold">3 days</p>
      </Card>
    </div>
  );
}