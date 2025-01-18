import { FeatureMetadata, FeatureName } from "./features";

export type ActivityType = 
  | "meal_plan_generated"
  | "recipe_finder_used"
  | "healthy_alternative_used"
  | "grocery_list_generated"
  | "meal_plan_saved"
  | "grocery_list_saved";

export interface Activity<T extends FeatureName = FeatureName> {
  id: number;
  user_id: string;
  activity_type: ActivityType;
  feature_name: T;
  metadata: FeatureMetadata[T];
  created_at: string;
}