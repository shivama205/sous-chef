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

interface Recipe {
  name: string;
  cookingTime: string;
  ingredients: string[];
  instructions: string[];
  nutritionalValue: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface NoRecipesError {
  error: string;
  suggestions: string[];
}

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

const recentRecipes = [
  {
    date: "2 days ago",
    name: "Quick Stir Fry",
    ingredients: ["chicken", "broccoli", "soy sauce"],
    saved: true
  },
  {
    date: "1 week ago",
    name: "Protein Pasta",
    ingredients: ["pasta", "ground turkey", "tomatoes"],
    saved: false
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
  const [ingredients, setIngredients] = useState("");
  const [userMacros, setUserMacros] = useState<UserMacros | null>(null);
  const [noRecipesError, setNoRecipesError] = useState<NoRecipesError | null>(null);

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

  const generatePrompt = (ingredients: string, macros: UserMacros | null): string => {
    return `Suggest 3 possible recipes using these ingredients:
    Ingredients: ${ingredients}
    ${macros ? `Target Macros per meal:
    - Calories: ~${Math.round(macros.calories / 3)}
    - Protein: ~${Math.round(macros.protein / 3)}g
    - Carbs: ~${Math.round(macros.carbs / 3)}g
    - Fat: ~${Math.round(macros.fat / 3)}g` : ''}
    
    For each recipe, provide:
    - Name of the dish
    - Cooking time
    - List of ingredients (mark which ones are from the provided list)
    - Step by step instructions
    - Nutritional value per serving

    If you cannot find any recipes with the given ingredients, respond with:
    {
      "error": "No recipes found",
      "suggestions": [
        "Add more basic ingredients like oil, salt, or spices",
        "Consider adding a protein source",
        "Include some vegetables or grains"
      ]
    }
    
    Otherwise, format the response as a JSON object with this structure:
    {
      "recipes": [
        {
          "name": "Recipe name",
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
    if (!ingredients.trim()) {
      toast({
        title: "Error",
        description: "Please enter some ingredients",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      setLoginDialogOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      await trackFeatureUsage("recipe_finder", {
        ingredients: ingredients.split(',').map(item => item.trim()),
        mealType: undefined,
        cuisineType: undefined,
        dietaryRestrictions: undefined
      });
      
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(generatePrompt(ingredients, userMacros));
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/```json([\s\S]*?)```/) || [null, text];
      const jsonString = jsonMatch[1]?.trim() || text.trim();
      
      const data = JSON.parse(jsonString);
      
      if (data.error) {
        setRecipes([]);
        setNoRecipesError(data as NoRecipesError);
        return;
      }

      setRecipes(data.recipes);
      setNoRecipesError(null);

      toast({
        title: "Success",
        description: "Found recipes for your ingredients!",
      });

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error finding recipes:", error);
      toast({
        title: "Error",
        description: "Failed to find recipes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseLayout>
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
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      placeholder="Enter ingredients separated by commas (e.g., chicken, rice, tomatoes)"
                      className="min-h-[100px] resize-none"
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
                    disabled={isLoading || !ingredients.trim()}
                  >
                    {isLoading ? "Finding Recipes..." : "Find Recipes"}
                  </Button>
                </form>
              </Card>

              {/* Results Section */}
              {recipes.length > 0 ? (
                <div ref={resultsRef} className="space-y-4 sm:space-y-6">
                  <h2 className="text-xl font-semibold">Found Recipes</h2>
                  {recipes.map((recipe, index) => (
                    <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm overflow-hidden">
                      <div className="p-4 sm:p-6 space-y-6">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-6">
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-gray-900">{recipe.name}</h3>
                            <div className="flex items-center gap-1.5">
                              <Timer className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-500">{recipe.cookingTime}</span>
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <UtensilsCrossed className="w-6 h-6 text-primary" />
                          </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Ingredients */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-1.5">
                              <ListChecks className="w-5 h-5 text-primary" />
                              <h4 className="font-medium text-gray-900">Ingredients</h4>
                            </div>
                            <ul className="space-y-2.5">
                              {recipe.ingredients.map((ingredient, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0 mt-2" />
                                  <span className="text-sm text-gray-600">{ingredient}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Instructions */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-1.5">
                              <ChefHat className="w-5 h-5 text-primary" />
                              <h4 className="font-medium text-gray-900">Instructions</h4>
                            </div>
                            <ol className="space-y-2.5">
                              {recipe.instructions.map((step, i) => (
                                <li key={i} className="flex gap-2 text-sm text-gray-600">
                                  <span className="font-medium text-primary flex-shrink-0">{i + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>

                        {/* Nutritional Info */}
                        <div className="pt-6 border-t">
                          <div className="flex items-center gap-1.5 mb-4">
                            <Dumbbell className="w-5 h-5 text-primary" />
                            <h4 className="font-medium text-gray-900">Nutritional Value (per serving)</h4>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                              <div className="text-sm font-medium text-gray-900">{recipe.nutritionalValue.calories}</div>
                              <div className="text-xs text-gray-500">Calories</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                              <div className="text-sm font-medium text-gray-900">{recipe.nutritionalValue.protein}g</div>
                              <div className="text-xs text-gray-500">Protein</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                              <div className="text-sm font-medium text-gray-900">{recipe.nutritionalValue.carbs}g</div>
                              <div className="text-xs text-gray-500">Carbs</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                              <div className="text-sm font-medium text-gray-900">{recipe.nutritionalValue.fat}g</div>
                              <div className="text-xs text-gray-500">Fat</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                              <div className="text-sm font-medium text-gray-900">{recipe.nutritionalValue.fiber}g</div>
                              <div className="text-xs text-gray-500">Fiber</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : noRecipesError && (
                <NoRecipesFound suggestions={noRecipesError.suggestions} />
              )}
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
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <ChefHat className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{recipe.name}</h4>
                        <p className="text-sm text-gray-500">{recipe.date}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <p className="text-xs text-gray-400">
                            {recipe.ingredients.join(", ")}
                          </p>
                          {recipe.saved && (
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          )}
                        </div>
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