import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { LoginDialog } from "@/components/LoginDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { useUser } from "@/hooks/useUser";
import { Sparkles, Carrot, Brain, Heart } from "lucide-react";
import { trackFeatureUsage } from "@/utils/analytics";

interface Alternative {
  original: string;
  substitute: string;
  benefits: string[];
  nutritionalComparison: {
    calories: string;
    protein: string;
    healthBenefits: string[];
  };
}

const features = [
  {
    icon: Brain,
    title: "Smart Substitutions",
    description: "Get AI-powered healthy alternatives for any ingredient"
  },
  {
    icon: Heart,
    title: "Health-Focused",
    description: "Understand the nutritional benefits of each substitution"
  },
  {
    icon: Carrot,
    title: "Practical Options",
    description: "Receive alternatives that are easy to find and use"
  }
];

export default function HealthyAlternative() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [ingredients, setIngredients] = useState("");
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

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
      await trackFeatureUsage("healthy_alternative_used");
      
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Find healthy alternatives for these ingredients: ${ingredients}. 
        For each ingredient, provide:
        1. A healthier substitute
        2. The health benefits of the substitute
        3. A nutritional comparison
        Format the response as JSON with this structure:
        {
          "alternatives": [{
            "original": "ingredient",
            "substitute": "healthy alternative",
            "benefits": ["benefit1", "benefit2"],
            "nutritionalComparison": {
              "calories": "comparison",
              "protein": "comparison",
              "healthBenefits": ["benefit1", "benefit2"]
            }
          }]
        }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/```json([\s\S]*?)```/) || [null, text];
      const jsonString = jsonMatch[1]?.trim() || text.trim();
      
      const data = JSON.parse(jsonString);
      setAlternatives(data.alternatives);

      toast({
        title: "Success",
        description: "Found healthy alternatives for your ingredients!",
      });
    } catch (error) {
      console.error("Error finding alternatives:", error);
      toast({
        title: "Error",
        description: "Failed to find alternatives. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8 space-y-12">
        <PageHeader
          icon={Sparkles}
          title="Healthy Alternatives"
          description="Discover healthier substitutes for your favorite ingredients"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ingredients">Your Ingredients *</Label>
                  <Textarea
                    id="ingredients"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="Enter ingredients separated by commas (e.g., white bread, butter, sugar)"
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading || !ingredients.trim()}
                >
                  {isLoading ? "Finding Alternatives..." : "Find Healthy Alternatives"}
                </Button>
              </form>
            </Card>

            {/* Results Section */}
            {alternatives.length > 0 && (
              <div className="mt-8 space-y-6">
                {alternatives.map((alt, index) => (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {alt.original} → {alt.substitute}
                        </h3>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Benefits</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {alt.benefits.map((benefit, i) => (
                            <li key={i} className="text-muted-foreground">{benefit}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Nutritional Comparison</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Calories</p>
                            <p>{alt.nutritionalComparison.calories}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Protein</p>
                            <p>{alt.nutritionalComparison.protein}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h5 className="text-sm font-medium mb-1">Additional Health Benefits</h5>
                          <ul className="list-disc pl-5 space-y-1">
                            {alt.nutritionalComparison.healthBenefits.map((benefit, i) => (
                              <li key={i} className="text-sm text-muted-foreground">{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Tips for Healthy Substitutions</h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  Consider your dietary goals when choosing alternatives
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  Start with small substitutions and gradually increase
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  Pay attention to portion sizes even with healthier options
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      <LoginDialog 
        open={loginDialogOpen} 
        onOpenChange={setLoginDialogOpen} 
      />
    </BaseLayout>
  );
}
