import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { Apple, Heart, Brain, Scale, ChefHat, Leaf, Star, Clock, Utensils, ListOrdered, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { generateHealthyAlternative } from "@/services/healthyAlternative";
import type { HealthyAlternative } from "@/types/healthyAlternative";
import { PageHeader } from "@/components/ui/PageHeader";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { LoginDialog } from "@/components/LoginDialog";
import { MealPlanLoadingOverlay } from "@/components/MealPlanLoadingOverlay";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";

const suggestionList = [
  "Ensure meal name is spelled correctly",
  "Specify the dietary restrictions and additional instructions in the input field",
  "Try different meal names if the first one doesn't work",
  "Try describing the meal in more detail under 'Additional Instructions'",
]

const features = [
  {
    icon: Apple,
    title: "Smart Alternative Finder",
    description: "Get personalized healthy alternatives for your favorite meals"
  },
  {
    icon: Heart,
    title: "Health-Focused",
    description: "Suggestions tailored to your dietary needs and health goals"
  },
  {
    icon: Scale,
    title: "Macro-Aware",
    description: "Alternatives that align with your nutritional targets"
  },
  {
    icon: Brain,
    title: "AI-Powered Suggestions",
    description: "Advanced AI technology to find the perfect healthy alternatives"
  },
  {
    icon: ChefHat,
    title: "Cooking Tips",
    description: "Get expert cooking advice to make your meals healthier"
  }
];

const NoAlternativesFound = ({ suggestions }: { suggestions: string[] }) => (
  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6 mt-8">
    <div className="text-center space-y-4">
      <ChefHat className="w-12 h-12 mx-auto text-gray-400" />
      <h3 className="text-lg font-semibold">No Direct Alternatives Found</h3>
      <p className="text-gray-600">Don't worry! Here are some suggestions to make your meal healthier:</p>
      <ul className="text-left space-y-2 max-w-md mx-auto">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span className="text-gray-600">{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  </Card>
);

export default function HealthyAlternative() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [mealName, setMealName] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [alternatives, setAlternatives] = useState<HealthyAlternative[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!mealName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a meal name",
        variant: "destructive"
      });
      return;
    }

    // Check if user is logged in, if not, open the login dialog
    if (!user) {
      setLoginDialogOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const alternatives: HealthyAlternative[] = await generateHealthyAlternative({
        mealName,
        dietaryRestrictions,
        additionalInstructions
      });

      setAlternatives(alternatives);
      setSuggestions([]);

      toast({
        title: "Success",
        description: `Found ${alternatives.length} healthy alternatives for your meal!`,
      });

    } catch (error) {
      toast({
        title: "No Alternatives Found",
        description: "We couldn't find direct alternatives, but here are some suggestions to make your meal healthier.",
      });
      setAlternatives([]);
      setSuggestions(suggestionList);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseLayout>
      <SEO 
        title="Healthy Food Alternatives"
        description="Discover healthier alternatives to your favorite foods. Get AI-powered suggestions for ingredient swaps and cooking modifications to make your meals healthier."
        keywords="healthy alternatives, food substitutes, healthy swaps, healthy cooking, nutritious options, diet alternatives"
        type="website"
        canonical="https://mysidechef.com/healthy-alternative"
      />
      {user ? (
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-8 space-y-8">
            <PageHeader
              icon={Apple}
              title="Healthy Alternatives"
              description="Transform your favorite meals into healthier versions"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form and Results Column */}
              <div className="lg:col-span-2">
                <Card className="bg-white border shadow-sm">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Find Healthy Alternatives</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      <div className="space-y-2">
                        <Label className="text-base font-medium text-foreground flex items-center gap-2">
                          <Utensils className="w-4 h-4 text-primary" />
                          Meal Name *
                        </Label>
                        <Input
                          id="mealName"
                          value={mealName}
                          onChange={(e) => setMealName(e.target.value)}
                          placeholder="Enter the meal you want alternatives for"
                          required
                          className="h-12 bg-white border-input hover:bg-gray-50/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-base font-medium text-foreground flex items-center gap-2">
                          <Apple className="w-4 h-4 text-primary" />
                          Dietary Restrictions
                        </Label>
                        <Input
                          id="restrictions"
                          value={dietaryRestrictions}
                          onChange={(e) => setDietaryRestrictions(e.target.value)}
                          placeholder="E.g., gluten-free, dairy-free (comma separated)"
                          className="h-12 bg-white border-input hover:bg-gray-50/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-base font-medium text-foreground flex items-center gap-2">
                          <Brain className="w-4 h-4 text-primary" />
                          Additional Instructions
                        </Label>
                        <Textarea
                          id="instructions"
                          value={additionalInstructions}
                          onChange={(e) => setAdditionalInstructions(e.target.value)}
                          placeholder="Any specific requirements or preferences?"
                          className="min-h-[100px] resize-none bg-white border-input hover:bg-gray-50/50"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        size="lg"
                        className="w-full"
                        disabled={isLoading || !mealName.trim()}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Finding Alternatives...
                          </>
                        ) : (
                          <>
                            Find Alternatives
                            <Sparkles className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </Card>

                {/* Results Section */}
                {alternatives.length > 0 && (
                  <div ref={resultsRef} className="space-y-8 pt-8">
                    <h2 className="text-2xl font-semibold text-center">Found Alternatives</h2>
                    <div className="grid grid-cols-1 gap-6">
                      {alternatives.map((alt, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white border">
                            <div className="p-6 space-y-6">
                              {/* Header */}
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                                    {alt.mealName}
                                  </h3>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <Clock className="w-4 h-4" />
                                    <span>Cooking Time: {alt.cookingTime} minutes</span>
                                  </div>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <Leaf className="w-6 h-6 text-primary" />
                                </div>
                              </div>

                              {/* Content Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column: Ingredients and Instructions */}
                                <div className="space-y-6">
                                  {/* Ingredients */}
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Utensils className="w-4 h-4 text-primary" />
                                      <h4 className="font-medium">Ingredients</h4>
                                    </div>
                                    <ul className="space-y-2">
                                      {alt.ingredients.map((ingredient, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0 mt-2" />
                                          <span className="text-sm text-muted-foreground">{ingredient}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* Instructions */}
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <ListOrdered className="w-4 h-4 text-primary" />
                                      <h4 className="font-medium">Instructions</h4>
                                    </div>
                                    <ol className="space-y-2">
                                      {alt.instructions.map((instruction, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                          <span className="text-sm font-medium text-primary/60">{i + 1}.</span>
                                          <span className="text-sm text-muted-foreground">{instruction}</span>
                                        </li>
                                      ))}
                                    </ol>
                                  </div>
                                </div>

                                {/* Right Column: Nutritional Info and Benefits */}
                                <div className="space-y-6">
                                  {/* Nutritional Info */}
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Scale className="w-4 h-4 text-primary" />
                                      <h4 className="font-medium">Nutritional Value</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="bg-primary/5 rounded-lg p-3">
                                        <p className="text-sm text-muted-foreground">Calories</p>
                                        <p className="text-lg font-semibold text-primary">{alt.nutritionalValue.calories}</p>
                                      </div>
                                      <div className="bg-primary/5 rounded-lg p-3">
                                        <p className="text-sm text-muted-foreground">Protein</p>
                                        <p className="text-lg font-semibold text-primary">{alt.nutritionalValue.protein}g</p>
                                      </div>
                                      <div className="bg-primary/5 rounded-lg p-3">
                                        <p className="text-sm text-muted-foreground">Carbs</p>
                                        <p className="text-lg font-semibold text-primary">{alt.nutritionalValue.carbs}g</p>
                                      </div>
                                      <div className="bg-primary/5 rounded-lg p-3">
                                        <p className="text-sm text-muted-foreground">Fat</p>
                                        <p className="text-lg font-semibold text-primary">{alt.nutritionalValue.fat}g</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Benefits */}
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Heart className="w-4 h-4 text-primary" />
                                      <h4 className="font-medium">Health Benefits</h4>
                                    </div>
                                    <ul className="space-y-2">
                                      {alt.nutritionComparison.map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0 mt-2" />
                                          <span className="text-sm text-muted-foreground">{benefit}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {suggestions.length > 0 && <NoAlternativesFound suggestions={suggestions} />}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
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
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 py-12 text-center space-y-6">
            <div className="max-w-3xl mx-auto">
              <Apple className="w-16 h-16 mx-auto text-primary mb-6" />
              <h1 className="text-4xl font-bold mb-4">Make Your Meals Healthier</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Transform your favorite recipes into healthier versions without sacrificing taste. 
                Sign in to access our AI-powered alternative finder.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
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
                Start Making Healthier Meals
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
      {isLoading && <MealPlanLoadingOverlay isLoading={isLoading} />}
    </BaseLayout>
  );
}
