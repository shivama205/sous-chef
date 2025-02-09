import { useState, useRef, useEffect } from "react";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { ChefHat, Clock, Utensils, ArrowRight, Loader2, Brain, Coffee, Sparkles, UtensilsCrossed } from "lucide-react";
import { suggestMeals, type SuggestedMeal, type MealSuggestionRequest } from "@/services/mealSuggestions";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { MealPlanLoadingOverlay } from "@/components/MealPlanLoadingOverlay";
import { LoginDialog } from "@/components/LoginDialog";
import { SEO } from "@/components/SEO";
import { usePageTracking } from "@/hooks/usePageTracking";
import { dataLayer } from "@/services/dataLayer";
import { PageHeader } from "@/components/ui/PageHeader";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Recipe } from "@/types/recipeFinder";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Suggestions",
    description: "Get personalized meal ideas based on your mood and energy level"
  },
  {
    icon: ChefHat,
    title: "Multiple Options",
    description: "Choose between cooking at home, ordering in, or eating out"
  },
  {
    icon: Clock,
    title: "Quick Decisions",
    description: "Save time deciding what to eat with instant suggestions"
  }
];

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
      // Add a longer delay to ensure content and animations are rendered
      const scrollTimeout = setTimeout(() => {
        const cookAtHomeSection = document.getElementById('cook-at-home-section');
        if (cookAtHomeSection) {
          cookAtHomeSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 300);

      return () => clearTimeout(scrollTimeout);
    }
  }, [suggestions, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Track meal suggestions request
    dataLayer.trackRecipeSearch({
      search_term: request.mealType || 'any',
      search_type: 'meal_suggestions',
      results_count: 0, // Will be updated after results
      user_id: user?.id,
    });

    try {
      const meals = await suggestMeals(request);
      setSuggestions(meals);

      // Track successful suggestions
      dataLayer.trackRecipeSearch({
        search_term: request.mealType || 'any',
        search_type: 'meal_suggestions',
        results_count: meals.length,
        user_id: user?.id,
      });

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
    // Track recipe view
    dataLayer.trackRecipeView({
      recipe_name: meal.name,
      recipe_category: meal.type,
      cooking_time: meal.cookingTime,
      user_id: user?.id,
    });
    
    if (!user) {
      setSelectedMeal(meal);
      setShowSignIn(true);
      return;
    }
    
    // Transform meal to match Recipe interface
    const recipe: Recipe = {
      name: meal.name,
      description: meal.description || `A delicious ${meal.name} recipe`,
      cookingTime: meal.cookingTime,
      ingredients: meal.ingredients || [],
      instructions: meal.instructions || [],
      nutritionalValue: meal.nutritionalValue || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      },
      difficulty: (meal.difficulty || 'medium').toLowerCase() as 'easy' | 'medium' | 'hard',
      cuisineType: meal.type || 'Mixed',
      imageUrl: null
    };
    
    navigate('/recipe/new', { state: { recipe } });
  };

  // Track form field changes
  const handleFieldChange = (field: keyof MealSuggestionRequest, value: any) => {
    setRequest(prev => ({ ...prev, [field]: value }));
    
    // Track significant form interactions
    if (['mealType', 'cookingTime', 'difficulty'].includes(field)) {
      dataLayer.trackFormField({
        field_name: field,
        field_value: value,
        user_id: user?.id
      });
    }
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
      
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <PageHeader
            icon={Sparkles}
            title="What Should I Eat?"
            description="Let AI help you decide your next meal based on your mood and energy level"
          />

          {user ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <Card className="backdrop-blur-sm border-0 shadow-sm">
                  <div className="p-6 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-6">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-base">
                            <Coffee className="w-4 h-4 text-primary" />
                            Which meal are you planning?
                          </Label>
                          <Select
                            value={request.mealType}
                            onValueChange={(value) => handleFieldChange('mealType', value)}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="I need ideas for..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Breakfast">🌅 Breakfast - Rise and Shine!</SelectItem>
                              <SelectItem value="Lunch">🥪 Lunch - Midday Fuel</SelectItem>
                              <SelectItem value="Dinner">🍝 Dinner - Evening Yums</SelectItem>
                              <SelectItem value="Snack">🍿 Just a Snack - Little Nibbles</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-base">
                            <Brain className="w-4 h-4 text-primary" />
                            How's your energy level?
                          </Label>
                          <Select
                            value={request.cookingTime}
                            onValueChange={(value) => handleFieldChange('cookingTime', value)}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Be honest..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Quick">😫 Too tired to function</SelectItem>
                              <SelectItem value="Medium">🤔 Could do some cooking</SelectItem>
                              <SelectItem value="Long">👨‍🍳 Ready to channel my inner chef!</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-base">
                            <ChefHat className="w-4 h-4 text-primary" />
                            Cooking mood?
                          </Label>
                          <Select
                            value={request.difficulty}
                            onValueChange={(value) => handleFieldChange('difficulty', value)}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="How adventurous are you?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Easy">🥪 Keep it super simple</SelectItem>
                              <SelectItem value="Medium">🥘 Something interesting</SelectItem>
                              <SelectItem value="Hard">🎩 Let's get fancy!</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-base">
                            <Utensils className="w-4 h-4 text-primary" />
                            Any dietary restrictions?
                          </Label>
                          <Textarea
                            placeholder="Tell us about your dietary needs... (e.g., vegetarian, no nuts, low-carb, etc.)"
                            value={request.dietaryRestrictions}
                            onChange={(e) => handleFieldChange('dietaryRestrictions', e.target.value)}
                            className="min-h-[80px] resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-base">
                            <Brain className="w-4 h-4 text-primary" />
                            Any specific cravings?
                          </Label>
                          <Textarea
                            placeholder="Anything specific you're in the mood for? Or things you definitely don't want?"
                            value={request.instructions}
                            onChange={(e) => handleFieldChange('instructions', e.target.value)}
                            className="min-h-[80px] resize-none"
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        size="lg"
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Finding your perfect meal...
                          </>
                        ) : (
                          <>
                            Help Me Decide
                            <Sparkles className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="backdrop-blur-sm border-0 shadow-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">How It Works</h3>
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

                <Card className="backdrop-blur-sm border-0 shadow-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Tips</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        Be honest about your energy level for better suggestions
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        Specify any dietary restrictions clearly
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        Include any specific cravings or preferences
                      </li>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <UtensilsCrossed className="w-16 h-16 mx-auto text-primary" />
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Can't Decide What to Eat?</h2>
                <p className="text-lg text-muted-foreground">
                  Let our AI-powered meal suggestion system help you decide! Get personalized recommendations based on your mood, energy level, and preferences.
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
                onClick={() => setShowSignIn(true)}
                className="bg-primary hover:bg-primary/90"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* Results Section */}
          {suggestions.length > 0 && (
            <div ref={suggestionsRef} className="space-y-8 pt-8">
              <h2 className="text-2xl font-semibold text-center">Your Personalized Meal Suggestions</h2>
              
              {/* Cook at Home Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/10" />
                  <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full">
                    <ChefHat className="w-5 h-5 text-primary" />
                    <span className="font-medium text-primary">Cook at Home</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {suggestions
                    .filter(meal => meal.type === "cook-at-home")
                    .map((meal, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                          <div className="p-6 space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                                  {meal.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {meal.description}
                                </p>
                              </div>
                              <div className="flex-shrink-0 flex flex-col items-center gap-1 bg-primary/5 px-3 py-2 rounded-lg">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">{meal.cookingTime}</span>
                                <span className="text-xs text-muted-foreground">mins</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                              <div className="bg-primary/5 p-3 rounded-lg text-center">
                                <div className="text-xs text-primary/60 font-medium">Calories</div>
                                <div className="font-semibold">{meal.nutritionalValue.calories}</div>
                              </div>
                              <div className="bg-primary/5 p-3 rounded-lg text-center">
                                <div className="text-xs text-primary/60 font-medium">Protein</div>
                                <div className="font-semibold">{meal.nutritionalValue.protein}g</div>
                              </div>
                              <div className="bg-primary/5 p-3 rounded-lg text-center">
                                <div className="text-xs text-primary/60 font-medium">Carbs</div>
                                <div className="font-semibold">{meal.nutritionalValue.carbs}g</div>
                              </div>
                              <div className="bg-primary/5 p-3 rounded-lg text-center">
                                <div className="text-xs text-primary/60 font-medium">Fat</div>
                                <div className="font-semibold">{meal.nutritionalValue.fat}g</div>
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300"
                              onClick={handleRecipeClick(meal)}
                            >
                              <span className="flex items-center gap-2">
                                View Full Recipe
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </span>
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </div>

              {/* Quick Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Eat Out Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-lg">🍽️</span>
                    </div>
                    <h3 className="font-medium text-lg">Eat Out Options</h3>
                  </div>
                  <div className="grid gap-4">
                    {suggestions
                      .filter(meal => meal.type === "eat-out")
                      .map((meal, index) => (
                        <motion.div
                          key={`eat-out-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="group hover:shadow-md transition-all duration-300">
                            <div className="p-4">
                              <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                                {meal.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {meal.description}
                              </p>
                              <div className="grid grid-cols-2 gap-2 mt-4">
                                <div className="bg-orange-50 p-2 rounded-lg text-center">
                                  <div className="text-xs text-orange-600/60 font-medium">Calories</div>
                                  <div className="font-medium text-orange-600">
                                    {meal.nutritionalValue.calories}
                                  </div>
                                </div>
                                <div className="bg-orange-50 p-2 rounded-lg text-center">
                                  <div className="text-xs text-orange-600/60 font-medium">Protein</div>
                                  <div className="font-medium text-orange-600">
                                    {meal.nutritionalValue.protein}g
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                </div>

                {/* Order In Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-lg">🛵</span>
                    </div>
                    <h3 className="font-medium text-lg">Order In Options</h3>
                  </div>
                  <div className="grid gap-4">
                    {suggestions
                      .filter(meal => meal.type === "order-in")
                      .map((meal, index) => (
                        <motion.div
                          key={`order-in-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="group hover:shadow-md transition-all duration-300">
                            <div className="p-4">
                              <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                                {meal.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {meal.description}
                              </p>
                              <div className="grid grid-cols-2 gap-2 mt-4">
                                <div className="bg-blue-50 p-2 rounded-lg text-center">
                                  <div className="text-xs text-blue-600/60 font-medium">Calories</div>
                                  <div className="font-medium text-blue-600">
                                    {meal.nutritionalValue.calories}
                                  </div>
                                </div>
                                <div className="bg-blue-50 p-2 rounded-lg text-center">
                                  <div className="text-xs text-blue-600/60 font-medium">Protein</div>
                                  <div className="font-medium text-blue-600">
                                    {meal.nutritionalValue.protein}g
                                  </div>
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
          )}
        </div>
      </div>

      <LoginDialog 
        open={showSignIn} 
        onOpenChange={setShowSignIn}
      />
      {isLoading && <MealPlanLoadingOverlay isLoading={isLoading} />}
    </BaseLayout>
  );
} 