import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { MealPlan } from "@/types/mealPlan";
import NavigationBar from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import { RefreshCw, Save, Trash2, Share2, Download, ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { LoadingOverlay } from "@/components/LoadingOverlay";
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
import { OutOfCreditDialog } from "@/components/OutOfCreditDialog";
import { LoginDialog } from "@/components/LoginDialog";
import MealPlanDownloadView from "@/components/MealPlanDownloadView";
import { GroceryList } from "@/components/GroceryList";
import html2canvas from "html2canvas";
import { MealPlanLoadingOverlay } from "@/components/MealPlanLoadingOverlay";

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
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

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
      .select('credits, credits_used')
      .eq('user_id', session.user.id)
      .single();

    if (!credits || credits.credits <= 0) {
      setShowCreditDialog(true);
      return;
    }

    // Consume one credit
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ credits: credits.credits - 1, credits_used: credits.credits_used + 1 })
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

    try {
      // Get the saved meal plan to access its preferences
      const { data: savedPlan } = await supabase
        .from('saved_meal_plans')
        .select('plan')
        .eq('id', id)
        .single();

      const preferences = {
        days: mealPlan.days.length,
        cuisinePreferences: savedPlan?.plan?.preferences?.cuisinePreferences || [],
        dietaryRestrictions: savedPlan?.plan?.preferences?.dietaryRestrictions || "",
        targetCalories: savedPlan?.plan?.preferences?.targetCalories,
        targetProtein: savedPlan?.plan?.preferences?.targetProtein,
        targetCarbs: savedPlan?.plan?.preferences?.targetCarbs,
        targetFat: savedPlan?.plan?.preferences?.targetFat,
        mealTargets: savedPlan?.plan?.preferences?.mealTargets,
      };

      const newMealPlan = await generateMealPlan(preferences);
      setMealPlan(newMealPlan);
    } catch (error) {
      toast({
        title: "Error regenerating meal plan",
        description: "Failed to regenerate meal plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
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

  const handleDownload = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const targetRef = isMobile ? downloadRef : previewRef;
    
    if (!targetRef.current) return;

    try {
      const canvas = await html2canvas(targetRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight,
        windowWidth: targetRef.current.offsetWidth,
        windowHeight: targetRef.current.offsetHeight,
      });
      
      const imageUrl = canvas.toDataURL('image/png', 1.0);
      
      // For both mobile and desktop, trigger direct download
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${name || 'meal-plan'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setPreviewOpen(false);
      toast({
        title: "Download successful",
        description: "Your meal plan has been downloaded as an image.",
      });
    } catch (error) {
      console.error('Error downloading:', error);
      toast({
        title: "Download failed",
        description: "Failed to download meal plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!id) return;

    try {
      // First, create a shared link entry in the database
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoginDialogOpen(true);
        return;
      }

      // check if there is a shared link for this meal plan
      const { data: existingShare, error: existingShareError } = await supabase
        .from('shared_meal_plans')
        .select('*')
        .eq('meal_plan_id', id)
        .maybeSingle();

      if (existingShare) {
        const shareUrl = `${window.location.origin}/shared/meal-plan/${existingShare.id}`;
        try {
          if (navigator.share) {
            await navigator.share({
              title: `${name || 'My Meal Plan'} - SousChef`,
              text: "Check out my personalized meal plan created with SousChef!",
              url: shareUrl,
            });
            toast({
              title: "Shared successfully!",
              description: "Your meal plan has been shared.",
            });
          } else {
            await navigator.clipboard.writeText(shareUrl);
            toast({
              title: "Link copied!",
              description: "Share link has been copied to your clipboard.",
            });
          }
        } catch (error) {
          // Only show error if it's not a user cancellation
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error('Error sharing:', error);
            toast({
              title: "Error sharing",
              description: "Failed to share meal plan. Please try again.",
              variant: "destructive",
            });
          }
        }
        return;
      }

      // Create a shared link record
      const { data: newShare, error: createShareError } = await supabase
        .from('shared_meal_plans')
        .insert([{ 
          meal_plan_id: id,
          user_id: session.user.id,
          is_public: true,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }])
        .select()
        .single();

      if (createShareError) {
        console.error('Error creating share link:', createShareError);
        toast({
          title: "Error sharing meal plan",
          description: "Failed to create share link. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const shareUrl = `${window.location.origin}/shared/meal-plan/${newShare.id}`;
      
      try {
        if (navigator.share) {
          await navigator.share({
            title: `${name || 'My Meal Plan'} - SousChef`,
            text: "Check out my personalized meal plan created with SousChef!",
            url: shareUrl,
          });
          toast({
            title: "Shared successfully!",
            description: "Your meal plan has been shared.",
          });
        } else {
          await navigator.clipboard.writeText(shareUrl);
          toast({
            title: "Link copied!",
            description: "Share link has been copied to your clipboard.",
          });
        }
      } catch (error) {
        // Only show error if it's not a user cancellation
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast({
            title: "Error sharing",
            description: "Failed to share meal plan. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error in share process:', error);
      toast({
        title: "Error sharing",
        description: "Failed to share meal plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadClick = () => {
    // Check if mobile device
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // On mobile, trigger download directly
      handleDownload();
    } else {
      // On desktop, show preview dialog
      setPreviewOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
        <NavigationBar />
        <main className="container mx-auto px-4 py-8">
          <MealPlanLoadingOverlay isLoading={true} />
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
          <MealPlanLoadingOverlay isLoading={isRegenerating} />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-primary">
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
                    variant="outline"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary border-primary/20 hover:border-primary/30"
                    onClick={handleDownloadClick}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary border-primary/20 hover:border-primary/30"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button
                    onClick={() => setDeleteDialogOpen(true)}
                    variant="ghost"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 hover:bg-destructive/5 text-muted-foreground hover:text-destructive/70"
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
            {/* Horizontal Scrollable Cards */}
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-max">
                {mealPlan.days.map((day, dayIndex) => (
                  <div 
                    key={dayIndex} 
                    className="bg-white rounded-lg shadow-sm w-[300px]"
                  >
                    <div className="bg-gradient-to-r from-primary to-primary/80 py-3 px-4">
                      <h3 className="text-white font-semibold">{day.day}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {day.meals.map((meal, mealIndex) => (
                        <div key={mealIndex} className="p-4 space-y-3">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500">{meal.time}</div>
                            <div className="font-medium text-gray-900">{meal.name}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-primary/5 p-2 rounded">
                              <div className="text-gray-500 text-xs">Protein</div>
                              <div className="font-medium text-gray-900">{meal.nutritionInfo.protein}g</div>
                            </div>
                            <div className="bg-primary/5 p-2 rounded">
                              <div className="text-gray-500 text-xs">Fat</div>
                              <div className="font-medium text-gray-900">{meal.nutritionInfo.fat}g</div>
                            </div>
                            <div className="bg-primary/5 p-2 rounded">
                              <div className="text-gray-500 text-xs">Carbs</div>
                              <div className="font-medium text-gray-900">{meal.nutritionInfo.carbs}g</div>
                            </div>
                            <div className="bg-primary/5 p-2 rounded">
                              <div className="text-gray-500 text-xs">Calories</div>
                              <div className="font-medium text-gray-900">{meal.nutritionInfo.calories}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-50 p-4">
                      <div className="text-sm font-medium text-gray-900 mb-2">Daily Total</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-white p-2 rounded shadow-sm">
                          <div className="text-gray-500 text-xs">Protein</div>
                          <div className="font-medium text-gray-900">
                            {day.meals.reduce((sum, meal) => sum + meal.nutritionInfo.protein, 0)}g
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded shadow-sm">
                          <div className="text-gray-500 text-xs">Fat</div>
                          <div className="font-medium text-gray-900">
                            {day.meals.reduce((sum, meal) => sum + meal.nutritionInfo.fat, 0)}g
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded shadow-sm">
                          <div className="text-gray-500 text-xs">Carbs</div>
                          <div className="font-medium text-gray-900">
                            {day.meals.reduce((sum, meal) => sum + meal.nutritionInfo.carbs, 0)}g
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded shadow-sm">
                          <div className="text-gray-500 text-xs">Calories</div>
                          <div className="font-medium text-gray-900">
                            {day.meals.reduce((sum, meal) => sum + meal.nutritionInfo.calories, 0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grocery List Section */}
            {isSaved ? (
              <GroceryList mealPlan={mealPlan} />
            ) : (
              <div className="mt-8 p-6 bg-secondary/5 rounded-lg border border-secondary/10">
                <div className="flex items-center gap-3 mb-4">
                  <ShoppingCart className="w-5 h-5 text-secondary" />
                  <h3 className="text-lg font-semibold text-secondary">Save to View Grocery List</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Save your meal plan to generate a comprehensive grocery list with all the ingredients you'll need.
                </p>
                <Button onClick={() => setOpen(true)} variant="secondary" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Meal Plan
                </Button>
              </div>
            )}
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

        <div className="absolute opacity-0 pointer-events-none">
          <MealPlanDownloadView
            ref={downloadRef}
            mealPlan={mealPlan}
            planName={name || "Your Meal Plan"}
          />
        </div>

        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-[95vw] w-full lg:max-w-[900px] p-2 sm:p-6 bg-gradient-to-br from-primary/[0.02] to-transparent overflow-y-auto max-h-[95vh]">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-lg sm:text-xl font-bold text-primary">Preview Download</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Review how your meal plan will look when downloaded
              </DialogDescription>
            </DialogHeader>
            
            <div className="my-2 sm:my-4 overflow-x-auto">
              <div ref={previewRef} className="min-w-[320px] w-full">
                <MealPlanDownloadView mealPlan={mealPlan} planName={name || "Your Meal Plan"} />
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2 mt-2 sm:mt-4">
              <Button
                variant="outline"
                onClick={() => setPreviewOpen(false)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border-primary/20 hover:border-primary/30 text-primary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDownload}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70"
              >
                <Download className="w-4 h-4" />
                Download Image
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default MealPlanDetails;
