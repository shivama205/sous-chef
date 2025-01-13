import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PreferencesForm } from "@/components/PreferencesForm";
import { MealPlan as MealPlanType } from "@/types/mealPlan";
import NavigationBar from "@/components/NavigationBar";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Preferences } from "@/types/preferences";
import { generateMealPlan, generateNewMeal } from "@/utils/mealPlanGenerator";

const MealPlan = () => {
  const [mealPlan, setMealPlan] = useState<MealPlanType | null>(null);
  const [loadingMealIndex, setLoadingMealIndex] = useState<{ dayIndex: number, mealIndex: number } | null>(null);
  const [currentPreferences, setCurrentPreferences] = useState<Preferences | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { toast } = useToast();
  const mealPlanRef = useRef<HTMLDivElement>(null);

  const handlePreferencesSubmit = async (preferences: Preferences) => {
    try {
      setIsRegenerating(true);
      setCurrentPreferences(preferences);
      const generatedPlan = await generateMealPlan(preferences);
      setMealPlan(generatedPlan);

      // Scroll to meal plan after generation
      if (mealPlanRef.current) {
        mealPlanRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error: unknown) {
      console.error('Error generating meal plan:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleTrySomethingDifferent = async (dayIndex: number, mealIndex: number) => {
    try {
      setLoadingMealIndex({ dayIndex, mealIndex });
      if (!mealPlan) return;
      const updatedMealPlan = await generateNewMeal(mealPlan, dayIndex, mealIndex);
      setMealPlan(updatedMealPlan);
    } catch (error: unknown) {
      console.error('Error regenerating meal:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setLoadingMealIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      <main className="container mx-auto px-4 py-8">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-cente">
          <h1 className="text-4xl font-bold text-primary mb-8 text-center">Create Your Meal Plan</h1>
          
          <PreferencesForm onSubmit={handlePreferencesSubmit} />
        </div>

        {mealPlan && (
          <div ref={mealPlanRef} className={`mt-12 transition-opacity duration-500 ease-in-out ${isRegenerating ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Your Meal Plan</h2>
              <div className="flex space-x-4">
                <Button onClick={() => currentPreferences && handlePreferencesSubmit(currentPreferences)} disabled={isRegenerating}>
                  {isRegenerating ? "Regenerating..." : "Regenerate Meal Plan"}
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Meal Name</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Meal Time</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Calories</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Protein</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Carbs</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Fat</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Fiber</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Sugar</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mealPlan.days.map((day, index) => (
                  day.meals.map((meal, mealIndex) => (
                    <TableRow key={`${index}-${mealIndex}`}>
                      <TableCell>{mealIndex === 0 ? day.day : ''}</TableCell>
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
                      <TableCell className="text-right hidden md:table-cell">{meal.time}</TableCell>
                      <TableCell className="text-right hidden md:table-cell">{meal.nutritionInfo.calories}</TableCell>
                      <TableCell className="text-right hidden md:table-cell">{meal.nutritionInfo.protein}g</TableCell>
                      <TableCell className="text-right hidden md:table-cell">{meal.nutritionInfo.carbs}g</TableCell>
                      <TableCell className="text-right hidden md:table-cell">{meal.nutritionInfo.fat}g</TableCell>
                      <TableCell className="text-right hidden md:table-cell">{meal.nutritionInfo.fiber}g</TableCell>
                      <TableCell className="text-right hidden md:table-cell">{meal.nutritionInfo.sugar}g</TableCell>
                      <TableCell>
                        <Button 
                          onClick={() => handleTrySomethingDifferent(index, mealIndex)} 
                          className="flex items-center"
                          disabled={loadingMealIndex?.dayIndex === index && loadingMealIndex?.mealIndex === mealIndex || isRegenerating}
                        >
                          {loadingMealIndex?.dayIndex === index && loadingMealIndex?.mealIndex === mealIndex ? (
                            <span>Loading...</span>
                          ) : (
                            <span>Try a different meal</span>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
};

export default MealPlan;