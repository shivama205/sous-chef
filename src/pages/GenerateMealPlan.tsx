import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from '../components/ui/use-toast';
import { StandardButton } from '../components/ui/StandardButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { generateMealPlan } from '../utils/mealPlanGenerator';
import { Preferences, Cuisine } from '../types/preferences';
import { MealPlanLoadingOverlay } from '@/components/MealPlanLoadingOverlay';

const GenerateMealPlan: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({
    days: 7,
    targetCalories: 2000,
    targetProtein: 100,
    dietaryRestrictions: "",
    cuisinePreferences: [] as Cuisine[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoginDialogOpen(true);
        return;
      }

      const { data: credits } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', session.user.id)
        .single();

      if (!credits || credits.credits <= 0) {
        setShowCreditDialog(true);
        return;
      }

      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ credits: credits.credits - 1 })
        .eq('user_id', session.user.id);

      if (updateError) {
        toast({
          title: "Error updating credits",
          description: "Failed to update credits. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const mealPlan = await generateMealPlan(preferences);
      navigate("/meal-plan", { state: { mealPlan } });
    } catch (error) {
      toast({
        title: "Error generating meal plan",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <MealPlanLoadingOverlay isLoading={isLoading} />
      
      <Dialog open={showCreditDialog} onOpenChange={setShowCreditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Out of Credits
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              You've run out of credits. Purchase more credits or subscribe to continue generating meal plans.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <StandardButton 
              onClick={() => navigate('/pricing')} 
              className="w-full bg-gradient-to-r from-primary to-primary/80"
              size="default"
            >
              View Pricing Plans
            </StandardButton>
          </div>
          <DialogFooter>
            <StandardButton
              variant="outline"
              onClick={() => setShowCreditDialog(false)}
              size="default"
            >
              Cancel
            </StandardButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GenerateMealPlan;