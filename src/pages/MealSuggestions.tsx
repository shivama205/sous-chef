import { useState, useRef, useEffect } from "react";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { ChefHat, Clock, Utensils, ArrowRight, Loader2, Brain, Coffee, Sparkles, UtensilsCrossed, Scale, Star } from "lucide-react";
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
    title: "Smart Suggestions",
    description: "Get instant meal ideas based on your mood and energy level"
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
  },
  {
    icon: Utensils,
    title: "Personalized Choices",
    description: "Recommendations tailored to your preferences and restrictions"
  },
  {
    icon: Scale,
    title: "Nutrition Focused",
    description: "Stay on track with your health goals while enjoying great food"
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

      // Scroll to results after a short delay to ensure content is rendered
      setTimeout(() => {
        const resultsSection = document.getElementById('cook-at-home-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);

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
      
      {user ? (
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-8 space-y-8">
            <PageHeader
              icon={Sparkles}
              title="What Should I Eat?"
              description="Let AI help you decide your next meal based on your mood and energy level"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <Card className="bg-white border shadow-sm">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Get Meal Suggestions</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-base font-medium text-foreground">
                          <Coffee className="w-4 h-4 text-primary" />
                          Which meal are you planning? *
                        </Label>
                        <Select
                          value={request.mealType}
                          onValueChange={(value) => handleFieldChange('mealType', value)}
                          required
                        >
                          <SelectTrigger className="h-12 bg-white border-input hover:bg-gray-50/50">
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
                        <Label className="flex items-center gap-2 text-base font-medium text-foreground">
                          <Brain className="w-4 h-4 text-primary" />
                          How's your energy level? *
                        </Label>
                        <Select
                          value={request.cookingTime}
                          onValueChange={(value) => handleFieldChange('cookingTime', value)}
                          required
                        >
                          <SelectTrigger className="h-12 bg-white border-input hover:bg-gray-50/50">
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
                        <Label className="flex items-center gap-2 text-base font-medium text-foreground">
                          <ChefHat className="w-4 h-4 text-primary" />
                          Cooking mood? *
                        </Label>
                        <Select
                          value={request.difficulty}
                          onValueChange={(value) => handleFieldChange('difficulty', value)}
                          required
                        >
                          <SelectTrigger className="h-12 bg-white border-input hover:bg-gray-50/50">
                            <SelectValue placeholder="How adventurous are you?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Easy">🥪 Keep it super simple</SelectItem>
                            <SelectItem value="Medium">🥘 Something interesting</SelectItem>
                            <SelectItem value="Hard">🎩 Let's get fancy!</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="border-t border-border my-4" />

                      <div className="space-y-2">
                        <Label className="text-base font-medium text-foreground flex items-center gap-2">
                          <Utensils className="w-4 h-4 text-primary" />
                          Dietary Preferences (Optional)
                        </Label>
                        <Textarea
                          value={request.dietaryRestrictions}
                          onChange={(e) => handleFieldChange('dietaryRestrictions', e.target.value)}
                          placeholder="Enter any dietary preferences or restrictions (e.g., vegetarian, gluten-free)"
                          className="min-h-[100px] resize-none bg-white border-input hover:bg-gray-50/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-base font-medium text-foreground flex items-center gap-2">
                          <Brain className="w-4 h-4 text-primary" />
                          Additional Instructions (Optional)
                        </Label>
                        <Textarea
                          value={request.instructions}
                          onChange={(e) => handleFieldChange('instructions', e.target.value)}
                          placeholder="Any specific instructions or preferences (e.g., quick meals, budget-friendly)"
                          className="min-h-[100px] resize-none bg-white border-input hover:bg-gray-50/50"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        size="lg"
                        className="w-full"
                        disabled={isLoading || !request.mealType || !request.cookingTime || !request.difficulty}
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

                <Card className="bg-white border shadow-sm">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Quick Tips</h3>
                      <Star className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Brain className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">Be honest about your energy level for better suggestions</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Utensils className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">Specify any dietary restrictions clearly</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <ChefHat className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">Include any specific cravings or preferences</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Results Section */}
            {suggestions.length > 0 && (
              <div ref={suggestionsRef} className="space-y-8 pt-8">
                <h2 className="text-2xl font-semibold text-center">Your Personalized Meal Suggestions</h2>
                
                {/* Cook at Home Section */}
                <div id="cook-at-home-section" className="space-y-6">
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
                          <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white border">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Eat Out Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/10" />
                      <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg">🍽️</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">Eat Out Options</h3>
                          <p className="text-xs text-muted-foreground">Local restaurants & cafes</p>
                        </div>
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/10" />
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
                            <Card className="group hover:shadow-md transition-all duration-300 bg-white border overflow-hidden">
                              <div className="p-5">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                  <div className="flex-1">
                                    <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                                      {meal.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {meal.description}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Clock className="w-3 h-3" />
                                      <span>{meal.cookingTime || '30-45'} mins</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-primary/5 p-3 rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-xs text-primary/60 font-medium">Calories</div>
                                        <div className="font-medium text-primary">
                                          {meal.nutritionalValue.calories}
                                        </div>
                                      </div>
                                      <Scale className="w-4 h-4 text-primary/60" />
                                    </div>
                                  </div>
                                  <div className="bg-primary/5 p-3 rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-xs text-primary/60 font-medium">Protein</div>
                                        <div className="font-medium text-primary">
                                          {meal.nutritionalValue.protein}g
                                        </div>
                                      </div>
                                      <ChefHat className="w-4 h-4 text-primary/60" />
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                  <div className="flex gap-2">
                                    {meal.tags?.map((tag, i) => (
                                      <span key={i} className="px-2 py-1 rounded-full bg-primary/5 text-xs text-primary">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-primary hover:text-primary hover:bg-primary/5"
                                  >
                                    View Details
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                    </div>
                  </div>

                  {/* Order In Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/10" />
                      <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg">🛵</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">Order In Options</h3>
                          <p className="text-xs text-muted-foreground">Delivery services available</p>
                        </div>
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/10" />
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
                            <Card className="group hover:shadow-md transition-all duration-300 bg-white border overflow-hidden">
                              <div className="p-5">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                  <div className="flex-1">
                                    <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                                      {meal.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {meal.description}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Clock className="w-3 h-3" />
                                      <span>{meal.cookingTime || '45-60'} mins</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-primary/5 p-3 rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-xs text-primary/60 font-medium">Calories</div>
                                        <div className="font-medium text-primary">
                                          {meal.nutritionalValue.calories}
                                        </div>
                                      </div>
                                      <Scale className="w-4 h-4 text-primary/60" />
                                    </div>
                                  </div>
                                  <div className="bg-primary/5 p-3 rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-xs text-primary/60 font-medium">Protein</div>
                                        <div className="font-medium text-primary">
                                          {meal.nutritionalValue.protein}g
                                        </div>
                                      </div>
                                      <ChefHat className="w-4 h-4 text-primary/60" />
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                  <div className="flex gap-2">
                                    {meal.tags?.map((tag, i) => (
                                      <span key={i} className="px-2 py-1 rounded-full bg-primary/5 text-xs text-primary">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-primary hover:text-primary hover:bg-primary/5"
                                  >
                                    View Details
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                  </Button>
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
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 py-12 text-center space-y-6">
            <div className="max-w-3xl mx-auto">
              <UtensilsCrossed className="w-16 h-16 mx-auto text-primary mb-6" />
              <h1 className="text-4xl font-bold mb-4">Can't Decide What to Eat?</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Let our AI-powered meal suggestion system help you decide! Get personalized recommendations 
                based on your mood, energy level, and preferences. Whether you want to cook, order in, 
                or eat out, we've got you covered.
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
                onClick={() => setShowSignIn(true)}
              >
                Get Meal Suggestions
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <LoginDialog 
        open={showSignIn} 
        onOpenChange={setShowSignIn}
      />
      {isLoading && <MealPlanLoadingOverlay isLoading={isLoading} />}
    </BaseLayout>
  );
} 