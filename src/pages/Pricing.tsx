import { useState } from "react";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Gift, Timer, Sparkles, ChefHat, Zap, Rocket } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface PricingPlan {
  id: string;
  slug: string;
  name: string;
  description: string;
  features: string[];
  is_popular: boolean;
  sort_order: number;
  icon: JSX.Element;
}

const plans: PricingPlan[] = [
  {
    id: "1",
    slug: "basic",
    name: "Basic",
    description: "Perfect for trying out MySideChef",
    features: [
      "10 meal plans per month",
      "5 recipe finder uses",
      "5 healthy alternatives",
      "Basic nutritional tracking",
      "Email support"
    ],
    is_popular: false,
    sort_order: 1,
    icon: <ChefHat className="w-6 h-6" />
  },
  {
    id: "2",
    slug: "pro",
    name: "Pro",
    description: "Best for health enthusiasts",
    features: [
      "30 meal plans per month",
      "20 recipe finder uses",
      "20 healthy alternatives",
      "Advanced macro tracking",
      "Priority support",
      "Save & share meal plans",
      "Custom meal preferences"
    ],
    is_popular: true,
    sort_order: 2,
    icon: <Zap className="w-6 h-6" />
  },
  {
    id: "3",
    slug: "ultimate",
    name: "Ultimate",
    description: "For professionals and families",
    features: [
      "Unlimited meal plans",
      "Unlimited recipe finder",
      "Unlimited alternatives",
      "Advanced macro tracking",
      "24/7 priority support",
      "Save & share meal plans",
      "Custom meal preferences",
      "API access",
      "Team collaboration"
    ],
    is_popular: false,
    sort_order: 3,
    icon: <Rocket className="w-6 h-6" />
  }
];

export function Pricing() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGetStarted = async (plan: PricingPlan) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Not Logged In",
          description: "Please log in to start using these features.",
          variant: "destructive"
        });
        return;
      }

      navigate('/meal-plan');
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseLayout>
      <SEO 
        title="All Premium Features Free - Limited Time"
        description="For a limited time, enjoy all premium features of MySideChef completely free! No credit card required, no hidden fees. Start planning your meals today."
        keywords="free meal planning, free recipes, free meal suggestions, premium features free, no cost meal planner"
        type="website"
        canonical="https://mysidechef.com/pricing"
      />
      
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-primary/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        </div>
        
        <div className="container relative mx-auto px-4 py-16 sm:py-24 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
              <Gift className="w-4 h-4" />
              Limited Time Offer
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Premium Features
              </span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl">
                Now Free for Everyone
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the full power of MySideChef with all premium features unlocked. 
              No credit card required, no hidden fees.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 space-y-24">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: plan.sort_order * 0.1 }}
              className="relative"
            >
              <Card className={`
                relative overflow-hidden h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg
                transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                ${plan.is_popular ? "ring-2 ring-primary" : ""}
              `}>
                {/* Card Header */}
                <div className={`
                  p-6 pb-8
                  ${plan.is_popular ? 'bg-gradient-to-br from-primary to-secondary text-white' : 'bg-gradient-to-br from-primary/5 to-secondary/5'}
                `}>
                  {plan.is_popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-white text-primary text-sm font-medium px-3 py-1 rounded-full shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`
                      p-3 rounded-xl
                      ${plan.is_popular ? 'bg-white/10' : 'bg-primary/10'}
                    `}>
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${!plan.is_popular && 'text-primary'}`}>{plan.name}</h3>
                      <p className={`${plan.is_popular ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${plan.is_popular ? 'text-white' : 'text-primary'}`}>
                      Free
                    </span>
                    <span className={plan.is_popular ? 'text-white/80' : 'text-muted-foreground'}>
                      / forever
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 pt-8 space-y-6">
                  <div className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0 p-1 rounded-full bg-primary/10">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleGetStarted(plan)}
                    className={`w-full ${
                      plan.is_popular 
                        ? 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white' 
                        : 'bg-primary/10 hover:bg-primary/20 text-primary'
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Get Started Free'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Why Choose MySideChef?</h2>
              <p className="text-lg text-muted-foreground">
                We're making premium meal planning accessible to everyone. Here's what you get:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-transparent border-0">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">AI-Powered Features</h3>
                <p className="text-sm text-muted-foreground">
                  Smart meal planning and recipe suggestions tailored to your preferences
                </p>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-transparent border-0">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Premium Access</h3>
                <p className="text-sm text-muted-foreground">
                  All features unlocked - no restrictions, no hidden costs
                </p>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-transparent border-0">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                  <Timer className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Limited Time</h3>
                <p className="text-sm text-muted-foreground">
                  Sign up now to lock in free access forever
                </p>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-center">Common Questions</h2>
            <div className="grid gap-6">
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-0">
                <h3 className="text-lg font-semibold mb-2">Is it really free?</h3>
                <p className="text-muted-foreground">
                  Yes! We're offering all premium features completely free. No credit card required, no hidden fees.
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-0">
                <h3 className="text-lg font-semibold mb-2">What happens after the free period?</h3>
                <p className="text-muted-foreground">
                  If you sign up during this period, you'll keep access to all features for free, forever.
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-0">
                <h3 className="text-lg font-semibold mb-2">Are there any limitations?</h3>
                <p className="text-muted-foreground">
                  None at all! You get full access to all premium features, just like our paid plans.
                </p>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          <Card className="max-w-4xl mx-auto p-8 md:p-12 bg-gradient-to-r from-primary to-secondary text-white border-0">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Meal Planning?</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of happy users who are already enjoying premium features for free.
              Start your journey to better meal planning today!
            </p>
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/')}
            >
              Get Started Now - It's Free!
            </Button>
          </Card>
        </motion.div>
      </div>
    </BaseLayout>
  );
}
