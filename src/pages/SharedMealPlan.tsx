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
import { motion } from "framer-motion";

export function SharedMealPlan() {
  const { id } = useParams<{ id: string }>();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [planName, setPlanName] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMealPlan = async () => {
        console.log("Fetching meal plan with ID:", id);
      try {
        const { data, error } = await supabase
          .from("saved_meal_plans")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.log("Error fetching meal plan:", error);
          toast({
            title: "Error",
            description: "Failed to load meal plan. Please try again.",
            variant: "destructive",
          });
        }
        
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
    } else {
      console.log("No ID provided");
      setIsLoading(false);
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
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
                            {meal.recipeLink && (
                              <a 
                                href={meal.recipeLink} 
                                className="text-sm text-primary hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Recipe
                              </a>
                            )}
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