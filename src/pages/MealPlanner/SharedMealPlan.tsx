import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ChefHat } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { MealPlan } from "@/types/mealPlan";
import html2canvas from 'html2canvas';
import MealPlanDownloadView from "@/components/MealPlanDownloadView";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import { BaseLayout } from "@/components/layouts/BaseLayout";

export function SharedMealPlan() {
  const { id } = useParams();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [planName, setPlanName] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        // First try to get the shared meal plan record
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

        // Then get the actual meal plan using the meal_plan_id
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

  const seoData = {
    title: `${planName} - SousChef Meal Plan`,
    description: "A personalized meal plan created with SousChef AI.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Recipe",
      "name": planName,
      "description": "A personalized meal plan created with SousChef AI.",
      "image": previewImageUrl || "https://sous-chef.in/og-image.jpg",
      "nutrition": {
        "@type": "NutritionInformation",
        "calories": `${mealPlan?.days.reduce((total, day) => 
          total + day.meals.reduce((dayTotal, meal) => dayTotal + meal.nutritionalValue.calories, 0), 0)} calories`,
        "proteinContent": `${mealPlan?.days.reduce((total, day) => 
          total + day.meals.reduce((dayTotal, meal) => dayTotal + meal.nutritionalValue.protein, 0), 0)}g`,
        "carbohydrateContent": `${mealPlan?.days.reduce((total, day) => 
          total + day.meals.reduce((dayTotal, meal) => dayTotal + meal.nutritionalValue.carbs, 0), 0)}g`,
        "fatContent": `${mealPlan?.days.reduce((total, day) => 
          total + day.meals.reduce((dayTotal, meal) => dayTotal + meal.nutritionalValue.fat, 0), 0)}g`
      }
    }
  };

  return (
    <BaseLayout>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        image={previewImageUrl || "https://sous-chef.in/og-image.jpg"}
        type="article"
        keywords={["meal plan", "healthy eating", "nutrition plan", "personalized diet", "AI meal planning"]}
      />
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://sous-chef.in/shared/meal-plan/${id}`} />
        <meta property="og:image" content={previewImageUrl || "https://sous-chef.in/og-image.jpg"} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={previewImageUrl || "https://sous-chef.in/og-image.jpg"} />
        <script type="application/ld+json">
          {JSON.stringify(seoData.structuredData)}
        </script>
      </Helmet>
      <main className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{planName}</h1>
              <p className="text-gray-600">A personalized meal plan created with SousChef AI</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
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
                              <div className="font-medium text-gray-900">{meal.nutritionalValue.protein}g</div>
                            </div>
                            <div className="bg-primary/5 p-2 rounded">
                              <div className="text-gray-500 text-xs">Fat</div>
                              <div className="font-medium text-gray-900">{meal.nutritionalValue.fat}g</div>
                            </div>
                            <div className="bg-primary/5 p-2 rounded">
                              <div className="text-gray-500 text-xs">Carbs</div>
                              <div className="font-medium text-gray-900">{meal.nutritionalValue.carbs}g</div>
                            </div>
                            <div className="bg-primary/5 p-2 rounded">
                              <div className="text-gray-500 text-xs">Calories</div>
                              <div className="font-medium text-gray-900">{meal.nutritionalValue.calories}</div>
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
          </motion.div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Create your own personalized meal plan with SousChef</p>
            <Button onClick={() => window.location.href = "/meal-plan"} className="w-full max-w-md">
              Create Your Own Meal Plan
            </Button>
          </div>
        </Card>

        {/* Hidden preview element for generating share image */}
        <div className="hidden">
          <div ref={previewRef}>
            <MealPlanDownloadView
              mealPlan={mealPlan}
              planName={planName}
            />
          </div>
        </div>
      </main>
    </BaseLayout>
  );
}

export default SharedMealPlan; 