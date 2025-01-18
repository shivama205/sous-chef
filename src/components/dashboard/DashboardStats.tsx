import { Card } from "@/components/ui/card";
import { Sparkles, ListChecks, Heart } from "lucide-react";

export interface DashboardStatsProps {
  savedPlansCount: number;
  savedRecipesCount: number;
  totalActivities: number;
}

export function DashboardStats({ savedPlansCount, savedRecipesCount, totalActivities }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Activities in the last week</h3>
        </div>
        <p className="text-2xl font-bold">{totalActivities}</p>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Meal Plans saved in the last week</h3>
        </div>
        <p className="text-2xl font-bold">{savedPlansCount}</p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Recipes saved in the last week</h3>
        </div>
        <p className="text-2xl font-bold">{savedRecipesCount}</p>
      </Card>
    </div>
  );
}