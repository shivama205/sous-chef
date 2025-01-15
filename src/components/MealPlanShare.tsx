import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { MealPlan } from "@/types/meal-plan";

interface MealPlanShareProps {
  mealPlanId: string;
  mealPlanData: MealPlan;
}

export const MealPlanShare: React.FC<MealPlanShareProps> = ({
  mealPlanId,
  mealPlanData,
}) => {
  const handleShare = async () => {
    const shareUrl = `https://sous-chef.in/shared/meal-plan/${mealPlanId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${mealPlanData.title} - SousChef Meal Plan`,
          text: `Check out this healthy meal plan I created using SousChef AI: ${mealPlanData.description}`,
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
      // Format the meal plan data for better readability
      const formattedData = {
        title: mealPlanData.title,
        description: mealPlanData.description,
        createdAt: new Date(mealPlanData.created_at).toLocaleDateString(),
        nutritionalSummary: {
          calories: mealPlanData.metadata.calories,
          protein: `${mealPlanData.metadata.protein}g`,
          carbs: `${mealPlanData.metadata.carbs}g`,
          fat: `${mealPlanData.metadata.fat}g`,
        },
        meals: mealPlanData.meals.map(meal => ({
          name: meal.name,
          description: meal.description,
          ingredients: meal.ingredients,
          instructions: meal.instructions,
          nutritionalInfo: {
            calories: meal.nutritionalInfo.calories,
            protein: `${meal.nutritionalInfo.protein}g`,
            carbs: `${meal.nutritionalInfo.carbs}g`,
            fat: `${meal.nutritionalInfo.fat}g`,
          }
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