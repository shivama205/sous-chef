import { supabase } from "@/lib/supabase";

export type FeatureEvent = 
  | "recipe_finder_used"
  | "meal_plan_generated" 
  | "meal_plan_saved"
  | "grocery_list_generated"
  | "grocery_list_saved"
  | "healthy_alternative_used";

export const trackFeatureUsage = async (featureEvent: FeatureEvent) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    console.log(`Tracking feature usage: ${featureEvent}`);

    const { error } = await supabase
      .from('feature_analytics')
      .insert({
        user_id: session.user.id,
        feature_name: featureEvent,
        used_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error tracking feature usage:', error);
    }
  } catch (error) {
    console.error('Error in trackFeatureUsage:', error);
  }
};