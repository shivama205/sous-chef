import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";
import { LoginDialog } from "@/components/LoginDialog";
import { MealPlanLoadingOverlay } from "@/components/MealPlanLoadingOverlay";
import { PageHeader } from "@/components/ui/PageHeader";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Camera, ChefHat, Sparkles, History, Star, Utensils, Scale, Upload, Timer, UtensilsCrossed, ListChecks, Dumbbell, Clock, ArrowRight, Apple, Brain } from "lucide-react";
import { ServiceLayout } from "@/components/layouts/ServiceLayout";
import { useAuth } from "@/providers/AuthProvider";
import { useDropzone } from "react-dropzone";
import { UserMacros } from "@/types/macros";
import { Recipe } from "@/types/recipeFinder";
import { findRecipes, saveRecipe, getUserRecipes } from "@/services/recipeFinder";
import { getUserMacros } from "@/services/userMacros";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { usePageTracking } from "@/hooks/usePageTracking";
import { dataLayer } from "@/services/dataLayer";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const suggestionList = [
  "Ensure ingredients are spelled correctly",
  "Specify the dietary restrictions and additional instructions in the input field",
  "Try changing the ingredients to see if you get different recipes",
  "Try adding some common ingredients like oil, salt, or spices to get more recipe options",
];

const features = [
  {
    icon: Utensils,
    title: "Smart Recipe Suggestions",
    description: "Get personalized recipe ideas based on ingredients you have"
  },
  {
    icon: Camera,
    title: "Ingredient Recognition",
    description: "Simply take a photo of your ingredients and let AI identify them"
  },
  {
    icon: Scale,
    title: "Macro-Aware",
    description: "Recipes tailored to your nutritional goals and preferences"
  }
];

const NoRecipesFound = ({ suggestions }: { suggestions: string[] }) => (
  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6 mt-8">
    <div className="text-center space-y-4">
      <ChefHat className="w-12 h-12 mx-auto text-gray-400" />
      <h3 className="text-lg font-semibold">No Recipes Found</h3>
      <p className="text-gray-600">Don't worry! Here are some suggestions to help you find recipes:</p>
      <ul className="text-left space-y-2 max-w-md mx-auto">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span className="text-gray-600">{suggestion}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-500">
        Try adding some common ingredients like oil, salt, or spices to get more recipe options.
      </p>
    </div>
  </Card>
);

// Add type safety for nutritional values
const getNutritionalValue = (recipe: Recipe) => {
  const defaultValue = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  return recipe.nutritionalValue || defaultValue;
};

export default function RecipeFinder() {
  usePageTracking();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [ingredientsText, setIngredientsText] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>("");
  const [additionalInstructions, setAdditionalInstructions] = useState<string>("");
  const [userMacros, setUserMacros] = useState<UserMacros | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();
  const onDrop = async (acceptedFiles: File[]) => {
    // Disable functionality
    toast({
      title: "Coming Soon",
      description: "Image recognition feature is not yet available. Stay tuned!",
    });
    return;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    noClick: false,
    noKeyboard: false,
    disabled: true // Disable the dropzone
  });

  // Combine user data loading into a single useEffect
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setSavedRecipeIds(new Set());
        setRecentRecipes([]);
        setUserMacros(null);
        return;
      }

      setIsLoadingUserData(true);
      try {
        // Load macros and recipes in parallel
        const [macrosResult, savedRecipes] = await Promise.all([
          supabase.from("user_macros").select("*").eq("user_id", user.id).maybeSingle(),
          getUserRecipes(user.id)
        ]);

        // Set macros if available
        if (macrosResult.data) {
          setUserMacros(macrosResult.data);
        }

        // Set recipes data
        if (savedRecipes.length > 0) {
          setSavedRecipeIds(new Set(savedRecipes.map(r => r.id)));
          const sortedRecipes = savedRecipes
            .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
            .slice(0, 5);
          setRecentRecipes(sortedRecipes);
        } else {
          setSavedRecipeIds(new Set());
          setRecentRecipes([]);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoadingUserData(false);
      }
    };

    loadUserData();
  }, [user?.id]); // Only reload when user ID changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const ingredients = ingredientsText
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    if (ingredients.length === 0) {
      toast({
        title: "Error",
        description: "Please enter some ingredients",
        variant: "destructive",
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
      const recipes: Recipe[] = await findRecipes({
        ingredients,
        dietaryRestrictions: dietaryRestrictions.split(',').map(r => r.trim()),
        additionalInstructions,
        macros: userMacros
      });

      setRecipes(recipes);
      setSuggestions([]);

      // Track successful search
      dataLayer.trackRecipeSearch({
        search_term: ingredients.join(', '),
        search_type: 'ingredients',
        results_count: recipes.length,
        user_id: user.id
      });

      toast({
        title: "Success",
        description: "Found recipes for your ingredients!",
      });

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error finding recipes:", error);
      setSuggestions(suggestionList);

      toast({
        title: "No Recipes Found",
        description: "We couldn't find recipes for your ingredients. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    if (!user) {
      setLoginDialogOpen(true);
      return;
    }

    try {
      await saveRecipe(user.id, recipe);
      
      // Track recipe save
      dataLayer.trackRecipeSave({
        recipe_id: recipe.id,
        recipe_name: recipe.name,
        cooking_time: recipe.cookingTime,
        user_id: user.id
      });

      toast({
        title: "Recipe saved!",
        description: "You can find it in your saved recipes.",
      });
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast({
        title: "Error saving recipe",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    console.log("in handleRecipeClick", recipe);
    // Track recipe view
    dataLayer.trackRecipeView({
      recipe_name: recipe.name,
      recipe_category: recipe.cuisineType,
      cooking_time: recipe.cookingTime,
      user_id: user?.id,
    });
    
    if (!user) {
      setLoginDialogOpen(true);
      return;
    }
    
    navigate('/recipe/new', { state: { meal: recipe } });
  };

  return (
    <ServiceLayout>
      <SEO 
        title="Recipe Finder - Cook with What You Have"
        description="Find delicious recipes using ingredients you already have. Our AI-powered recipe finder suggests personalized recipes based on your available ingredients and dietary preferences."
        keywords="recipe finder, ingredient-based recipes, cooking suggestions, recipe search, AI recipe finder"
        type="website"
        canonical="https://mysidechef.com/recipe-finder"
      />
      {user ? (
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-8 space-y-8">
            <PageHeader
              icon={Sparkles}
              title="Recipe Finder"
              description="Discover delicious recipes using ingredients you already have"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <Card className="bg-white border shadow-sm">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Find Recipes</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      <div className="space-y-2">
                        <Label className="text-base font-medium text-foreground flex items-center gap-2">
                          <Utensils className="w-4 h-4 text-primary" />
                          Your Ingredients
                        </Label>
                        <Textarea
                          id="ingredients"
                          value={ingredientsText}
                          onChange={(e) => setIngredientsText(e.target.value)}
                          placeholder="Enter ingredients separated by commas (e.g., chicken, rice, tomatoes)"
                          className="min-h-[100px] resize-none bg-white border-input hover:bg-gray-50/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-base font-medium text-foreground flex items-center gap-2">
                          <Apple className="w-4 h-4 text-primary" />
                          Dietary Restrictions
                        </Label>
                        <Textarea
                          id="dietaryRestrictions"
                          value={dietaryRestrictions}
                          onChange={(e) => setDietaryRestrictions(e.target.value)}
                          placeholder="Enter any dietary restrictions (e.g., vegetarian, gluten-free, dairy-free)"
                          className="min-h-[80px] resize-none bg-white border-input hover:bg-gray-50/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-base font-medium text-foreground flex items-center gap-2">
                          <Brain className="w-4 h-4 text-primary" />
                          Additional Instructions
                        </Label>
                        <Textarea
                          id="additionalInstructions"
                          value={additionalInstructions}
                          onChange={(e) => setAdditionalInstructions(e.target.value)}
                          placeholder="Any specific instructions or preferences (e.g., quick meals, low-carb, high-protein)"
                          className="min-h-[80px] resize-none bg-white border-input hover:bg-gray-50/50"
                        />
                      </div>

                      <div 
                        {...getRootProps()} 
                        className={`
                          relative border-2 border-dashed rounded-lg p-6 text-center
                          transition-colors duration-200 bg-white/50
                          ${isDragActive ? 'border-primary/30' : 'border-input'}
                          cursor-not-allowed opacity-75
                        `}
                      >
                        <div className="absolute -right-1 top-0 transform translate-y-[-50%]">
                          <div className="bg-[#2B513D] text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-sm">
                            Coming Soon
                          </div>
                        </div>
                        <input {...getInputProps()} disabled />
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground/75">
                          {isDragActive ? 
                            "Drop your image here..." : 
                            "Drag & drop an image of your ingredients, or click to select"
                          }
                        </p>
                      </div>

                      <Button 
                        type="submit" 
                        size="lg"
                        className="w-full"
                        disabled={isLoading || !ingredientsText.trim()}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Finding Recipes...
                          </>
                        ) : (
                          <>
                            Find Recipes
                            <Sparkles className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </Card>

                {/* Results Section */}
                {recipes.length > 0 && (
                  <div ref={resultsRef} className="space-y-8 pt-8">
                    <h2 className="text-2xl font-semibold text-center">Found Recipes</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {recipes.map((recipe, index) => (
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
                                    {recipe.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {recipe.description}
                                  </p>
                                </div>
                                <div className="flex-shrink-0 flex flex-col items-center gap-1 bg-primary/5 px-3 py-2 rounded-lg">
                                  <Clock className="w-4 h-4 text-primary" />
                                  <span className="text-sm font-medium">{recipe.cookingTime}</span>
                                  <span className="text-xs text-muted-foreground">mins</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-4 gap-2">
                                <div className="bg-primary/5 p-3 rounded-lg text-center">
                                  <div className="text-xs text-primary/60 font-medium">Calories</div>
                                  <div className="font-semibold">{getNutritionalValue(recipe).calories}</div>
                                </div>
                                <div className="bg-primary/5 p-3 rounded-lg text-center">
                                  <div className="text-xs text-primary/60 font-medium">Protein</div>
                                  <div className="font-semibold">{getNutritionalValue(recipe).protein}g</div>
                                </div>
                                <div className="bg-primary/5 p-3 rounded-lg text-center">
                                  <div className="text-xs text-primary/60 font-medium">Carbs</div>
                                  <div className="font-semibold">{getNutritionalValue(recipe).carbs}g</div>
                                </div>
                                <div className="bg-primary/5 p-3 rounded-lg text-center">
                                  <div className="text-xs text-primary/60 font-medium">Fat</div>
                                  <div className="font-semibold">{getNutritionalValue(recipe).fat}g</div>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  className="flex-1 group-hover:bg-primary group-hover:text-white transition-all duration-300"
                                  onClick={() => handleRecipeClick(recipe)}
                                >
                                  <span className="flex items-center gap-2">
                                    View Full Recipe
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
                )}

                {suggestions.length > 0 && <NoRecipesFound suggestions={suggestions} />}
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
                      <h3 className="text-lg font-semibold">Recent Recipes</h3>
                      <History className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-4">
                      {recentRecipes.map((recipe, index) => (
                        <div 
                          key={index} 
                          className="flex items-start gap-3 cursor-pointer hover:bg-gray-50/50 rounded-lg p-2 -mx-2 transition-colors"
                          onClick={() => handleRecipeClick(recipe)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <ChefHat className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{recipe.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(recipe.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
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
              <UtensilsCrossed className="w-16 h-16 mx-auto text-primary mb-6" />
              <h1 className="text-4xl font-bold mb-4">Find Recipes with Your Ingredients</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Turn your available ingredients into delicious meals. Sign in to access our AI-powered recipe finder and get personalized recipe suggestions.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
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
                Start Finding Recipes
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <LoginDialog 
        open={loginDialogOpen} 
        onOpenChange={setLoginDialogOpen}
      />
      {isLoading && <MealPlanLoadingOverlay isLoading={isLoading} />}
    </ServiceLayout>
  );
}