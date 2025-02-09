import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ChefHat, Download, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { MealPlan } from "@/types/mealPlan";
import html2canvas from 'html2canvas';
import MealPlanDownloadView from "@/components/MealPlanDownloadView";
import { motion } from "framer-motion";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { SEO } from "@/components/SEO";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SharedMealPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [planName, setPlanName] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const { data: sharedPlan, error: sharedError } = await supabase
          .from("shared_meal_plans")
          .select("meal_plan_id")
          .eq("id", id)
          .maybeSingle()

        if (sharedError) {
          console.error("Error fetching shared meal plan:", sharedError);
          setIsLoading(false);
          return;
        }

        const { data: mealPlanData, error: mealPlanError } = await supabase
          .from("saved_meal_plans")
          .select("*")
          .eq("id", sharedPlan.meal_plan_id)
          .single();

        if (mealPlanError) {
          console.error("Error fetching meal plan:", mealPlanError);
          toast({
            title: "Error",
            description: "Failed to load meal plan. Please try again.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        setMealPlan(mealPlanData.plan);
        setPlanName(mealPlanData.name || "Meal Plan");

        // Generate preview image after meal plan is loaded
        if (previewRef.current) {
          const canvas = await html2canvas(previewRef.current, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
            logging: false,
          });
          const imageUrl = canvas.toDataURL('image/png', 1.0);
          setPreviewImageUrl(imageUrl);
        }
      } catch (error) {
        console.error("Error in meal plan fetch process:", error);
        toast({
          title: "Error",
          description: "Failed to load meal plan. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMealPlan();
    } else {
      setIsLoading(false);
    }
  }, [id]);

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
      });
      
      const imageUrl = canvas.toDataURL('image/png', 1.0);
      
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${planName || 'meal-plan'}.png`;
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

  const handleDownloadClick = () => {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      handleDownload();
    } else {
      setPreviewOpen(true);
    }
  };

  if (isLoading) {
    return (
      <BaseLayout>
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </main>
      </BaseLayout>
    );
  }

  if (!mealPlan) {
    return (
      <BaseLayout>
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <ChefHat className="w-12 h-12 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-primary mb-2">Meal Plan Not Found</h1>
            <p className="text-muted-foreground">This meal plan may have expired or been deleted.</p>
          </div>
        </main>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <SEO
        title={`${planName} - Shared Meal Plan`}
        description={`Check out this personalized meal plan created using SideChef AI!`}
        canonical={`https://mysidechef.com/shared/meal-plan/${id}`}
        image={previewImageUrl || "https://mysidechef.com/og-image.jpg"}
        type="article"
      />
      <div className="flex flex-col min-h-screen">
        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {planName}
              </h2>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary border-primary/20 hover:border-primary/30"
                onClick={handleDownloadClick}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Meal Plan Days Section */}
              <div className="space-y-6">
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-4 min-w-max">
                    {mealPlan.days.map((day, index) => (
                      <div 
                        key={index} 
                        className="bg-white rounded-lg shadow-sm w-[300px]"
                      >
                        <div className="bg-gradient-to-r from-primary to-primary/80 py-3 px-4">
                          <h3 className="text-white font-semibold">{day.day}</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {day.meals.map((meal, mealIndex) => (
                            <div key={mealIndex} className="p-4 space-y-3">
                              <div>
                                <div className="text-gray-500 text-sm">{meal.time}</div>
                                <div className="font-medium">{meal.name}</div>
                              </div>
                              <div className="grid grid-cols-4 gap-2">
                                <div className="bg-white p-2 rounded shadow-sm">
                                  <div className="text-gray-500 text-xs">Protein</div>
                                  <div className="font-medium text-gray-900">
                                    {meal.nutritionalValue.protein}g
                                  </div>
                                </div>
                                <div className="bg-white p-2 rounded shadow-sm">
                                  <div className="text-gray-500 text-xs">Fat</div>
                                  <div className="font-medium text-gray-900">
                                    {meal.nutritionalValue.fat}g
                                  </div>
                                </div>
                                <div className="bg-white p-2 rounded shadow-sm">
                                  <div className="text-gray-500 text-xs">Carbs</div>
                                  <div className="font-medium text-gray-900">
                                    {meal.nutritionalValue.carbs}g
                                  </div>
                                </div>
                                <div className="bg-white p-2 rounded shadow-sm">
                                  <div className="text-gray-500 text-xs">Cal</div>
                                  <div className="font-medium text-gray-900">
                                    {meal.nutritionalValue.calories}
                                  </div>
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
                                {day.meals.reduce((sum, meal) => sum + meal.nutritionalValue.protein, 0)}g
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded shadow-sm">
                              <div className="text-gray-500 text-xs">Fat</div>
                              <div className="font-medium text-gray-900">
                                {day.meals.reduce((sum, meal) => sum + meal.nutritionalValue.fat, 0)}g
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded shadow-sm">
                              <div className="text-gray-500 text-xs">Carbs</div>
                              <div className="font-medium text-gray-900">
                                {day.meals.reduce((sum, meal) => sum + meal.nutritionalValue.carbs, 0)}g
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded shadow-sm">
                              <div className="text-gray-500 text-xs">Calories</div>
                              <div className="font-medium text-gray-900">
                                {day.meals.reduce((sum, meal) => sum + meal.nutritionalValue.calories, 0)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <Card className="p-6 mt-8 bg-white border shadow-sm">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
                  <ChefHat className="w-4 h-4" />
                  Create Your Own
                </div>
                <p className="text-lg font-medium">Create your own personalized meal plan with MySideChef</p>
                <p className="text-muted-foreground">Get AI-powered meal suggestions tailored to your nutritional goals</p>
                <Button 
                  onClick={() => navigate("/meal-plan")} 
                  className="bg-primary hover:bg-primary/90"
                >
                  Create Your Own Meal Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Preview Dialog */}
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
              <MealPlanDownloadView mealPlan={mealPlan} planName={planName} />
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

      {/* Hidden download view */}
      <div className="hidden">
        <div ref={downloadRef}>
          <MealPlanDownloadView
            mealPlan={mealPlan}
            planName={planName}
          />
        </div>
      </div>
    </BaseLayout>
  );
}

export default SharedMealPlan; 