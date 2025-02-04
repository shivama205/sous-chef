import { useState, useRef, useEffect } from "react";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { ChefHat, Clock, Utensils, ArrowRight, Loader2, Brain, Coffee } from "lucide-react";
import { suggestMeals, type SuggestedMeal, type MealSuggestionRequest } from "@/services/mealSuggestions";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { MealPlanLoadingOverlay } from "@/components/MealPlanLoadingOverlay";
import { LoginDialog } from "@/components/LoginDialog";
import { SEO } from "@/components/SEO";
import { usePageTracking } from "@/hooks/usePageTracking";
import { trackEvent } from "@/services/analyticsTracker";
import { EventName, EventCategory, Feature } from "@/constants/eventTaxonomy";

export function MealSuggestions() {
  usePageTracking();
  const [isLoading, setIsLoading] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedMeal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<SuggestedMeal | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [request, setRequest] = useState<MealSuggestionRequest>({
    preferences: [],
    mealType: undefined,
    cookingTime: undefined,
    difficulty: undefined,
    dietaryRestrictions: "",
    instructions: ""
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (suggestions.length > 0 && !isLoading) {
      suggestionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [suggestions, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    trackEvent({
      action: EventName.FormSubmit,
      category: EventCategory.Engagement,
      feature: Feature.MealSuggestions,
      label: 'meal_suggestions_request',
      metadata: {
        mealType: request.mealType,
        dietaryRestrictions: request.dietaryRestrictions,
        preferences: request.preferences
      }
    });

    try {
      const meals = await suggestMeals(request);
      setSuggestions(meals);
      toast({
        title: "Yay! 🎉",
        description: "We've found some tasty meals to make your life easier!",
      });
    } catch (error) {
      console.error('Error getting meal suggestions:', error);
      toast({
        title: "Oops!",
        description: "We hit a snag finding meals. Let's try that again?",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeClick = (meal: SuggestedMeal) => (e: React.MouseEvent) => {
    trackEvent({
      action: EventName.ButtonClick,
      category: EventCategory.Engagement,
      feature: Feature.MealSuggestions,
      label: 'suggested_recipe_click',
      metadata: {
        recipeName: meal.name,
        mealType: meal.type,
        difficulty: meal.difficulty,
        cookingTime: meal.cookingTime
      }
    });
    
    if (!user) {
      setSelectedMeal(meal);
      setShowSignIn(true);
      return;
    }
    
    navigate('/recipe/new', { state: { meal } });
  };

  const handleLoginPrompt = () => {
    trackEvent({
      action: EventName.ButtonClick,
      category: EventCategory.Auth,
      feature: Feature.MealSuggestions,
      label: 'login_prompt',
      metadata: {
        source: 'meal_suggestions'
      }
    });
    setShowSignIn(true);
  };

  return (
    <BaseLayout>
      <SEO 
        title="Quick Meal Suggestions"
        description="Get instant meal ideas based on your mood and energy level. Our AI suggests personalized meal options whether you want to cook, order in, or eat out."
        keywords="quick meals, meal suggestions, food recommendations, easy recipes, meal ideas, AI food suggestions"
        type="website"
        canonical="https://mysidechef.com/meal-suggestions"
      />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Too Tired to Think About Food? 😴
            </h1>
            <p className="text-lg text-muted-foreground">
              Don't worry! We'll help you figure out what to eat. No more staring at the fridge!
            </p>
          </div>

          {/* Form */}
          <div className="relative">
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-x-0 bottom-0 top-[64px] bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
              >
                <MealPlanLoadingOverlay isLoading={isLoading} />
              </motion.div>
            )}
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Coffee className="w-4 h-4" />
                      Which meal are you planning? 🍽️
                    </Label>
                    <Select
                      value={request.mealType}
                      onValueChange={(value: any) => setRequest(prev => ({ ...prev, mealType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="I need ideas for..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Breakfast">Breakfast - Rise and Shine! 🌅</SelectItem>
                        <SelectItem value="Lunch">Lunch - Midday Fuel 🥪</SelectItem>
                        <SelectItem value="Dinner">Dinner - Evening Yums 🍝</SelectItem>
                        <SelectItem value="Snack">Just a Snack - Little Nibbles 🍿</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      How's your energy level?
                    </Label>
                    <Select
                      value={request.cookingTime}
                      onValueChange={(value: any) => setRequest(prev => ({ ...prev, cookingTime: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Be honest..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Quick">Too tired to function 😫</SelectItem>
                        <SelectItem value="Medium">Could do some cooking 🤔</SelectItem>
                        <SelectItem value="Long">Ready to channel my inner chef! 👨‍🍳</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ChefHat className="w-4 h-4" />
                      Cooking mood?
                    </Label>
                    <Select
                      value={request.difficulty}
                      onValueChange={(value: any) => setRequest(prev => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="How adventurous are you?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Keep it super simple 🥪</SelectItem>
                        <SelectItem value="Medium">Something interesting 🥘</SelectItem>
                        <SelectItem value="Hard">Let's get fancy! 🎩</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Utensils className="w-4 h-4" />
                      Any dietary restrictions or preferences?
                    </Label>
                    <Textarea
                      placeholder="Tell us about your dietary needs... (e.g., vegetarian, no nuts, low-carb, etc.)"
                      value={request.dietaryRestrictions}
                      onChange={(e) => setRequest(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ChefHat className="w-4 h-4" />
                      Any specific instructions or cravings?
                    </Label>
                    <Textarea
                      placeholder="Anything specific you're in the mood for? Or things you definitely don't want?"
                      value={request.instructions}
                      onChange={(e) => setRequest(prev => ({ ...prev, instructions: e.target.value }))}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-primary/80"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Finding yummy options...
                    </>
                  ) : (
                    <>
                      Help Me Decide! 🎯
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Results */}
          {suggestions.length > 0 && (
            <motion.div
              ref={suggestionsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <h2 className="text-2xl font-semibold text-center">Here's What We Found For You! 🎉</h2>
              
              {/* Cook at Home Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 justify-center">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/10" />
                  <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full">
                    <ChefHat className="w-5 h-5 text-primary" />
                    <span className="text-lg font-medium text-primary">Recommended: Cook at Home</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {suggestions
                    .filter(meal => meal.type === "cook-at-home")
                    .slice(0, 2)
                    .map((meal, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                          <div className="p-6">
                            <div className="flex items-start justify-between gap-6 mb-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{meal.name}</h3>
                                {meal.description && (
                                  <p className="text-sm text-muted-foreground mt-2">{meal.description}</p>
                                )}
                              </div>
                              {meal.cookingTime && (
                                <div className="flex-shrink-0 flex flex-col items-center gap-1 bg-primary/5 px-4 py-2 rounded-lg">
                                  <Clock className="w-4 h-4 text-primary" />
                                  <div className="text-sm font-medium">{meal.cookingTime}</div>
                                  <div className="text-xs text-muted-foreground">mins</div>
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                              <div className="bg-primary/5 p-3 rounded-lg">
                                <div className="text-xs text-primary/60 font-medium">Protein</div>
                                <div className="font-semibold mt-1">{meal.nutritionalValue.protein}g</div>
                              </div>
                              <div className="bg-primary/5 p-3 rounded-lg">
                                <div className="text-xs text-primary/60 font-medium">Carbs</div>
                                <div className="font-semibold mt-1">{meal.nutritionalValue.carbs}g</div>
                              </div>
                              <div className="bg-primary/5 p-3 rounded-lg">
                                <div className="text-xs text-primary/60 font-medium">Fat</div>
                                <div className="font-semibold mt-1">{meal.nutritionalValue.fat}g</div>
                              </div>
                              <div className="bg-primary/5 p-3 rounded-lg">
                                <div className="text-xs text-primary/60 font-medium">Calories</div>
                                <div className="font-semibold mt-1">{meal.nutritionalValue.calories}</div>
                              </div>
                            </div>
                            
                            <div className="pt-4">
                              <Button 
                                variant="outline" 
                                className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300"
                                onClick={handleRecipeClick(meal)}
                              >
                                <span className="flex items-center gap-2">
                                  <ChefHat className="w-4 h-4" />
                                  Get Full Recipe & Instructions
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </div>

              {/* Quick Options Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 justify-center">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/10" />
                  <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full">
                    <Brain className="w-5 h-5 text-primary" />
                    <span className="text-lg font-medium text-primary">Other Options</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/10" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Eat Out Options */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">🍽️</span>
                      </div>
                      <h3 className="font-medium text-lg">Eat Out Options</h3>
                    </div>
                    <div className="grid gap-4">
                      {suggestions
                        .filter(meal => meal.type === "eat-out")
                        .slice(0, 2)
                        .map((meal, index) => (
                          <motion.div
                            key={`eat-out-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
                              <div className="p-4">
                                <div className="space-y-2">
                                  <h3 className="font-medium text-lg">{meal.name}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">{meal.description}</p>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                  <div className="bg-orange-50 p-2 rounded-lg text-center">
                                    <div className="text-xs text-orange-600/60 font-medium">Protein</div>
                                    <div className="font-medium text-orange-600">{meal.nutritionalValue.protein}g</div>
                                  </div>
                                  <div className="bg-orange-50 p-2 rounded-lg text-center">
                                    <div className="text-xs text-orange-600/60 font-medium">Calories</div>
                                    <div className="font-medium text-orange-600">{meal.nutritionalValue.calories}</div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                    </div>
                  </div>

                  {/* Order In Options */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">🛵</span>
                      </div>
                      <h3 className="font-medium text-lg">Order In / Delivery</h3>
                    </div>
                    <div className="grid gap-4">
                      {suggestions
                        .filter(meal => meal.type === "order-in")
                        .slice(0, 2)
                        .map((meal, index) => (
                          <motion.div
                            key={`order-in-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (index + 2) * 0.1 }}
                          >
                            <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
                              <div className="p-4">
                                <div className="space-y-2">
                                  <h3 className="font-medium text-lg">{meal.name}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">{meal.description}</p>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                  <div className="bg-blue-50 p-2 rounded-lg text-center">
                                    <div className="text-xs text-blue-600/60 font-medium">Protein</div>
                                    <div className="font-medium text-blue-600">{meal.nutritionalValue.protein}g</div>
                                  </div>
                                  <div className="bg-blue-50 p-2 rounded-lg text-center">
                                    <div className="text-xs text-blue-600/60 font-medium">Calories</div>
                                    <div className="font-medium text-blue-600">{meal.nutritionalValue.calories}</div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sign In Nudge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/10">
                  <div className="p-8 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <ChefHat className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Want More Personalized Recipes?</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Sign in to unlock full recipes, save your favorites, and get personalized meal plans tailored to your preferences!
                    </p>
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90" onClick={handleLoginPrompt}>
                      <Link to="/sign-in" className="gap-2">
                        Sign in to Get Started
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Login Dialog */}
          <LoginDialog
            open={showSignIn}
            onOpenChange={setShowSignIn}
            redirectPath="/recipe/new"
            state={{ meal: selectedMeal }}
          />
        </div>
      </main>
    </BaseLayout>
  );
} 