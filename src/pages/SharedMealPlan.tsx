import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";
import NavigationBar from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ChefHat } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { MealPlan } from "@/types/mealPlan";
import html2canvas from 'html2canvas';
import MealPlanDownloadView from "@/components/MealPlanDownloadView";

export function SharedMealPlan() {
  const { id } = useParams<{ id: string }>();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [planName, setPlanName] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const { data, error } = await supabase
          .from("saved_meal_plans")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        
        setMealPlan(data.plan);
        setPlanName(data.name || "Meal Plan");

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
        console.error("Error fetching meal plan:", error);
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
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Meal Plan Not Found</h1>
        <p className="text-gray-600 mb-6">This meal plan may have been deleted or is not publicly accessible.</p>
        <Button onClick={() => window.location.href = "/"}>
          Go to Homepage
        </Button>
      </div>
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
          total + day.meals.reduce((dayTotal, meal) => dayTotal + meal.nutritionInfo.calories, 0), 0)} calories`,
        "proteinContent": `${mealPlan?.days.reduce((total, day) => 
          total + day.meals.reduce((dayTotal, meal) => dayTotal + meal.nutritionInfo.protein, 0), 0)}g`,
        "carbohydrateContent": `${mealPlan?.days.reduce((total, day) => 
          total + day.meals.reduce((dayTotal, meal) => dayTotal + meal.nutritionInfo.carbs, 0), 0)}g`,
        "fatContent": `${mealPlan?.days.reduce((total, day) => 
          total + day.meals.reduce((dayTotal, meal) => dayTotal + meal.nutritionInfo.fat, 0), 0)}g`
      }
    }
  };

  return (
    <>
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

      <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
        <NavigationBar />
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

            {/* Nutrition Summary */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-lg bg-primary/5">
                <p className="text-sm text-gray-600">Calories</p>
                <p className="text-xl font-semibold">
                  {mealPlan.days.reduce((total, day) => 
                    total + day.meals.reduce((dayTotal, meal) => dayTotal + meal.nutritionInfo.calories, 0), 0)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5">
                <p className="text-sm text-gray-600">Protein</p>
                <p className="text-xl font-semibold">
                  {mealPlan.days.reduce((total, day) => 
                    total + day.meals.reduce((dayTotal, meal) => dayTotal + meal.nutritionInfo.protein, 0), 0)}g
                </p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5">
                <p className="text-sm text-gray-600">Carbs</p>
                <p className="text-xl font-semibold">
                  {mealPlan.days.reduce((total, day) => 
                    total + day.meals.reduce((dayTotal, meal) => dayTotal + meal.nutritionInfo.carbs, 0), 0)}g
                </p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5">
                <p className="text-sm text-gray-600">Fat</p>
                <p className="text-xl font-semibold">
                  {mealPlan.days.reduce((total, day) => 
                    total + day.meals.reduce((dayTotal, meal) => dayTotal + meal.nutritionInfo.fat, 0), 0)}g
                </p>
              </div>
            </div>

            {/* Meals */}
            <div className="space-y-6">
              {mealPlan.days.map((day, dayIndex) => (
                <div key={dayIndex} className="p-6 rounded-lg bg-white shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">
                    {day.day}
                  </h2>
                  {day.meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="mb-6 last:mb-0">
                      <h3 className="font-medium mb-2">
                        {meal.time} - {meal.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p>Calories: {meal.nutritionInfo.calories}</p>
                          <p>Protein: {meal.nutritionInfo.protein}g</p>
                          <p>Carbs: {meal.nutritionInfo.carbs}g</p>
                        </div>
                        <div>
                          <p>Fat: {meal.nutritionInfo.fat}g</p>
                          <p>Fiber: {meal.nutritionInfo.fiber}g</p>
                          <p>Sugar: {meal.nutritionInfo.sugar}g</p>
                        </div>
                      </div>
                      {meal.recipeLink && (
                        <a 
                          href={meal.recipeLink} 
                          className="inline-block mt-2 text-sm text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Recipe
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

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
                mealPlan={mealPlan!}
                planName={planName}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default SharedMealPlan; 