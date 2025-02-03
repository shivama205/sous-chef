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
import { Camera, ChefHat, Sparkles, History, Star, Utensils, Scale, Upload, Timer, UtensilsCrossed, ListChecks, Dumbbell } from "lucide-react";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { useAuth } from "@/providers/AuthProvider";
import { useDropzone } from "react-dropzone";
import { UserMacros } from "@/types/macros";
import { trackFeatureUsage } from "@/utils/analytics";
import { Recipe } from "@/types/recipeFinder";
import { findRecipes, saveRecipe, getUserRecipes } from "@/services/recipeFinder";
import { getUserMacros } from "@/services/userMacros";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";

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

export default function RecipeFinder() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
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
    if (acceptedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select an image file to upload.",
        variant: "destructive"
      });
      return;
    }

    const file = acceptedFiles[0];
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Coming Soon",
      description: "Image recognition feature will be available soon!",
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    noClick: false,
    noKeyboard: false
  });

  useEffect(() => {
    const fetchUserMacros = async () => {
      if (!user) return;

      const { data: macros } = await supabase
        .from("user_macros")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (macros) {
        setUserMacros(macros);
      }
    };

    fetchUserMacros();
  }, [user]);

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
        dietaryRestrictions,
        additionalInstructions,
        macros: userMacros
      });

      setRecipes(recipes);
      setSuggestions([]);

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

  // Load saved recipes and recent recipes on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      try {
        // Load saved recipe IDs
        const savedRecipes = await getUserRecipes(user.id);
        setSavedRecipeIds(new Set(savedRecipes.map(r => r.id)));
        
        // Set recent recipes from saved recipes, sorted by created_at
        const sortedRecipes = savedRecipes
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5); // Show only last 5 recipes
        setRecentRecipes(sortedRecipes);
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Error",
          description: "Failed to load your recipes. Please try again.",
          variant: "destructive",
        });
      }
    };
    loadUserData();
  }, [user]);

  const handleSaveRecipe = async (recipe: Recipe) => {
    if (!user) {
      setLoginDialogOpen(true);
      return;
    }

    try {
      const savedRecipe = await saveRecipe(user.id, recipe);
      // Update the recipes array with the saved recipe that has the ID
      setRecipes(prevRecipes => 
        prevRecipes.map(r => 
          r.meal_name === recipe.meal_name ? savedRecipe : r
        )
      );
      // Update the saved IDs set
      setSavedRecipeIds(prev => {
        const newSet = new Set(prev);
        newSet.add(savedRecipe.id);
        return newSet;
      });
      
      toast({
        title: "Recipe Saved",
        description: "Recipe has been saved to your collection.",
      });
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    if (recipe.id) {
      navigate(`/recipe/${recipe.id}`);
    }
  };

  return (
    <BaseLayout>
      <SEO 
        title="Recipe Finder"
        description="Find the perfect recipe for any occasion. Search by ingredients, cuisine, or dietary requirements and discover delicious, healthy recipes."
        keywords="recipe search, recipe finder, cooking recipes, meal recipes, ingredient search, cuisine finder, dietary recipes"
        type="website"
        canonical="https://sous-chef.in/recipe-finder"
      />
      {user ? (
        <div className="container mx-auto px-4 py-8 space-y-12">
          <PageHeader
            icon={Sparkles}
            title="Recipe Finder"
            description="Discover delicious recipes using ingredients you already have"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Find Recipes</h2>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="ingredients">Your Ingredients *</Label>
                    <Textarea
                      id="ingredients"
                      value={ingredientsText}
                      onChange={(e) => setIngredientsText(e.target.value)}
                      placeholder="Enter ingredients separated by commas (e.g., chicken, rice, tomatoes)"
                      className="min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                    <Textarea
                      id="dietaryRestrictions"
                      value={dietaryRestrictions}
                      onChange={(e) => setDietaryRestrictions(e.target.value)}
                      placeholder="Enter any dietary restrictions (e.g., vegetarian, gluten-free, dairy-free)"
                      className="min-h-[60px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInstructions">Additional Instructions</Label>
                    <Textarea
                      id="additionalInstructions"
                      value={additionalInstructions}
                      onChange={(e) => setAdditionalInstructions(e.target.value)}
                      placeholder="Any specific instructions or preferences (e.g., quick meals, low-carb, high-protein)"
                      className="min-h-[60px] resize-none"
                    />
                  </div>

                  <div 
                    {...getRootProps()} 
                    className={`
                      border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                      transition-colors duration-200
                      ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
                    `}
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {isDragActive ? 
                        "Drop your image here..." : 
                        "Drag & drop an image of your ingredients, or click to select"
                      }
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Coming soon!</p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading || !ingredientsText.trim()}
                  >
                    {isLoading ? "Finding Recipes..." : "Find Recipes"}
                  </Button>
                </form>
              </Card>

              {/* Results Section */}
              {recipes.length > 0 && (
                <div ref={resultsRef} className="space-y-4 sm:space-y-6 mt-6">
                  <h2 className="text-xl font-semibold">Found Recipes</h2>
                  {recipes.map((recipe, index) => (
                    <Card key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-primary to-primary/80 py-3 px-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-white">{recipe.meal_name}</h3>
                          <Button
                            variant={savedRecipeIds.has(recipe.id ?? '') ? "secondary" : "outline"}
                            size="sm"
                            className={`flex items-center gap-2 ${
                              savedRecipeIds.has(recipe.id ?? '') 
                                ? "bg-white/10 text-white hover:bg-white/20" 
                                : "bg-white text-primary hover:bg-white/90"
                            }`}
                            onClick={() => handleSaveRecipe(recipe)}
                            disabled={savedRecipeIds.has(recipe.id ?? '')}
                          >
                            <Star className={`w-4 h-4 ${savedRecipeIds.has(recipe.id ?? '') ? "fill-current" : ""}`} />
                            {savedRecipeIds.has(recipe.id ?? '') ? "Saved" : "Save Recipe"}
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80 mt-1">
                          <Timer className="w-4 h-4" />
                          <span>Cooking Time: {recipe.cooking_time} minutes</span>
                        </div>
                      </div>

                      <div className="divide-y divide-gray-100">
                        {/* Ingredients Section */}
                        <div className="p-4 space-y-3">
                          <div className="flex items-center gap-2 mb-3">
                            <UtensilsCrossed className="w-5 h-5 text-primary" />
                            <h4 className="font-medium text-gray-900">Ingredients</h4>
                          </div>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {recipe.ingredients.map((ingredient, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0 mt-2" />
                                <span className="text-sm text-gray-600">{ingredient}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Instructions Section */}
                        <div className="p-4 space-y-3">
                          <div className="flex items-center gap-2 mb-3">
                            <ListChecks className="w-5 h-5 text-primary" />
                            <h4 className="font-medium text-gray-900">Instructions</h4>
                          </div>
                          <ol className="space-y-2">
                            {recipe.instructions.map((instruction, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <span className="text-sm font-medium text-primary/60">{i + 1}.</span>
                                <span className="text-sm text-gray-600">{instruction}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Nutritional Info Section */}
                        <div className="bg-gray-50 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Dumbbell className="w-5 h-5 text-primary" />
                            <h4 className="font-medium text-gray-900">Nutritional Value</h4>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div className="bg-white p-2 rounded shadow-sm">
                              <div className="text-gray-500 text-xs">Calories</div>
                              <div className="font-medium text-gray-900">{recipe.nutritional_value.calories}</div>
                            </div>
                            <div className="bg-white p-2 rounded shadow-sm">
                              <div className="text-gray-500 text-xs">Protein</div>
                              <div className="font-medium text-gray-900">{recipe.nutritional_value.protein}g</div>
                            </div>
                            <div className="bg-white p-2 rounded shadow-sm">
                              <div className="text-gray-500 text-xs">Carbs</div>
                              <div className="font-medium text-gray-900">{recipe.nutritional_value.carbs}g</div>
                            </div>
                            <div className="bg-white p-2 rounded shadow-sm">
                              <div className="text-gray-500 text-xs">Fat</div>
                              <div className="font-medium text-gray-900">{recipe.nutritional_value.fat}g</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {suggestions.length > 0 && <NoRecipesFound suggestions={suggestions} />}
            </div>

            {/* Sidebar */}
            <div className="space-y-4 lg:space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Recipes</h3>
                  <History className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {recentRecipes.map((recipe, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                      onClick={() => handleRecipeClick(recipe)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <ChefHat className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{recipe.meal_name}</h4>
                        <p className="text-sm text-gray-500">
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
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12 text-center space-y-6">
          <div className="max-w-2xl mx-auto">
            <UtensilsCrossed className="w-16 h-16 mx-auto text-primary mb-6" />
            <h1 className="text-4xl font-bold mb-4">Find Recipes with Your Ingredients</h1>
            <p className="text-lg text-gray-600 mb-8">
              Turn your available ingredients into delicious meals. Sign in to access our AI-powered recipe finder and get personalized recipe suggestions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              className="mt-8"
              onClick={() => setLoginDialogOpen(true)}
            >
              Sign In to Get Started
            </Button>
          </div>
        </div>
      )}

      <LoginDialog 
        open={loginDialogOpen} 
        onOpenChange={setLoginDialogOpen}
      />
      {isLoading && <MealPlanLoadingOverlay isLoading={isLoading} />}
    </BaseLayout>
  );
}