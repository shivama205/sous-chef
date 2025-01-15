import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";
import NavigationBar from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ChefHat } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { MealPlan } from "@/types/meal-plan";

export function SharedMealPlan() {
  const { id } = useParams<{ id: string }>();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [planName, setPlanName] = useState("");

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
    description: mealPlan?.description || "A healthy meal plan created with SousChef AI.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Recipe",
      "name": planName,
      "description": mealPlan?.description || "A healthy meal plan created with SousChef AI.",
      "datePublished": mealPlan?.created_at,
      "nutrition": {
        "@type": "NutritionInformation",
        "calories": `${mealPlan?.metadata?.calories || 0} calories`,
        "proteinContent": `${mealPlan?.metadata?.protein || 0}g`,
        "carbohydrateContent": `${mealPlan?.metadata?.carbs || 0}g`,
        "fatContent": `${mealPlan?.metadata?.fat || 0}g`
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
        <meta property="og:image" content="https://sous-chef.in/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content="https://sous-chef.in/og-image.jpg" />
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
                <p className="text-gray-600">{mealPlan?.description}</p>
              </div>
            </div>

            {/* Nutrition Summary */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-lg bg-primary/5">
                <p className="text-sm text-gray-600">Calories</p>
                <p className="text-xl font-semibold">{mealPlan.metadata.calories}</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5">
                <p className="text-sm text-gray-600">Protein</p>
                <p className="text-xl font-semibold">{mealPlan.metadata.protein}g</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5">
                <p className="text-sm text-gray-600">Carbs</p>
                <p className="text-xl font-semibold">{mealPlan.metadata.carbs}g</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5">
                <p className="text-sm text-gray-600">Fat</p>
                <p className="text-xl font-semibold">{mealPlan.metadata.fat}g</p>
              </div>
            </div>

            {/* Meals */}
            <div className="space-y-6">
              {mealPlan.meals.map((meal, index) => (
                <div key={meal.id} className="p-6 rounded-lg bg-white shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">
                    Meal {index + 1}: {meal.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{meal.description}</p>

                  {/* Ingredients */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Ingredients</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {meal.ingredients.map((ingredient, i) => (
                        <li key={i} className="text-gray-600">
                          {ingredient.amount} {ingredient.unit} {ingredient.name}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h3 className="font-medium mb-2">Instructions</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      {meal.instructions.map((instruction, i) => (
                        <li key={i} className="text-gray-600">{instruction}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Meal Nutrition */}
                  <div className="mt-4 p-4 rounded-lg bg-primary/5">
                    <h3 className="font-medium mb-2">Nutrition Information</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Calories</p>
                        <p className="font-semibold">{meal.nutritionalInfo.calories}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Protein</p>
                        <p className="font-semibold">{meal.nutritionalInfo.protein}g</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Carbs</p>
                        <p className="font-semibold">{meal.nutritionalInfo.carbs}g</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Fat</p>
                        <p className="font-semibold">{meal.nutritionalInfo.fat}g</p>
                      </div>
                    </div>
                  </div>
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
        </main>
      </div>
    </>
  );
}

export default SharedMealPlan; 