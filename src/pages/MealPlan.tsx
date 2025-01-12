import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import type { MealPlan } from "@/types/mealPlan";
import { generateMealPlan, generateNewMeal } from "@/utils/mealPlanGenerator";
import NavigationBar from "@/components/NavigationBar";
import { FaRedo } from 'react-icons/fa';

const MealPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratingMeal, setRegeneratingMeal] = useState<{ dayIndex: number, mealIndex: number } | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan>(location.state?.mealPlan);
  const preferences = location.state?.preferences;

  if (!preferences || !mealPlan) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md p-6">
          <CardContent className="text-center">
            <p>No meal plan found. Please go back and create a new plan.</p>
            <Button onClick={() => navigate("/")} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      const newMealPlan = await generateMealPlan(preferences);
      setMealPlan(newMealPlan);
      toast({
        title: "Success",
        description: "Your meal plan has been regenerated!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate meal plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleTrySomethingDifferent = async (dayIndex, mealIndex) => {
    try {
      setRegeneratingMeal({ dayIndex, mealIndex });
      const newMealPlan = await generateNewMeal(mealPlan, dayIndex, mealIndex);
      setMealPlan(newMealPlan);
      toast({
        title: "Success",
        description: "A new meal has been suggested!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to suggest a new meal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRegeneratingMeal(null);
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Weekly Meal Plan</h1>
          <Button onClick={handleRegenerate} disabled={isRegenerating}>
            {isRegenerating ? "Regenerating..." : <><FaRedo /> Regenerate Meal Plan</>}
          </Button>
        </div>

        <div className="space-y-8">
          {mealPlan.days.map((day, index) => {
            // Calculate totals for the day
            const totalNutrition = day.meals.reduce(
              (totals, meal) => {
                totals.calories += meal.nutritionInfo.calories;
                totals.protein += meal.nutritionInfo.protein;
                totals.carbs += meal.nutritionInfo.carbs;
                totals.fat += meal.nutritionInfo.fat;
                totals.fiber += meal.nutritionInfo.fiber;
                totals.sugar += meal.nutritionInfo.sugar;
                return totals;
              },
              { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
            );

            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{day.day}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Meal Name</TableHead>
                        <TableHead className="text-right">Meal Time</TableHead>
                        <TableHead className="text-right">Calories</TableHead>
                        <TableHead className="text-right">Protein</TableHead>
                        <TableHead className="text-right">Carbs</TableHead>
                        <TableHead className="text-right">Fat</TableHead>
                        <TableHead className="text-right">Fiber</TableHead>
                        <TableHead className="text-right">Sugar</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {day.meals.map((meal, mealIndex) => (
                        <TableRow key={mealIndex}>
                          <TableCell>
                            <a 
                              href={meal.recipeLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-500 hover:underline"
                            >
                              {meal.name}
                            </a>
                          </TableCell>
                          <TableCell className="text-right">{meal.time}</TableCell>
                          <TableCell className="text-right">{meal.nutritionInfo.calories}</TableCell>
                          <TableCell className="text-right">{meal.nutritionInfo.protein}g</TableCell>
                          <TableCell className="text-right">{meal.nutritionInfo.carbs}g</TableCell>
                          <TableCell className="text-right">{meal.nutritionInfo.fat}g</TableCell>
                          <TableCell className="text-right">{meal.nutritionInfo.fiber}g</TableCell>
                          <TableCell className="text-right">{meal.nutritionInfo.sugar}g</TableCell>
                          <TableCell>
                            <Button 
                              onClick={() => handleTrySomethingDifferent(index, mealIndex)} 
                              disabled={regeneratingMeal?.dayIndex === index && regeneratingMeal?.mealIndex === mealIndex}
                            >
                              {regeneratingMeal?.dayIndex === index && regeneratingMeal?.mealIndex === mealIndex ? "Loading..." : <FaRedo />}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-gray-100 font-semibold">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right"></TableCell>
                        <TableCell className="text-right">{totalNutrition.calories}</TableCell>
                        <TableCell className="text-right">{totalNutrition.protein}g</TableCell>
                        <TableCell className="text-right">{totalNutrition.carbs}g</TableCell>
                        <TableCell className="text-right">{totalNutrition.fat}g</TableCell>
                        <TableCell className="text-right">{totalNutrition.fiber}g</TableCell>
                        <TableCell className="text-right">{totalNutrition.sugar}g</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MealPlan;