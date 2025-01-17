import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";

export type FeatureName = 
  | "meal_plan_generation"
  | "recipe_finder"
  | "healthy_alternative";

interface CreditUseResult {
  success: boolean;
  error: Error | null;
  remainingCredits?: number;
}

interface UseCreditsOptions {
  onError?: (error: Error) => void;
  onInsufficientCredits?: () => void;
}

interface CreditMetadata {
  days?: number;
  hasRestrictions?: boolean;
  cuisinePreferences?: string[];
  ingredients?: string[];
  [key: string]: unknown;
}

const useCredits = (options: UseCreditsOptions = {}) => {
  const { toast } = useToast();
  const { user } = useUser();
  const [isTracking, setIsTracking] = useState(false);

  const trackFeatureUse = async (
    featureName: FeatureName,
    metadata?: CreditMetadata
  ): Promise<CreditUseResult> => {
    if (!user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    setIsTracking(true);
    try {
      // Get current credits and usage
      const { data: userCredits, error: fetchError } = await supabase
        .from('user_credits')
        .select('credits, credits_used')
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      const currentCredits = userCredits?.credits ?? 0;
      const currentUsage = userCredits?.credits_used ?? 0;

      // Check if user has sufficient credits
      if (currentCredits <= 0) {
        options.onInsufficientCredits?.();
        return {
          success: false,
          error: new Error('Insufficient credits'),
          remainingCredits: 0
        };
      }

      // Update user credits
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ 
          credits_used: currentUsage + 1
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Record the transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          feature_name: featureName,
          credits_used: 1,
          transaction_type: 'debit',
          metadata
        });

      if (transactionError) throw transactionError;

      return {
        success: true,
        error: null,
        remainingCredits: Math.max(0, currentCredits - 1)
      };
    } catch (error) {
      const err = error as Error;
      options.onError?.(err);
      console.error('Error tracking feature use:', err);
      return { success: false, error: err };
    } finally {
      setIsTracking(false);
    }
  };

  return {
    trackFeatureUse,
    isTracking
  };
};

export { useCredits }; 