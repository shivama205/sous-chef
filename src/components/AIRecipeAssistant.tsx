import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, Image as ImageIcon, MessageSquare, Loader2 } from "lucide-react";
import { aiService } from "@/services/ai";
import { BaseLayout } from "./layouts/BaseLayout";
import { PageHeader } from "./ui/PageHeader";
import { Recipe } from "@/types/recipe";

export default function AIRecipeAssistant() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<Partial<Recipe>>({});
  const [imagePrompt, setImagePrompt] = useState("");
  const [question, setQuestion] = useState("");

  const handleGenerateRecipe = async () => {
    try {
      setIsLoading(true);
      const generatedRecipe = await aiService.generateRecipe({
        ingredients: recipe.ingredients,
        cuisine: recipe.cuisine,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
      });
      setRecipe(generatedRecipe);
      toast({
        title: "Recipe Generated",
        description: "Your recipe has been generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt) {
      toast({
        title: "Error",
        description: "Please provide a description for the image.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const imageUrl = await aiService.generateImage({
        description: imagePrompt,
        style: "food photography",
      });
      setRecipe((prev) => ({ ...prev, images: [...(prev.images || []), imageUrl] }));
      toast({
        title: "Image Generated",
        description: "Your image has been generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskAI = async () => {
    if (!question) {
      toast({
        title: "Error",
        description: "Please enter a question.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const answer = await aiService.askAI({
        question,
        recipeContext: recipe,
      });
      toast({
        title: "Response Received",
        description: answer,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get an answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          icon={ChefHat}
          title="AI Recipe Assistant"
          description="Generate recipes, create food images, and get cooking advice with AI"
        />

        <div className="mt-8">
          <Tabs defaultValue="recipe" className="space-y-4">
            <TabsList>
              <TabsTrigger value="recipe">
                <ChefHat className="w-4 h-4 mr-2" />
                Generate Recipe
              </TabsTrigger>
              <TabsTrigger value="image">
                <ImageIcon className="w-4 h-4 mr-2" />
                Generate Image
              </TabsTrigger>
              <TabsTrigger value="ask">
                <MessageSquare className="w-4 h-4 mr-2" />
                Ask AI
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recipe">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Recipe</CardTitle>
                  <CardDescription>
                    Let AI help you create a unique recipe based on your preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Ingredients (comma separated)"
                      value={recipe.ingredients?.join(", ") || ""}
                      onChange={(e) =>
                        setRecipe((prev) => ({
                          ...prev,
                          ingredients: e.target.value.split(",").map((i) => i.trim()),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Cuisine (e.g., Italian, Japanese)"
                      value={recipe.cuisine || ""}
                      onChange={(e) =>
                        setRecipe((prev) => ({ ...prev, cuisine: e.target.value }))
                      }
                    />
                  </div>
                  <Button
                    onClick={handleGenerateRecipe}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ChefHat className="w-4 h-4 mr-2" />
                    )}
                    Generate Recipe
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="image">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Image</CardTitle>
                  <CardDescription>
                    Create beautiful food images using AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Describe the food image you want to create..."
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                  />
                  <Button
                    onClick={handleGenerateImage}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ImageIcon className="w-4 h-4 mr-2" />
                    )}
                    Generate Image
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ask">
              <Card>
                <CardHeader>
                  <CardTitle>Ask AI</CardTitle>
                  <CardDescription>
                    Get answers to your cooking questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Ask anything about cooking, recipes, or ingredients..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                  <Button
                    onClick={handleAskAI}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <MessageSquare className="w-4 h-4 mr-2" />
                    )}
                    Ask AI
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </BaseLayout>
  );
} 