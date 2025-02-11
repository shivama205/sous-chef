import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Utensils, Sparkles, Apple, Search, ArrowRight, Check, Calendar } from "lucide-react"
import { Link } from "react-router-dom"

const features = [
  {
    title: "Find Your Perfect Recipe",
    tagline: "Recipe Finder",
    description: "Search through our extensive collection of recipes using ingredients you have, dietary preferences, or cuisine type. Our AI understands your taste and suggests recipes you'll love.",
    benefits: [
      "Smart search by ingredients or preferences",
      "Filter by cuisine, diet, and cooking time",
      "Detailed instructions and nutritional info",
      "Save and organize your favorite recipes"
    ],
    icon: Utensils,
    color: "burgundy",
    action: {
      label: "Try Recipe Finder",
      href: "/recipe-finder"
    }
  },
  {
    title: "Plan Your Week with AI",
    tagline: "Meal Planning",
    description: "Take the stress out of weekly meal planning. Our AI helps you create balanced, varied meal plans that fit your schedule and dietary needs.",
    benefits: [
      "Personalized weekly meal suggestions",
      "Automatic grocery list generation",
      "Nutritional balance tracking",
      "Flexible and customizable plans"
    ],
    icon: Calendar,
    color: "taupe",
    action: {
      label: "Start Planning",
      href: "/meal-plan"
    }
  },
  {
    title: "Get Instant Meal Ideas",
    tagline: "Smart Suggestions",
    description: "Stuck on what to cook? Our AI suggests personalized meal options based on your mood, energy level, and available time. Perfect for those 'What should I eat?' moments.",
    benefits: [
      "Instant personalized suggestions",
      "Options for different energy levels",
      "Cook, order-in, or eat-out recommendations",
      "Nutritional information included"
    ],
    icon: Search,
    color: "burgundy",
    action: {
      label: "Get Suggestions",
      href: "/meal-suggestions"
    }
  },
  {
    title: "Discover Healthy Alternatives",
    tagline: "Healthy Swaps",
    description: "Want to make your favorite recipes healthier? Our AI suggests smart ingredient substitutions and cooking methods to match your health goals while maintaining great taste.",
    benefits: [
      "Smart ingredient substitutions",
      "Nutritional comparison insights",
      "Dietary restriction alternatives",
      "Healthier cooking methods"
    ],
    icon: Apple,
    color: "taupe",
    action: {
      label: "Find Healthy Swaps",
      href: "/healthy-alternative"
    }
  }
]

const colorVariants = {
  burgundy: {
    tag: "bg-primary/10 text-primary",
    icon: "bg-primary/10 text-primary",
    check: "bg-primary/10 text-primary",
    button: "bg-primary hover:bg-primary/90",
    card: "hover:border-primary/20",
  },
  taupe: {
    tag: "bg-secondary/10 text-secondary",
    icon: "bg-secondary/10 text-secondary",
    check: "bg-secondary/10 text-secondary",
    button: "bg-secondary hover:bg-secondary/90",
    card: "hover:border-secondary/20",
  }
}

export function Features() {
  return (
    <section className="relative py-12">
      {/* Layered background with subtle patterns and gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50 to-transparent" />
      <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[url('/assets/pattern.png')] opacity-[0.03]" />
      
      <div className="container relative mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const colors = colorVariants[feature.color as keyof typeof colorVariants];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="h-full"
              >
                <Card className={`h-full p-8 bg-white/95 backdrop-blur-sm hover:shadow-lg hover:bg-white transition-all duration-300 ${colors.card}`}>
                  <div className="flex flex-col h-full">
                    {/* Content wrapper */}
                    <div className="flex-1 space-y-6">
                      {/* Header */}
                      <div className="space-y-4">
                        <div className={`inline-block px-4 py-2 rounded-full text-sm ${colors.tag}`}>
                          <div className="flex items-center gap-2">
                            <feature.icon className="w-4 h-4" />
                            {feature.tagline}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>

                      {/* Benefits */}
                      <ul className="space-y-3">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <motion.li
                            key={benefitIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: benefitIndex * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3"
                          >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${colors.check}`}>
                              <Check className="w-3 h-3" />
                            </div>
                            <span className="text-sm">{benefit}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Action - Now outside the flex-1 div to stick to bottom */}
                    <div className="pt-6">
                      <Button asChild className={`w-full ${colors.button}`}>
                        <Link to={feature.action.href} className="flex items-center justify-center gap-2">
                          {feature.action.label}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  )
} 