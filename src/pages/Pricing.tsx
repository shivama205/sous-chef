import { useState } from "react";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface PricingPlan {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  credits_per_month: number;
  is_popular: boolean;
  sort_order: number;
}

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const plans: PricingPlan[] = [
    {
      id: "1",
      slug: "basic",
      name: "Basic",
      description: "Perfect for getting started with meal planning",
      price_monthly: 9.99,
      price_yearly: 99.99,
      features: [
        "5 meal plans per month",
        "Basic nutrition tracking",
        "Email support",
        "Access to recipe database"
      ],
      credits_per_month: 5,
      is_popular: false,
      sort_order: 1
    },
    {
      id: "2",
      slug: "pro",
      name: "Pro",
      description: "Best for active meal planners",
      price_monthly: 19.99,
      price_yearly: 199.99,
      features: [
        "15 meal plans per month",
        "Advanced nutrition tracking",
        "Priority support",
        "Custom recipe suggestions",
        "Shopping list generation",
        "Meal prep guides"
      ],
      credits_per_month: 15,
      is_popular: true,
      sort_order: 2
    },
    {
      id: "3",
      slug: "unlimited",
      name: "Unlimited",
      description: "For nutrition professionals",
      price_monthly: 39.99,
      price_yearly: 399.99,
      features: [
        "Unlimited meal plans",
        "Professional nutrition tools",
        "24/7 priority support",
        "API access",
        "White-label options",
        "Team collaboration",
        "Custom branding"
      ],
      credits_per_month: 999999,
      is_popular: false,
      sort_order: 3
    }
  ];

  const handleSubscribe = async (plan: PricingPlan) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Not Logged In",
          description: "Please log in to subscribe to a plan.",
          variant: "destructive"
        });
        return;
      }

      // Here you would typically redirect to a payment processor
      toast({
        title: "Coming Soon",
        description: "Subscription functionality will be available soon!",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-2xl font-medium text-foreground/90 mb-2">Simple, Transparent Pricing</h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Choose the perfect plan for your meal planning needs. All plans include access to our AI-powered meal planner.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <span className={`text-sm ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            Yearly <span className="text-xs text-primary">(Save 20%)</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden p-6 bg-white/80 backdrop-blur-sm border-0 shadow-sm ${
                plan.is_popular ? 'ring-2 ring-primary' : ''
              }`}
            >
              {plan.is_popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    ${isYearly ? plan.price_yearly : plan.price_monthly}
                  </span>
                  <span className="text-muted-foreground">
                    /{isYearly ? 'year' : 'month'}
                  </span>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => handleSubscribe(plan)}
                  disabled={isLoading}
                >
                  Get Started
                </Button>

                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-lg font-semibold mb-2">Have questions?</h2>
          <p className="text-sm text-muted-foreground">
            Contact our support team at support@example.com
          </p>
        </div>
      </div>
    </BaseLayout>
  );
}