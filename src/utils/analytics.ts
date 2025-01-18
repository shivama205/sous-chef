import { supabase } from "@/lib/supabase";
import { FeatureName, FeatureMetadata } from "@/types/features";

export async function trackFeatureUsage<T extends FeatureName>(
  featureName: T,
  metadata: FeatureMetadata[T]
) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    await supabase
      .from('user_activity')
      .insert([{
        user_id: session.user.id,
        activity_type: 'feature_use',
        feature_name: featureName,
        metadata
      }]);
  } catch (error) {
    console.error('Error tracking feature usage:', error);
  }
}