import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import PreferencesForm from "@/components/PreferencesForm";
import { MealPlan as MealPlanType } from "@/types/mealPlan";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NavigationBar from "@/components/NavigationBar";

const MealPlan = () => {
  const [mealPlan, setMealPlan] = useState<MealPlanType | null>(null);
  const [savePlanName, setSavePlanName] = useState("");
  const { toast } = useToast();
  const mealPlanRef = useRef<HTMLDivElement>(null);

  const handlePreferencesSubmit = async (preferences: any) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful meal planning assistant. Generate a detailed meal plan based on the user's preferences. Include breakfast, lunch, dinner, and snacks for each day of the week. For each meal, include the name of the dish and a brief description."
            },
            {
              role: "user",
              content: `Generate a meal plan based on these preferences: ${JSON.stringify(preferences)}`
            }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate meal plan');
      }

      const data = await response.json();
      const generatedPlan = data.choices[0].message.content;
      setMealPlan(generatedPlan);

      // Scroll to meal plan after generation
      if (mealPlanRef.current) {
        mealPlanRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error: any) {
      console.error('Error generating meal plan:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveMealPlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Please login to save meal plans",
          variant: "destructive",
        });
        return;
      }

      if (!savePlanName.trim()) {
        toast({
          title: "Error",
          description: "Please enter a name for your meal plan",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('saved_meal_plans')
        .insert([
          {
            user_id: user.id,
            name: savePlanName,
            plan: mealPlan,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meal plan saved successfully",
      });

      setSavePlanName("");
    } catch (error: any) {
      console.error('Error saving meal plan:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Create Your Meal Plan</h1>
        
        <PreferencesForm onSubmit={handlePreferencesSubmit} />

        {mealPlan && (
          <div ref={mealPlanRef} className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Your Meal Plan</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Save Meal Plan</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Meal Plan</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="planName">Plan Name</Label>
                      <Input
                        id="planName"
                        value={savePlanName}
                        onChange={(e) => setSavePlanName(e.target.value)}
                        placeholder="Enter a name for your meal plan"
                      />
                    </div>
                    <Button onClick={handleSaveMealPlan}>Save</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="prose prose-lg max-w-none">
              <pre className="whitespace-pre-wrap bg-accent/20 p-6 rounded-lg">
                {mealPlan}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MealPlan;