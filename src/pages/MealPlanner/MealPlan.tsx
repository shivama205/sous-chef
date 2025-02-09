import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { LoginDialog } from "@/components/LoginDialog";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { PageHeader } from "@/components/ui/PageHeader";
import { Sparkles, ChefHat, Loader2, Calendar, Brain, UtensilsCrossed, ArrowRight, Salad } from "lucide-react";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { generateMealPlan } from "@/services/mealPlan";
import { mealPlanLoadingMessages } from "@/lib/loadingMessages";
import type { Preferences, Cuisine } from "@/types/preferences";
import { MealPlanGenerationRequest } from "@/types/mealPlan";
import { useAuth } from "@/providers/AuthProvider";
import { usePageTracking } from "@/hooks/usePageTracking";
import { dataLayer } from "@/services/dataLayer";
import { SEO } from "@/components/SEO";
import { FeatureCard } from "@/components/ui/FeatureCard";

const features = [
  {
    icon: Calendar,
    title: "Weekly Planning",
    description: "Plan your meals for up to 7 days in advance"
  },
  {
    icon: Brain,
    title: "AI-Powered",
    description: "Get personalized meal combinations based on your preferences"
  },
  {
    icon: Salad,
    title: "Balanced Nutrition",
    description: "Meet your macro goals with perfectly balanced meals"
  }
];

// Form Components
const MacroInput = ({ 
  label, 
  value, 
  onChange, 
  name 
}: { 
  label: string; 
  value: number; 
  onChange: (value: number) => void;
  name: string;
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="text-sm font-medium">{label}</label>
    <input
      id={name}
      name={name}
      type="number"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      className="w-full p-2 rounded-md border border-input bg-background"
    />
  </div>
);

const DietaryRestrictions = ({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void;
}) => (
  <div className="space-y-2">
    <label htmlFor="dietaryRestrictions" className="text-sm font-medium">
      Dietary Restrictions
    </label>
    <textarea
      id="dietaryRestrictions"
      name="dietaryRestrictions"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter any dietary restrictions or allergies..."
      className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
    />
  </div>
);

const DurationSelector = ({ 
  value, 
  onChange 
}: { 
  value: number; 
  onChange: (value: number) => void;
}) => (
  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
    {[1, 2, 3, 4, 5, 6, 7].map((days) => (
      <Button
        key={days}
        type="button"
        variant={value === days ? "default" : "outline"}
        onClick={() => onChange(days)}
        className="w-full"
        size="sm"
      >
        {days} {days === 1 ? 'Day' : 'Days'}
      </Button>
    ))}
  </div>
);

const CuisineSelector = ({ 
  selected, 
  onToggle 
}: { 
  selected: Cuisine[]; 
  onToggle: (cuisine: Cuisine) => void;
}) => {
  const cuisines: Cuisine[] = [
    'italian', 'mexican', 'chinese', 'japanese', 'indian', 
    'mediterranean', 'american', 'thai', 'korean', 'vietnamese',
    'indonesian', 'greek'
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {cuisines.map((cuisine) => (
        <Button
          key={cuisine}
          type="button"
          variant={selected.includes(cuisine) ? "default" : "outline"}
          onClick={() => onToggle(cuisine)}
          className="w-full"
        >
          {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
        </Button>
      ))}
    </div>
  );
};

// Main Component
export function MealPlan() {
  usePageTracking();
  const [isGenerating, setIsGenerating] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({
    days: 7,
    targetCalories: 2000,
    targetProtein: 150,
    targetCarbs: 200,
    targetFat: 65,
    dietaryRestrictions: "",
    cuisinePreferences: []
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const updatePreference = useCallback(<K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleCuisine = useCallback((cuisine: Cuisine) => {
    setPreferences(prev => ({
      ...prev,
      cuisinePreferences: prev.cuisinePreferences?.includes(cuisine)
        ? prev.cuisinePreferences.filter(c => c !== cuisine)
        : [...(prev.cuisinePreferences || []), cuisine]
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating || !user) {
      if (!user) setLoginDialogOpen(true);
      return;
    }

    setIsGenerating(true);

    try {
      const request: MealPlanGenerationRequest = {
        days: preferences.days,
        preferences,
        dietaryRestrictions: preferences.dietaryRestrictions,
        cuisinePreferences: preferences.cuisinePreferences || []
      };

      dataLayer.trackMealPlanCreate({
        plan_duration: request.days.toString(),
        recipe_count: 0,
        user_id: user.id
      });

      const mealPlan = await generateMealPlan(request);
      navigate("/meal-plan/new", { state: { mealPlan, request } });
    } catch (error) {
      console.error("Error generating meal plan:", error);
      toast({
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, user, preferences, navigate, toast]);

  if (!user) {
    return (
      <BaseLayout>
        <SEO 
          title="Weekly Meal Planner - MySideChef"
          description="Plan your weekly meals with our AI-powered meal planner. Get personalized meal combinations that match your nutritional goals and dietary preferences."
          keywords="meal planning, weekly meals, meal prep, nutrition planning, healthy eating, AI meal planner"
          type="website"
          canonical="https://mysidechef.com/meal-plan"
        />
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 py-8 space-y-8">
            <PageHeader
              icon={ChefHat}
              title="Weekly Meal Planner"
              description="Plan your meals for the week ahead with our AI-powered meal planner"
            />
            
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <UtensilsCrossed className="w-16 h-16 mx-auto text-primary" />
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Ready to Plan Your Week?</h2>
                <p className="text-lg text-muted-foreground">
                  Take the stress out of meal planning! Our AI creates personalized weekly meal plans 
                  that match your nutritional goals and dietary preferences.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                ))}
              </div>

              <Button 
                size="lg"
                onClick={() => setLoginDialogOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <SEO 
        title="Create Your Meal Plan - MySideChef"
        description="Create your personalized weekly meal plan. Set your nutritional goals, dietary preferences, and let our AI do the rest."
        keywords="create meal plan, weekly meal planning, nutrition goals, dietary preferences, meal prep"
        type="website"
        canonical="https://mysidechef.com/meal-plan"
      />
      <div className="relative">
        <LoadingOverlay isLoading={isGenerating} messages={mealPlanLoadingMessages} />
        <div className="container mx-auto px-4 py-8 space-y-8">
          <PageHeader
            icon={Sparkles}
            title="Your Meal Planner"
            description="Create personalized meal plans that match your nutritional goals and dietary preferences"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Plan Duration</h3>
                    <DurationSelector
                      value={preferences.days}
                      onChange={(value) => updatePreference('days', value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Dietary Restrictions</h3>
                    <DietaryRestrictions
                      value={preferences.dietaryRestrictions}
                      onChange={(value) => updatePreference('dietaryRestrictions', value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Cuisine Preferences</h3>
                    <CuisineSelector
                      selected={preferences.cuisinePreferences || []}
                      onToggle={toggleCuisine}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Nutritional Targets</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <MacroInput
                        label="Calories (kcal)"
                        name="targetCalories"
                        value={preferences.targetCalories}
                        onChange={(value) => updatePreference('targetCalories', value)}
                      />
                      <MacroInput
                        label="Protein (g)"
                        name="targetProtein"
                        value={preferences.targetProtein}
                        onChange={(value) => updatePreference('targetProtein', value)}
                      />
                      <MacroInput
                        label="Carbs (g)"
                        name="targetCarbs"
                        value={preferences.targetCarbs}
                        onChange={(value) => updatePreference('targetCarbs', value)}
                      />
                      <MacroInput
                        label="Fat (g)"
                        name="targetFat"
                        value={preferences.targetFat}
                        onChange={(value) => updatePreference('targetFat', value)}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating your meal plan...
                      </>
                    ) : (
                      <>
                        <ChefHat className="mr-2 h-4 w-4" />
                        Generate Meal Plan
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Tips</h2>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    Enter your daily calorie and macro targets
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    Be specific with your dietary restrictions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    Choose cuisines you enjoy for better adherence
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}