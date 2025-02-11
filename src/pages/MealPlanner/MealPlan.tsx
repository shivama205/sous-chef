import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { LoginDialog } from "@/components/LoginDialog";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { PageHeader } from "@/components/ui/PageHeader";
import { Sparkles, ChefHat, Loader2, Calendar, Brain, UtensilsCrossed, ArrowRight, Salad } from "lucide-react";
import { ServiceLayout } from "@/components/layouts/ServiceLayout";
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
    description: "Plan your meals for up to 7 days in advance with smart scheduling"
  },
  {
    icon: Brain,
    title: "AI-Powered",
    description: "Get personalized meal combinations based on your preferences and goals"
  },
  {
    icon: Salad,
    title: "Balanced Nutrition",
    description: "Meet your macro goals with perfectly balanced, delicious meals"
  },
  {
    icon: ChefHat,
    title: "Smart Recipes",
    description: "Access a vast collection of curated recipes for your meal plan"
  },
  {
    icon: Calendar,
    title: "Time Saver",
    description: "Save hours of planning with automated meal scheduling"
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
    <label htmlFor={name} className="text-sm font-medium text-foreground flex items-center gap-2">
      <Brain className="w-4 h-4 text-primary" />
      {label}
    </label>
    <input
      id={name}
      name={name}
      type="number"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      className="flex h-12 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background hover:bg-gray-50/50 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
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
    <label htmlFor="dietaryRestrictions" className="text-sm font-medium text-foreground flex items-center gap-2">
      <Salad className="w-4 h-4 text-primary" />
      Dietary Restrictions
    </label>
    <textarea
      id="dietaryRestrictions"
      name="dietaryRestrictions"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter any dietary restrictions or allergies..."
      className="min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background hover:bg-gray-50/50 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors"
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
  <div className="space-y-4">
    <label className="text-sm font-medium text-foreground flex items-center gap-2">
      <Calendar className="w-4 h-4 text-primary" />
      Plan Duration
    </label>
    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
      {[1, 2, 3, 4, 5, 6, 7].map((days) => (
        <Button
          key={days}
          type="button"
          variant={value === days ? "default" : "outline"}
          onClick={() => onChange(days)}
          className={`w-full hover:bg-primary/5 ${value === days ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white'}`}
          size="sm"
        >
          {days} {days === 1 ? 'D' : 'D'}
        </Button>
      ))}
    </div>
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
    <div className="space-y-4">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <ChefHat className="w-4 h-4 text-primary" />
        Cuisine Preferences
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {cuisines.map((cuisine) => (
          <Button
            key={cuisine}
            type="button"
            variant={selected.includes(cuisine) ? "default" : "outline"}
            onClick={() => onToggle(cuisine)}
            className={`w-full hover:bg-primary/5 text-xs sm:text-sm ${selected.includes(cuisine) ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white'}`}
            size="sm"
          >
            {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
          </Button>
        ))}
      </div>
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
      <ServiceLayout>
        <SEO 
          title="Weekly Meal Planner - MySideChef"
          description="Plan your weekly meals with our AI-powered meal planner. Get personalized meal combinations that match your nutritional goals and dietary preferences."
          keywords="meal planning, weekly meals, meal prep, nutrition planning, healthy eating, AI meal planner"
          type="website"
          canonical="https://mysidechef.com/meal-plan"
        />
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 py-8 text-center space-y-6">
            <div className="max-w-3xl mx-auto">
              <ChefHat className="w-16 h-16 mx-auto text-primary mb-6" />
              <h1 className="text-2xl sm:text-4xl font-bold mb-4">Your Personal Meal Planning Assistant</h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-8">
                Take the stress out of meal planning! Our AI creates personalized weekly meal plans 
                that match your nutritional goals, dietary preferences, and schedule.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.slice(0, 3).map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    className="h-full"
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {features.slice(3, 5).map((feature, index) => (
                  <FeatureCard
                    key={index + 3}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    className="h-full"
                  />
                ))}
              </div>

              <Button 
                size="lg" 
                className="mt-8 bg-primary hover:bg-primary/90"
                onClick={() => setLoginDialogOpen(true)}
              >
                Start Planning Your Week
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
      </ServiceLayout>
    );
  }

  return (
    <ServiceLayout>
      <SEO 
        title="Weekly Meal Planner - MySideChef"
        description="Plan your weekly meals with our AI-powered meal planner. Get personalized meal combinations that match your nutritional goals and dietary preferences."
        keywords="meal planning, weekly meals, meal prep, nutrition planning, healthy eating, AI meal planner"
        type="website"
        canonical="https://mysidechef.com/meal-plan"
      />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <PageHeader
            icon={Calendar}
            title="Your Meal Planner"
            description="Create personalized meal plans that match your nutritional goals"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-white border shadow-sm">
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg font-semibold mb-4">Create Your Meal Plan</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <DurationSelector value={preferences.days} onChange={(value) => updatePreference('days', value)} />
                    
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Brain className="w-4 h-4 text-primary" />
                        Nutritional Goals
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <MacroInput
                          label="Calories"
                          value={preferences.targetCalories}
                          onChange={(value) => updatePreference('targetCalories', value)}
                          name="calories"
                        />
                        <MacroInput
                          label="Protein (g)"
                          value={preferences.targetProtein}
                          onChange={(value) => updatePreference('targetProtein', value)}
                          name="protein"
                        />
                        <MacroInput
                          label="Carbs (g)"
                          value={preferences.targetCarbs}
                          onChange={(value) => updatePreference('targetCarbs', value)}
                          name="carbs"
                        />
                        <MacroInput
                          label="Fat (g)"
                          value={preferences.targetFat}
                          onChange={(value) => updatePreference('targetFat', value)}
                          name="fat"
                        />
                      </div>
                    </div>

                    <DietaryRestrictions
                      value={preferences.dietaryRestrictions}
                      onChange={(value) => updatePreference('dietaryRestrictions', value)}
                    />

                    <CuisineSelector
                      selected={preferences.cuisinePreferences || []}
                      onToggle={toggleCuisine}
                    />

                    <Button 
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Creating your meal plan...
                        </>
                      ) : (
                        <>
                          Generate Meal Plan
                          <Sparkles className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </Card>
            </div>

            {/* Features Card - Hide on Mobile */}
            <div className="hidden lg:block space-y-6">
              <Card className="bg-white border shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Features</h3>
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <LoginDialog 
        open={loginDialogOpen} 
        onOpenChange={setLoginDialogOpen}
      />
      {isGenerating && <LoadingOverlay isLoading={isGenerating} messages={mealPlanLoadingMessages} />}
    </ServiceLayout>
  );
}