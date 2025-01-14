import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import NavigationBar from "@/components/NavigationBar";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "$9",
    description: "Perfect for getting started",
    features: [
      "5 meal plans per month",
      "10 healthy swaps per month",
      "Basic recipe suggestions",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    description: "Most popular for health enthusiasts",
    features: [
      "20 meal plans per month",
      "Unlimited healthy swaps",
      "Detailed nutritional information",
      "Priority email support",
      "Save favorite meal plans",
      "Custom dietary preferences",
    ],
  },
  {
    name: "Enterprise",
    price: "$49",
    description: "For professional nutritionists",
    features: [
      "Unlimited meal plans",
      "Unlimited healthy swaps",
      "Advanced nutritional analytics",
      "Priority 24/7 support",
      "Team collaboration",
      "Custom API access",
      "White-label options",
    ],
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600">
            Select the perfect plan for your healthy eating journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="rounded-lg bg-white/80 backdrop-blur-sm shadow-lg p-8 h-full flex flex-col justify-between border border-gray-200">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full" variant={index === 1 ? "default" : "secondary"}>
                  Get Started
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Pricing;