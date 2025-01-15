import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import NavigationBar from "@/components/NavigationBar";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { HealthySwapRequest, HealthySwapResponse, Recipe } from "@/types/healthySwap";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { OutOfCreditDialog } from "@/components/OutOfCreditDialog";

const HealthySwap = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [alternatives, setAlternatives] = useState<Recipe[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [request, setRequest] = useState<HealthySwapRequest>({
    mealName: "",
    description: "",
    dietaryRestrictions: "",
  });

  const generatePrompt = (request: HealthySwapRequest): string => {
    return `Suggest 3 healthy alternatives for this meal:
    Meal: ${request.mealName}
    ${request.description ? `Description: ${request.description}` : ''}
    ${request.dietaryRestrictions ? `Dietary Restrictions: ${request.dietaryRestrictions}` : ''}
    
    For each alternative, provide:
    - Name of the meal
    - Time to cook
    - List of ingredients
    - Step by step instructions
    - Nutritional value per serving (calories, protein, carbs, fat, fiber)
    
    Format the response as a JSON object with this structure:
    {
      "alternatives": [
        {
          "name": "Meal name",
          "cookingTime": "30 minutes",
          "ingredients": ["ingredient 1", "ingredient 2"],
          "instructions": ["step 1", "step 2"],
          "nutritionalValue": {
            "calories": 300,
            "protein": 20,
            "carbs": 30,
            "fat": 10,
            "fiber": 5
          }
        }
      ]
    }`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.mealName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a meal name",
        variant: "destructive",
      });
      return;
    }

    // Check if user is logged in and has credits
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setLoginDialogOpen(true);
      return;
    }

    const { data: credits } = await supabase
      .from('user_credits')
      .select('credits_available, credits_used')
      .eq('user_id', session.user.id)
      .single();

    if (!credits || credits.credits_available <= 0) {
      setShowCreditDialog(true);
      return;
    }
    
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(generatePrompt(request));
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/```json([\s\S]*?)```/);
      if (!jsonMatch) {
        throw new Error("Invalid response format");
      }
      const jsonString = jsonMatch[1].trim();
      
      const data = JSON.parse(jsonString) as HealthySwapResponse;
      setAlternatives(data.alternatives);

      // Consume one credit after successful generation
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ credits_available: credits.credits_available - 1, credits_used: credits.credits_used + 1 })
        .eq('user_id', session.user.id);

      if (updateError) {
        toast({
          title: "Error updating credits",
          description: "Failed to update credits, but your alternatives were generated.",
          variant: "destructive",
        });
      }
      
      toast({
        title: "Success",
        description: "Found healthy alternatives for your meal!",
      });

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error generating alternatives:", error);
      toast({
        title: "Error",
        description: "Failed to generate alternatives. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Find Healthy Alternatives</h1>
        
        <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-2xl p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mealName">Meal Name *</Label>
              <Input
                id="mealName"
                value={request.mealName}
                onChange={(e) => setRequest({ ...request, mealName: e.target.value })}
                placeholder="e.g., Chicken Alfredo"
                className="h-12"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={request.description}
                onChange={(e) => setRequest({ ...request, description: e.target.value })}
                placeholder="Describe the meal and any specific concerns..."
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietaryRestrictions">Dietary Restrictions (Optional)</Label>
              <Textarea
                id="dietaryRestrictions"
                value={request.dietaryRestrictions}
                onChange={(e) => setRequest({ ...request, dietaryRestrictions: e.target.value })}
                placeholder="Enter any dietary restrictions (e.g., gluten-free, dairy-free, allergies)"
                className="min-h-[100px] resize-none"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Finding Alternatives..." : "Find Healthy Alternatives"}
            </Button>
          </form>
        </Card>

        {alternatives.length > 0 && (
          <div ref={resultsRef} className="mt-12 space-y-8">
            <h2 className="text-2xl font-bold text-primary">Healthy Alternatives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {alternatives.map((recipe, index) => (
                <Card key={index} className="backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4">{recipe.name}</h3>
                  <p className="text-gray-600 mb-4">Cooking Time: {recipe.cookingTime}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Ingredients:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {recipe.ingredients.map((ingredient, i) => (
                        <li key={i} className="text-gray-600">{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Instructions:</h4>
                    <ol className="list-decimal list-inside space-y-1">
                      {recipe.instructions.map((step, i) => (
                        <li key={i} className="text-gray-600">{step}</li>
                      ))}
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Nutritional Value (per serving):</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p>Calories: {recipe.nutritionalValue.calories}</p>
                      <p>Protein: {recipe.nutritionalValue.protein}g</p>
                      <p>Carbs: {recipe.nutritionalValue.carbs}g</p>
                      <p>Fat: {recipe.nutritionalValue.fat}g</p>
                      <p>Fiber: {recipe.nutritionalValue.fiber}g</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Login Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              Please sign in to use the healthy swap feature.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <GoogleSignInButton />
          </div>
        </DialogContent>
      </Dialog>

      {/* Replace the old credit dialog with the shared component */}
      <OutOfCreditDialog 
        open={showCreditDialog} 
        onOpenChange={setShowCreditDialog} 
      />
    </div>
  );
};

export default HealthySwap;
