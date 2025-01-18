import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Utensils, Apple, Calculator } from "lucide-react";
import { 
  FeatureName, 
  FeatureMetadata, 
  MealPlanMetadata, 
  HealthyAlternativeMetadata,
  featureDescriptions 
} from "@/types/features";

interface Activity<T extends FeatureName = FeatureName> {
  id: number;
  user_id: string;
  activity_type: string;
  feature_name: T;
  metadata: FeatureMetadata[T];
  created_at: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getIcon = (featureName: FeatureName) => {
    switch (featureName) {
      case "meal_plan_generation":
        return <Utensils className="w-5 h-5 text-primary" />;
      case "healthy_alternative":
        return <Apple className="w-5 h-5 text-green-500" />;
      case "macro_calculator":
        return <Calculator className="w-5 h-5 text-blue-500" />;
      default:
        return <Leaf className="w-5 h-5 text-primary" />;
    }
  };

  const getActivityDescription = (activity: Activity) => {
    const baseDescription = featureDescriptions[activity.feature_name];
    
    if (activity.feature_name === 'meal_plan_generation') {
      const metadata = activity.metadata as MealPlanMetadata;
      if (metadata.days) {
        return `${baseDescription} for ${metadata.days} days`;
      }
    }

    if (activity.feature_name === 'healthy_alternative') {
      const metadata = activity.metadata as HealthyAlternativeMetadata;
      const status = metadata.success ? 'Found' : 'Searched for';
      return `${status} healthy alternatives for ${metadata.mealName}`;
    }
    
    return baseDescription;
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
              {getIcon(activity.feature_name)}
              <div>
                <p className="text-sm font-medium">{getActivityDescription(activity)}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                  })}
                </p>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};