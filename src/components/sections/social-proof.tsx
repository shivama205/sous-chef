import * as React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Brain, ChefHat, Clock, Heart, Sparkles, Utensils } from "lucide-react"

const valueProps = [
  {
    icon: Brain,
    title: "Smart Meal Planning",
    description: "Our AI analyzes your nutritional needs and preferences to create perfectly balanced meal plans. No more guesswork in planning healthy meals."
  },
  {
    icon: Clock,
    title: "Save Time & Effort",
    description: "Get instant meal suggestions and alternatives based on what you have. Turn your available ingredients into healthy, delicious meals."
  },
  {
    icon: Heart,
    title: "Health Made Simple",
    description: "We break down complex nutritional goals into simple, actionable meal plans. Making healthy choices has never been easier."
  },
  {
    icon: Utensils,
    title: "Personalized Experience",
    description: "Your dietary preferences, restrictions, and health goals are used to tailor every recipe and meal plan recommendation."
  },
  {
    icon: ChefHat,
    title: "Healthy Cooking Made Easy",
    description: "Discover healthier versions of your favorite meals with our smart recipe alternatives and cooking suggestions."
  },
  {
    icon: Sparkles,
    title: "Continuous Improvement",
    description: "Our AI learns from your preferences and feedback to provide increasingly personalized and effective meal recommendations."
  }
]

export function SocialProof() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-primary/5">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Making Healthy Eating{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Simple & Enjoyable
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See how MySideChef helps you achieve your health goals without the complexity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {valueProps.map((prop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 bg-white border hover:shadow-md transition-shadow h-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <prop.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{prop.title}</h3>
                    <p className="text-muted-foreground">{prop.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 