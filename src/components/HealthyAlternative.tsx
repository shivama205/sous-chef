import { useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { trackFeatureUsage } from "@/utils/analytics";
import { generateHealthySuggestions, generateAlternativePrompt, checkDietaryConflicts, getErrorMessage } from "@/utils/healthyAlternatives";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { LoginDialog } from "@/components/LoginDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Apple, Leaf, Heart, Brain, Scale, ChefHat, ArrowRight, PlusCircle, Settings2, Sparkles, HelpCircle, CheckCircle2 } from "lucide-react";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MultiSelect } from "./ui/MultiSelect";

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

const testimonials = [
  {
    name: "Sarah J.",
    role: "Health Coach",
    content: "This tool has transformed how I help my clients make healthier food choices. The alternatives are creative and delicious!"
  },
  {
    name: "Mike R.",
    role: "Fitness Enthusiast",
    content: "I love how it suggests alternatives that align with my macro goals. Perfect for meal prep!"
  },
  {
    name: "Lisa M.",
    role: "Home Cook",
    content: "The cooking tips are fantastic! I've learned so many ways to make my favorite dishes healthier."
  }
];

const DIETARY_RESTRICTIONS = [
  // Common Allergies & Intolerances
  { label: 'Gluten-Free', value: 'gluten-free' },
  { label: 'Dairy-Free', value: 'dairy-free' },
  { label: 'Nut-Free', value: 'nut-free' },
  { label: 'Egg-Free', value: 'egg-free' },
  { label: 'Soy-Free', value: 'soy-free' },
  { label: 'Shellfish-Free', value: 'shellfish-free' },
  
  // Dietary Preferences
  { label: 'Vegan', value: 'vegan' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Pescatarian', value: 'pescatarian' },
  { label: 'Halal', value: 'halal' },
  { label: 'Kosher', value: 'kosher' },
  
  // Health-Focused
  { label: 'Low-Carb', value: 'low-carb' },
  { label: 'Low-Fat', value: 'low-fat' },
  { label: 'Low-Sodium', value: 'low-sodium' },
  { label: 'Low-Sugar', value: 'low-sugar' },
  { label: 'High-Protein', value: 'high-protein' },
  { label: 'Keto', value: 'keto' },
  { label: 'Paleo', value: 'paleo' },
  { label: 'Mediterranean', value: 'mediterranean' },
  { label: 'FODMAP-Free', value: 'fodmap-free' }
];

const HEALTH_GOALS = [
  { label: 'Weight Loss', value: 'weight-loss' },
  { label: 'Muscle Gain', value: 'muscle-gain' },
  { label: 'Heart Health', value: 'heart-health' },
  { label: 'Blood Sugar Control', value: 'blood-sugar-control' },
  { label: 'Anti-Inflammatory', value: 'anti-inflammatory' },
  { label: 'Energy Boost', value: 'energy-boost' }
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

const howItWorks = [
  {
    step: 1,
    title: "Enter Your Meal",
    description: "Tell us what meal you'd like to make healthier",
    icon: PlusCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    step: 2,
    title: "Set Preferences",
    description: "Choose your dietary restrictions and health goals",
    icon: Settings2,
    color: "text-purple-500",
    bgColor: "bg-purple-50"
  },
  {
    step: 3,
    title: "Get Alternatives",
    description: "Receive personalized healthy alternatives and cooking tips",
    icon: Sparkles,
    color: "text-green-500",
    bgColor: "bg-green-50"
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

export function HealthyAlternative() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [mealName, setMealName] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

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

    const conflicts = checkDietaryConflicts(dietaryRestrictions);
    if (conflicts) {
      toast({
        title: "Conflicting Restrictions",
        description: conflicts,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const prompt = generateAlternativePrompt({
        mealName,
        dietaryRestrictions,
        healthGoals,
        additionalInstructions
      });

      const response = await fetch('/api/alternatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const success = data.alternatives?.length > 0;

      await trackFeatureUsage('healthy_alternative', {
        mealName,
        dietaryRestrictions,
        healthGoals,
        additionalInstructions,
        success,
        suggestions: !success ? generateHealthySuggestions({
          mealName,
          dietaryRestrictions,
          healthGoals,
          additionalInstructions
        }) : undefined
      });

      if (success) {
        setAlternatives(data.alternatives);
        setSuggestions([]);
        toast({
          title: "Success",
          description: "Found healthy alternatives for your meal!",
        });
      } else {
        setAlternatives([]);
        setSuggestions(generateHealthySuggestions({
          mealName,
          dietaryRestrictions,
          healthGoals,
          additionalInstructions
        }));
      }
    } catch (error) {
      console.error('Error finding alternatives:', error);
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const LoggedInView = () => (
    <div className="space-y-8">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="mealName">Meal Name</Label>
            <Input
              id="mealName"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="Enter the meal you want alternatives for"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Dietary Restrictions</Label>
            <MultiSelect
              options={DIETARY_RESTRICTIONS}
              value={dietaryRestrictions}
              onChange={setDietaryRestrictions}
              placeholder="Select any dietary restrictions"
            />
          </div>

          <div className="space-y-2">
            <Label>Health Goals</Label>
            <MultiSelect
              options={HEALTH_GOALS}
              value={healthGoals}
              onChange={setHealthGoals}
              placeholder="Select your health goals"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Additional Instructions</Label>
            <Textarea
              id="instructions"
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder="Any specific requirements or preferences?"
              className="h-24"
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 mt-2">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            Find Alternatives
          </Button>
        </form>
      </Card>

      {suggestions.length > 0 && <NoAlternativesFound suggestions={suggestions} />}

      {alternatives.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Healthy Alternatives</h3>
          <ul className="space-y-4">
            {alternatives.map((alt, index) => (
              <li key={index} className="flex items-start gap-2">
                <Leaf className="w-5 h-5 text-primary mt-1" />
                <span>{alt}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );

  const LoggedOutView = () => (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Find Healthy Alternatives
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transform your favorite meals into healthier versions while maintaining the flavors you love.
          Join now to unlock personalized recommendations!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => setLoginDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            Get Started Free
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => setLoginDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            View Demo
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              className="h-full"
            />
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {howItWorks.map((item, index) => (
            <Fragment key={item.step}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className={cn(
                  "bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6 hover:shadow-md transition-shadow",
                  "group cursor-pointer"
                )}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={cn(
                        "h-16 w-16 rounded-full flex items-center justify-center",
                        item.bgColor
                      )}
                    >
                      <item.icon className={cn("h-8 w-8", item.color)} />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </Card>
                {index < howItWorks.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 + 0.1 }}
                    viewport={{ once: true }}
                    className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2"
                  >
                    <ArrowRight className="w-8 h-8 text-gray-400" />
                  </motion.div>
                )}
              </motion.div>
            </Fragment>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <p className="text-gray-600">Everything you need to know about finding healthy alternatives</p>
        </div>
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
          <Accordion type="single" collapsible className="p-6">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-start gap-2 pl-7">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{faq.answer}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>

      {/* Testimonials */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm p-6">
              <blockquote className="space-y-2">
                <p className="text-gray-600">{testimonial.content}</p>
                <footer className="text-sm">
                  <cite className="font-semibold not-italic">{testimonial.name}</cite>
                  <span className="text-gray-500"> — {testimonial.role}</span>
                </footer>
              </blockquote>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-6 bg-primary/5 rounded-2xl p-8">
        <h2 className="text-2xl font-bold">Ready to Transform Your Meals?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join thousands of users who have discovered healthier ways to enjoy their favorite foods.
          Sign up now and get 100 free credits to start your journey!
        </p>
        <Button 
          size="lg" 
          onClick={() => setLoginDialogOpen(true)}
          className="w-full sm:w-auto"
        >
          Start Your Free Trial
        </Button>
      </div>
    </div>
  );

  return (
    <BaseLayout>
      <div className="container mx-auto py-8">
        <PageHeader
          icon={Apple}
          title={user ? "Healthy Alternatives" : "Transform Your Meals"}
          description={user ? "Find healthier versions of your favorite meals" : "Discover nutritious alternatives without compromising on taste"}
          className="mb-8"
        />
        {user ? <LoggedInView /> : <LoggedOutView />}
      </div>
      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
      <LoadingOverlay isLoading={isLoading} />
    </BaseLayout>
  );
} 