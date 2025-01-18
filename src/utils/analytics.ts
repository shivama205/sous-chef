import { supabase } from "@/lib/supabase";
import type { ActivityType, ActivityMetadata } from "@/types/activity";

export const trackFeatureUsage = async (
  activityType: ActivityType,
  metadata: ActivityMetadata = {}
) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    console.log(`Tracking feature usage: ${activityType}`, metadata);

    const { error } = await supabase
      .from('user_activity')
      .insert({
        user_id: session.user.id,
        activity_type: activityType,
        metadata,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error tracking feature usage:', error);
    }
  } catch (error) {
    console.error('Error in trackFeatureUsage:', error);
  }
};