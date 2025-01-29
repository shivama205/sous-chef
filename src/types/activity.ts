import { FeatureMetadata, FeatureName } from "./features";

export type ActivityType = 
  | "meal_plan_generated"
  | "recipe_finder_used"
  | "healthy_alternative_used"
  | "grocery_list_generated"
  | "meal_plan_saved"
  | "grocery_list_saved";

export interface Activity<T extends FeatureName = FeatureName> {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  created_at: string;
  metadata?: Record<string, any>;
}