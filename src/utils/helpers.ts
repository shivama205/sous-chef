import html2canvas from 'html2canvas';
import { NutritionInfo, MealPlanDay } from "@/types/mealPlan";

export const calculateDailyNutrition = (day: MealPlanDay): NutritionInfo => {
  return day.meals.reduce(
    (total, meal) => ({
      calories: total.calories + meal.nutritionInfo.calories,
      protein: total.protein + meal.nutritionInfo.protein,
      carbs: total.carbs + meal.nutritionInfo.carbs,
      fat: total.fat + meal.nutritionInfo.fat,
      fiber: total.fiber + meal.nutritionInfo.fiber,
      sugar: total.sugar + meal.nutritionInfo.sugar,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
  );
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString(undefined, { maximumFractionDigits: 1 });
};

export const generateShareUrl = (id: string): string => {
  return `${window.location.origin}/shared/meal-plan/${id}`;
};

export const downloadImage = async (element: HTMLElement, fileName: string): Promise<void> => {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
  });
  
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};