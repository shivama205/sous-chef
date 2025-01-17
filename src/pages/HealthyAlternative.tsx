import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { HealthySwapRequest, HealthySwapResponse, Recipe } from "@/types/healthyAlternative";
import { supabase } from "@/lib/supabase";
import { OutOfCreditDialog } from "@/components/OutOfCreditDialog";
import { LoginDialog } from "@/components/LoginDialog";
import { MealPlanLoadingOverlay } from "@/components/MealPlanLoadingOverlay";
import { PageHeader } from "@/components/ui/PageHeader";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Salad, Timer, Heart, Sparkles, History, Star } from "lucide-react";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { User } from "@supabase/supabase-js";

const features = [
  {
    icon: Salad,
    title: "Healthier Versions",
    description: "Get nutritious alternatives to your favorite meals while keeping the flavors you love"
  },
  {
    icon: Timer,
    title: "Quick & Easy",
    description: "Discover alternatives that are just as convenient to prepare as your usual meals"
  },
  {
    icon: Heart,
    title: "Dietary Friendly",
    description: "Find options that match your dietary restrictions and preferences"
  }
];

const exampleAlternatives = [
  {
    original: "Chicken Alfredo Pasta",
    healthy: "Cauliflower Alfredo with Grilled Chicken",
    benefits: "60% fewer calories, higher protein, lower carbs"
  },
  {
    original: "Beef Burger",
    healthy: "Portobello Mushroom Burger",
    benefits: "Plant-based, rich in fiber, heart-healthy"
  },
  {
    original: "Mac and Cheese",
    healthy: "Butternut Squash Mac",
    benefits: "Added vegetables, lower fat, more nutrients"
  }
];

const recentAlternatives = [
  {
    date: "2 days ago",
    original: "Pizza",
    alternative: "Cauliflower Crust Pizza",
    saved: true
  },
  {
    date: "1 week ago",
    original: "Ice Cream",
    alternative: "Frozen Greek Yogurt",
    saved: false
  }
];

const HealthyAlternative = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [alternatives, setAlternatives] = useState<Recipe[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [request, setRequest] = useState<HealthySwapRequest>({
    mealName: "",
    description: "",
    dietaryRestrictions: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
      .select('credits, credits_used')
      .eq('user_id', session.user.id)
      .single();

    if (!credits || credits.credits <= 0) {
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
        .update({ credits: credits.credits - 1, credits_used: credits.credits_used + 1 })
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

  const LoggedInView = () => (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <PageHeader
        icon={Sparkles}
        title="Healthy Alternatives"
        description="Transform your meals into healthier versions while maintaining their delicious taste"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Find Your Alternative</h2>
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
                Find Healthy Alternatives
              </Button>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-semibold">Recent Alternatives</h2>
            </div>
            <div className="space-y-4">
              {recentAlternatives.map((alt, index) => (
                <div key={index} className="p-4 rounded-lg bg-primary/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{alt.date}</span>
                    {alt.saved && (
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Star className="w-3 h-3" />
                        Saved
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">{alt.original}</span>
                    <span className="text-primary">→</span>
                    <span className="text-sm font-medium text-primary">{alt.alternative}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Tips */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Tips</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                Be specific about your meal description for better alternatives
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                Include any taste preferences in the description
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                Mention cooking time constraints if any
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {alternatives.length > 0 && (
        <div ref={resultsRef} className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary">Your Healthy Alternatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alternatives.map((recipe, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-3">{recipe.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">Cooking Time: {recipe.cookingTime}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Ingredients:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {recipe.ingredients.map((ingredient, i) => (
                      <li key={i} className="text-sm text-muted-foreground">{ingredient}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    {recipe.instructions.map((step, i) => (
                      <li key={i} className="text-sm text-muted-foreground">{step}</li>
                    ))}
                  </ol>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Nutritional Value (per serving):</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
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
  );

  const LoggedOutView = () => (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <PageHeader
        icon={Sparkles}
        title="Healthy Alternatives"
        description="Transform your favorite meals into nutritious alternatives without sacrificing taste"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Try It Now</h2>
          <p className="text-muted-foreground mb-6">
            Sign in to start discovering healthier versions of your favorite meals. Get personalized alternatives based on your preferences and dietary needs.
          </p>
          <Button 
            onClick={() => setLoginDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            Sign In to Get Started
          </Button>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Example Alternatives</h2>
          <div className="space-y-4">
            {exampleAlternatives.map((alt, index) => (
              <div key={index} className="p-4 rounded-lg bg-primary/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-muted-foreground">{alt.original}</span>
                  <span className="text-primary">→</span>
                  <span className="text-sm font-medium text-primary">{alt.healthy}</span>
                </div>
                <p className="text-sm text-muted-foreground">{alt.benefits}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <BaseLayout>
      {user ? (
        <div className="relative">
          <MealPlanLoadingOverlay isLoading={isLoading} />
          <LoggedInView />
        </div>
      ) : (
        <LoggedOutView />
      )}
      
      <LoginDialog 
        open={loginDialogOpen} 
        onOpenChange={setLoginDialogOpen} 
      />

      <OutOfCreditDialog 
        open={showCreditDialog} 
        onOpenChange={setShowCreditDialog}
      />
    </BaseLayout>
  );
};

export default HealthyAlternative;
