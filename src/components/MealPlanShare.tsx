import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { MealPlanShareProps } from "@/types/mealPlan";

export const MealPlanShare: React.FC<MealPlanShareProps> = ({
  mealPlanId,
  mealPlanData,
  planName,
}) => {
  const handleShare = async () => {
    const shareUrl = `https://mysidechef.com/shared/meal-plan/${mealPlanId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${planName} - MySideChef Meal Plan`,
          text: "Check out this personalized meal plan I created using MySideChef AI!",
          url: shareUrl,
        });
      } catch (error) {
        // Fallback to copying to clipboard
        await copyToClipboard(shareUrl);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      await copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Link copied!",
        description: "Share the link with your friends and family.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy link",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    try {
      // Calculate total nutrition values
      const totalNutrition = mealPlanData.days.reduce((total, day) => {
        const dayTotal = day.meals.reduce((mealTotal, meal) => ({
          calories: mealTotal.calories + meal.nutritionalValue.calories,
          protein: mealTotal.protein + meal.nutritionalValue.protein,
          carbs: mealTotal.carbs + meal.nutritionalValue.carbs,
          fat: mealTotal.fat + meal.nutritionalValue.fat,
        }), {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        });
        return {
          calories: total.calories + dayTotal.calories,
          protein: total.protein + dayTotal.protein,
          carbs: total.carbs + dayTotal.carbs,
          fat: total.fat + dayTotal.fat,
        };
      }, {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      });

      // Format the meal plan data for better readability
      const formattedData = {
        name: planName,
        totalNutrition: {
          calories: totalNutrition.calories,
          protein: `${totalNutrition.protein}g`,
          carbs: `${totalNutrition.carbs}g`,
          fat: `${totalNutrition.fat}g`,
        },
        days: mealPlanData.days.map(day => ({
          day: day.day,
          meals: day.meals.map(meal => ({
            name: meal.name,
            time: meal.time,
            recipeLink: meal.recipeLink,
            nutritionalValue: {
              calories: meal.nutritionalValue.calories,
              protein: `${meal.nutritionalValue.protein}g`,
              carbs: `${meal.nutritionalValue.carbs}g`,
              fat: `${meal.nutritionalValue.fat}g`,
            }
          }))
        }))
      };

      const content = JSON.stringify(formattedData, null, 2);
      const blob = new Blob([content], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `meal-plan-${mealPlanId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "Your meal plan will be downloaded shortly.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleShare}
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleDownload}
      >
        <Download className="w-4 h-4" />
        Download
      </Button>
    </div>
  );
};

export default MealPlanShare; 