import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from '../components/ui/use-toast';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { generateMealPlan } from '../utils/mealPlanGenerator';
import { Preferences, Cuisine } from '../types/preferences';
import LoadingOverlay from '../components/LoadingOverlay';

const GenerateMealPlan: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({
    days: 7,
    dietaryRestrictions: "",
    cuisinePreferences: [] as Cuisine[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if user is logged in and has credits
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoginDialogOpen(true);
        return;
      }

      const { data: credits } = await supabase
        .from('user_credits')
        .select('credits_available')
        .eq('user_id', session.user.id)
        .single();

      if (!credits || credits.credits_available <= 0) {
        setShowCreditDialog(true);
        return;
      }

      // Consume one credit
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ credits_available: credits.credits_available - 1 })
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
    <div>
      <LoadingOverlay isLoading={isLoading} useRotatingMessages={true} />
      
      {/* Rest of the component code */}

      <Dialog open={showCreditDialog} onOpenChange={setShowCreditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Out of Credits
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              You've run out of credits. Purchase more credits or subscribe to continue generating meal plans.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/pricing')} 
                className="w-full bg-gradient-to-r from-primary to-primary/80"
              >
                View Pricing Plans
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreditDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GenerateMealPlan; 