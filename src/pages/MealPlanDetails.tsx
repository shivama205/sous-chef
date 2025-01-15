import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { MealPlan } from "@/types/mealPlan";
import NavigationBar from "@/components/NavigationBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Save, Trash2, Share2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { generateMealPlan } from "@/utils/mealPlanGenerator";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import html2canvas from 'html2canvas';
import { OutOfCreditDialog } from "@/components/OutOfCreditDialog";
import { LoginDialog } from "@/components/LoginDialog";

const loadingMessages = [
  "Cooking up your perfect meal plan... 🍳",
  "Mixing healthy ingredients... 🥗",
  "Balancing your macros... 💪",
  "Sprinkling some nutrition magic... ✨",
  "Taste-testing your menu... 😋",
  "Adding a pinch of variety... 🌮",
  "Making sure everything is delicious... 🍽️",
  "Almost ready to serve... 🍽️"
];

export const MealPlanDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [open, setOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const mealPlanRef = useRef<HTMLDivElement>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [loadingInterval, setLoadingInterval] = useState<NodeJS.Timeout | null>(null);
  const [showCreditDialog, setShowCreditDialog] = useState(false);

  // If the meal plan is passed through location state, use it
  useEffect(() => {
    if (location.state?.mealPlan) {
      setMealPlan(location.state.mealPlan);
      setIsSaved(false);
      setIsLoading(false);
      return;
    }

    // Otherwise fetch it from the database if we have an ID
    const fetchMealPlan = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('saved_meal_plans')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching meal plan:', error);
        setIsLoading(false);
        return;
      }

      setMealPlan(data.plan);
      setName(data.name || "");
      setIsSaved(true);
      setIsLoading(false);
    };

    fetchMealPlan();
  }, [id, location.state]);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (loadingInterval) {
        clearInterval(loadingInterval);
      }
    };
  }, [loadingInterval]);

  const startLoadingMessages = () => {
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);
    setLoadingInterval(interval);
  };

  const stopLoadingMessages = () => {
    if (loadingInterval) {
      clearInterval(loadingInterval);
      setLoadingInterval(null);
    }
  };

  const checkAndConsumeCredit = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setLoginDialogOpen(true);
      return false;
    }

    const { data: credits } = await supabase
      .from('user_credits')
      .select('credits_available')
      .eq('user_id', session.user.id)
      .single();

    if (!credits || credits.credits_available <= 0) {
      setShowCreditDialog(true);
      return false;
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
      return false;
    }

    return true;
  };

  const handleRegenerateMealPlan = async () => {
    if (!mealPlan) return;

    // Check if user is logged in and has credits
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setLoginDialogOpen(true);
      return;
    }

    const { data: credits } = await supabase
      .from('user_credits')
      .select('credits_available, credits_used')
      .eq('user_id', session.user.id)
      .single();

    if (!credits || credits.credits_available <= 0) {
      setShowCreditDialog(true);
      return;
    }

    // Consume one credit
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ credits_available: credits.credits_available - 1, credits_used: credits.credits_used + 1 })
      .eq('user_id', session.user.id);

    if (updateError) {
      toast({
        title: "Error updating credits",
        description: "Failed to update credits. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    setIsRegenerating(true);
    startLoadingMessages();

    try {
      const newMealPlan = await generateMealPlan({
        days: mealPlan.days.length,
        // Add other preferences if available in your meal plan data
      });
      setMealPlan(newMealPlan);
    } catch (error) {
      toast({
        title: "Error regenerating meal plan",
        description: "Failed to regenerate meal plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
      stopLoadingMessages();
    }
  };

  const handleSaveMealPlan = async () => {
    if (!mealPlan) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setLoginDialogOpen(true);
      return;
    }

    const { data, error } = await supabase
      .from("saved_meal_plans")
      .insert([{ user_id: session.user.id, name: name, plan: mealPlan }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error saving meal plan",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Meal plan saved!",
        description: "Your meal plan has been saved successfully.",
      });
      setOpen(false);
      setName("");
      // Navigate to the saved meal plan's page
      navigate(`/meal-plan/${data.id}`, { replace: true });
    }
  };

  const handleDeleteMealPlan = async () => {
    if (!id) return;
    setIsDeleting(true);
    
    const { error } = await supabase
      .from("saved_meal_plans")
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error deleting meal plan",
        description: error.message,
        variant: "destructive",
      });
      setIsDeleting(false);
    } else {
      toast({
        title: "Meal plan deleted",
        description: "Your meal plan has been deleted successfully.",
      });
      navigate('/profile');
    }
  };

  const handleShare = async () => {
    if (!mealPlanRef.current) return;

    try {
      const canvas = await html2canvas(mealPlanRef.current);
      const imageUrl = canvas.toDataURL('image/jpeg', 0.8); // Using JPEG for smaller size
      
      // Create a temporary link to download the image
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'meal-plan.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Open WhatsApp with a message
      const whatsappUrl = `https://wa.me/?text=Check out my meal plan from HungryHub! 🍽️%0A%0APlease find the meal plan image attached.`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      // Only log the error, don't show toast
      console.error('Error sharing:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
        <NavigationBar />
        <main className="container mx-auto px-4 py-8">
          <div>Loading...</div>
        </main>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
        <NavigationBar />
        <main className="container mx-auto px-4 py-8">
          <div>Meal plan not found</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {isRegenerating && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-10">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <p className="text-lg font-medium text-primary">{loadingMessages[loadingMessageIndex]}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {isSaved ? name || "Your Meal Plan" : "Your Generated Meal Plan"}
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
              {!isSaved ? (
                <>
                  <Button
                    onClick={handleRegenerateMealPlan}
                    variant="outline"
                    disabled={isRegenerating}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                    {isRegenerating ? "Regenerating..." : "Regenerate"}
                  </Button>
                  <Button
                    onClick={() => setOpen(true)}
                    disabled={isRegenerating}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    variant="secondary"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setDeleteDialogOpen(true)}
                    variant="ghost"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 hover:text-destructive"
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </>
              )}
            </div>
          </div>

          <motion.div
            ref={mealPlanRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {isRegenerating && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-10">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <p className="text-lg font-medium text-primary">{loadingMessages[loadingMessageIndex]}</p>
                </div>
              </div>
            )}
            
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary to-primary/80">
                <tr>
                  <th className="py-4 px-6 text-left text-white font-semibold">Day</th>
                  <th className="py-4 px-6 text-left text-white font-semibold">Meal</th>
                  <th className="py-4 px-6 text-center text-white font-semibold">Protein (g)</th>
                  <th className="py-4 px-6 text-center text-white font-semibold">Fat (g)</th>
                  <th className="py-4 px-6 text-center text-white font-semibold">Carbs (g)</th>
                  <th className="py-4 px-6 text-center text-white font-semibold">Calories</th>
                </tr>
              </thead>
              <tbody>
                {mealPlan.days.map((day, dayIndex) => (
                  <React.Fragment key={`day-${dayIndex}`}>
                    {day.meals.map((meal, mealIndex) => (
                      <tr 
                        key={`${dayIndex}-${mealIndex}`}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                      >
                        {mealIndex === 0 && (
                          <td 
                            className="py-4 px-6 font-medium"
                            rowSpan={day.meals.length}
                          >
                            {day.day}
                          </td>
                        )}
                        <td className="py-4 px-6">
                          <div className="font-medium">{meal.name}</div>
                          <div className="text-sm text-gray-500">{meal.time}</div>
                        </td>
                        <td className="py-4 px-6 text-center">{meal.nutritionInfo.protein}</td>
                        <td className="py-4 px-6 text-center">{meal.nutritionInfo.fat}</td>
                        <td className="py-4 px-6 text-center">{meal.nutritionInfo.carbs}</td>
                        <td className="py-4 px-6 text-center">{meal.nutritionInfo.calories}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50/80 font-semibold">
                      <td colSpan={2} className="py-3 px-6">Daily Total</td>
                      <td className="py-3 px-6 text-center">
                        {day.meals.reduce((sum, meal) => sum + meal.nutritionInfo.protein, 0)}g
                      </td>
                      <td className="py-3 px-6 text-center">
                        {day.meals.reduce((sum, meal) => sum + meal.nutritionInfo.fat, 0)}g
                      </td>
                      <td className="py-3 px-6 text-center">
                        {day.meals.reduce((sum, meal) => sum + meal.nutritionInfo.carbs, 0)}g
                      </td>
                      <td className="py-3 px-6 text-center">
                        {day.meals.reduce((sum, meal) => sum + meal.nutritionInfo.calories, 0)}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Save Meal Plan
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Give your meal plan a memorable name to find it easily later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="meal-plan-name" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Meal Plan Name
                </Label>
                <Input
                  id="meal-plan-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Weekly Healthy Plan"
                  className="h-11"
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="mt-2 sm:mt-0"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSaveMealPlan}
                disabled={!name.trim()}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                Save Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <LoginDialog 
          open={loginDialogOpen} 
          onOpenChange={setLoginDialogOpen} 
        />

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Meal Plan</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this meal plan? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteMealPlan}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <OutOfCreditDialog 
          open={showCreditDialog} 
          onOpenChange={setShowCreditDialog} 
        />
      </main>
    </div>
  );
};

export default MealPlanDetails;
