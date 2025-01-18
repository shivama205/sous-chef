import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { trackFeatureUsage } from "@/utils/analytics";
import { generateHealthySuggestions, generateAlternativePrompt, getErrorMessage } from "@/utils/healthyAlternatives";
import { MealPlanLoadingOverlay } from "@/components/MealPlanLoadingOverlay";
import { LoginDialog } from "@/components/LoginDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Apple, Leaf, Heart, Brain, Scale, ChefHat, HelpCircle, History, Star } from "lucide-react";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

const faqs = [
  {
    question: "How does the healthy alternative finder work?",
    answer: "Our AI analyzes your meal and preferences to suggest healthier versions while maintaining flavor. It considers your dietary restrictions, health goals, and nutritional requirements to provide personalized alternatives."
  },
  {
    question: "What types of meals can I find alternatives for?",
    answer: "You can find alternatives for any type of meal - from breakfast to dinner, snacks to desserts. Our system is trained on a wide variety of cuisines and cooking styles."
  },
  {
    question: "Can I specify multiple dietary restrictions?",
    answer: "Yes! You can combine multiple dietary restrictions (e.g., gluten-free and dairy-free) and our system will find alternatives that meet all your requirements."
  },
  {
    question: "How accurate are the nutritional suggestions?",
    answer: "Our suggestions are based on established nutritional guidelines and are reviewed for accuracy. However, for precise nutritional needs, always consult with a healthcare professional."
  },
  {
    question: "What if I can't find alternatives for my meal?",
    answer: "If no direct alternatives are found, we provide helpful suggestions to modify your meal, including cooking methods, ingredient substitutions, and portion control tips."
  },
  {
    question: "How many credits do I need per search?",
    answer: "Each alternative search uses 1 credit. New users get 100 free credits to start. You can earn more credits through referrals or upgrade to our premium plan for unlimited searches."
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
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
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

    if (!user) {
      setLoginDialogOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      await trackFeatureUsage("healthy_alternative", {
        mealName,
        success: false,
        alternativesFound: 0,
        dietaryRestrictions: dietaryRestrictions,
        error: undefined
      });

      const prompt = generateAlternativePrompt({
        mealName,
        dietaryRestrictions: dietaryRestrictions,
        additionalInstructions
      });

      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/```json([\s\S]*?)```/) || [null, text];
      const jsonString = jsonMatch[1]?.trim() || text.trim();
      
      let data;
      try {
        data = JSON.parse(jsonString);
      } catch (e) {
        throw new Error('Failed to parse response from AI');
      }

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      const alternatives = Array.isArray(data.alternatives) ? data.alternatives : [];
      const success = alternatives.length > 0;

      if (success) {
        setAlternatives(alternatives);
        setSuggestions([]);
        
        await trackFeatureUsage('healthy_alternative', {
          mealName,
          success: true,
          alternativesFound: alternatives.length,
          alternatives: alternatives.map(alt => ({
            original: mealName,
            substitute: alt.substitute
          })),
          dietaryRestrictions: dietaryRestrictions,
          error: undefined
        });

        toast({
          title: "Success",
          description: `Found ${alternatives.length} healthy alternatives for your meal!`,
        });
      } else {
        setAlternatives([]);
        const suggestions = generateHealthySuggestions({
          mealName,
          dietaryRestrictions,
          additionalInstructions
        });
        setSuggestions(suggestions);
        
        toast({
          title: "No Alternatives Found",
          description: "We couldn't find direct alternatives, but here are some suggestions to make your meal healthier.",
        });
      }
    } catch (error) {
      console.error('Error finding alternatives:', error);
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      setAlternatives([]);
      setSuggestions([]);
      
      await trackFeatureUsage('healthy_alternative', {
        mealName,
        success: false,
        alternativesFound: 0,
        dietaryRestrictions: dietaryRestrictions,
        error: errorMessage
      });

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
      {user ? (
        <div className="container mx-auto px-4 py-8 space-y-12">
          <PageHeader
            icon={Apple}
            title="Healthy Alternatives"
            description="Transform your favorite meals into healthier versions"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form and Results Column */}
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Find Healthy Alternatives</h2>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mealName">Meal Name *</Label>
                      <Input
                        id="mealName"
                        value={mealName}
                        onChange={(e) => setMealName(e.target.value)}
                        placeholder="Enter the meal you want alternatives for"
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="restrictions">Dietary Restrictions</Label>
                      <Input
                        id="restrictions"
                        value={dietaryRestrictions}
                        onChange={(e) => setDietaryRestrictions(e.target.value)}
                        placeholder="E.g., gluten-free, dairy-free (comma separated)"
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructions">Additional Instructions</Label>
                      <Textarea
                        id="instructions"
                        value={additionalInstructions}
                        onChange={(e) => setAdditionalInstructions(e.target.value)}
                        placeholder="Any specific requirements or preferences?"
                        className="min-h-[100px] w-full"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading || !mealName.trim()}
                    >
                      {isLoading ? "Finding Alternatives..." : "Find Alternatives"}
                    </Button>
                  </div>
                </form>
              </Card>

              {/* Results Section */}
              {alternatives.length > 0 && (
                <div ref={resultsRef} className="space-y-4 sm:space-y-6 mt-6">
                  <h2 className="text-xl font-semibold">Found Alternatives</h2>
                  {alternatives.map((alt, index) => (
                    <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm overflow-hidden">
                      <div className="p-4 sm:p-6 space-y-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                          <div className="space-y-1 sm:space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                {alt.original}
                              </h3>
                              <div className="hidden sm:block w-8 text-center">→</div>
                              <h3 className="text-lg sm:text-xl font-semibold text-primary">
                                {alt.substitute}
                              </h3>
                            </div>
                          </div>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Benefits */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Heart className="w-5 h-5 text-primary" />
                              <h4 className="font-medium text-gray-900">Benefits</h4>
                            </div>
                            <ul className="space-y-3">
                              {alt.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start gap-3">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0 mt-2" />
                                  <span className="text-sm text-gray-600">{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Nutritional Comparison */}
                          <div className="space-y-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6">
                            <div className="flex items-center gap-2">
                              <Scale className="w-5 h-5 text-primary" />
                              <h4 className="font-medium text-gray-900">Nutritional Comparison</h4>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Calories</p>
                                  <p className="text-sm text-gray-600">{alt.nutritionalComparison.calories}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Protein</p>
                                  <p className="text-sm text-gray-600">{alt.nutritionalComparison.protein}</p>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <h5 className="text-sm font-medium mb-3">Additional Health Benefits</h5>
                              <ul className="space-y-3">
                                {alt.nutritionalComparison.healthBenefits.map((benefit, i) => (
                                  <li key={i} className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0 mt-2" />
                                    <span className="text-sm text-gray-600">{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {suggestions.length > 0 && <NoAlternativesFound suggestions={suggestions} />}

              {/* Features Section */}
              <div className="mt-8">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 lg:space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Alternatives</h3>
                  <History className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {recentAlternatives.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Leaf className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.originalMeal}</h4>
                        <p className="text-sm text-gray-500">{item.date}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <p className="text-xs text-gray-400">
                            {item.alternativeCount} alternatives found
                          </p>
                          {item.saved && (
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Common Questions</h3>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </div>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs.slice(0, 3).map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-sm hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12 text-center space-y-6">
          <div className="max-w-2xl mx-auto">
            <Apple className="w-16 h-16 mx-auto text-primary mb-6" />
            <h1 className="text-4xl font-bold mb-4">Make Your Meals Healthier</h1>
            <p className="text-lg text-gray-600 mb-8">
              Transform your favorite recipes into healthier versions without sacrificing taste. 
              Sign in to access our AI-powered alternative finder.
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

      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
      <MealPlanLoadingOverlay isLoading={isLoading} />
    </BaseLayout>
  );
}

// Add this constant for recent alternatives
const recentAlternatives = [
  {
    originalMeal: "Chocolate Cake",
    date: "2 days ago",
    alternativeCount: 3,
    saved: true
  },
  {
    originalMeal: "Mac and Cheese",
    date: "1 week ago",
    alternativeCount: 2,
    saved: false
  },
  {
    originalMeal: "Pizza",
    date: "2 weeks ago",
    alternativeCount: 4,
    saved: true
  }
]; 