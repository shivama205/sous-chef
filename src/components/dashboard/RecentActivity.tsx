import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Utensils, Apple, Calculator, ChefHat, Search } from "lucide-react";
import { 
  FeatureName, 
  FeatureMetadata, 
  MealPlanGenerationMetadata, 
  HealthyAlternativeMetadata,
  featureDescriptions, 
  RecipeFinderMetadata,
  MacroCalculatorMetadata
} from "@/types/features";
import { Activity } from "@/types/activity";


export const RecentActivity = ({ activities }: { activities: Activity[] }) => {
  const getIcon = (featureName: FeatureName) => {
    switch (featureName) {
      case FeatureName.MEAL_PLAN_GENERATION:
        return <ChefHat className="w-5 h-5 text-primary" />;
      case FeatureName.HEALTHY_ALTERNATIVE:
        return <Leaf className="w-5 h-5 text-green-500" />;
      case FeatureName.RECIPE_FINDER:
        return <Search className="w-5 h-5 text-primary" />;
      case FeatureName.MACRO_CALCULATOR:
        return <Calculator className="w-5 h-5 text-blue-500" />;
      default:
        return <Leaf className="w-5 h-5 text-primary" />;
    }
  };

  const getActivityDescription = (activity: Activity) => {
    const baseDescription = featureDescriptions[activity.feature_name];
    
    if (activity.feature_name === FeatureName.MEAL_PLAN_GENERATION) {
      const metadata = activity.metadata as MealPlanGenerationMetadata;
      if (metadata.input.days) {
        return `${baseDescription} for ${metadata.input.days} days`;
      }
    }

    if (activity.feature_name === FeatureName.HEALTHY_ALTERNATIVE) {
      const metadata = activity.metadata as HealthyAlternativeMetadata;
      const status = metadata.input.mealName ? 'Found' : 'Searched for';
      return `${status} healthy alternatives for ${metadata.input.mealName}`;
    }

    if (activity.feature_name === FeatureName.RECIPE_FINDER) {
      const metadata = activity.metadata as RecipeFinderMetadata;
      const status = metadata.input.ingredients.length > 0 ? 'Found' : 'Searched for';
      return `${status} recipe suggestions for ${metadata.input.ingredients.join(', ')}`;
    }

    if (activity.feature_name === FeatureName.MACRO_CALCULATOR) {
      const metadata = activity.metadata as MacroCalculatorMetadata;
      const status = metadata.age ? 'Calculated' : 'Set';
      return `${status} macro targets for ${metadata.age} year old ${metadata.gender} with ${metadata.activityLevel} activity level`;
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