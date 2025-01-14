import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Utensils, Apple } from "lucide-react";

interface Activity {
  id: number;
  type: "meal_plan" | "healthy_swap";
  description: string;
  date: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "meal_plan":
        return <Utensils className="w-5 h-5 text-primary" />;
      case "healthy_swap":
        return <Apple className="w-5 h-5 text-green-500" />;
      default:
        return <Leaf className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              {getIcon(activity.type)}
              <div>
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};