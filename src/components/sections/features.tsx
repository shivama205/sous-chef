import * as React from "react"
import { motion } from "framer-motion"
import { FeaturePreview } from "@/components/ui/feature-preview"
import { Utensils, ChefHat, Sparkles, Apple, Search } from "lucide-react"

export function Features() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/30 via-transparent to-transparent -z-10" />
      <div className="absolute inset-0 bg-[url('/assets/pattern.png')] opacity-30 -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
              <Sparkles className="w-4 h-4" />
              Features You'll Love
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold">
              Your AI-Powered Kitchen Assistant
            </h2>
            <p className="text-lg text-muted-foreground">
              From finding the perfect recipe to planning your meals, we've got your cooking journey covered
            </p>
          </motion.div>
        </div>

        {/* Recipe Finder Feature */}
        <FeaturePreview
          title="Find Your Perfect Recipe"
          tagline="Recipe Finder"
          description="Search through our extensive collection of recipes using ingredients you have, dietary preferences, or cuisine type. Our AI understands your taste and suggests recipes you'll love."
          benefits={[
            "Smart search by ingredients or preferences",
            "Filter by cuisine, diet, and cooking time",
            "Detailed instructions and nutritional info",
            "Save and organize your favorite recipes"
          ]}
          icon={Utensils}
          color="burgundy"
          animationUrl="https://app.jitter.video/embed/[YOUR_RECIPE_FINDER_ANIMATION_ID]"
          action={{
            label: "Try Recipe Finder",
            href: "/recipe-finder"
          }}
          className="mb-32"
        />

        {/* Meal Planning Feature */}
        <FeaturePreview
          title="Plan Your Week with AI"
          tagline="Meal Planning"
          description="Take the stress out of weekly meal planning. Our AI helps you create balanced, varied meal plans that fit your schedule and dietary needs."
          benefits={[
            "Personalized weekly meal suggestions",
            "Automatic grocery list generation",
            "Nutritional balance tracking",
            "Flexible and customizable plans"
          ]}
          icon={ChefHat}
          color="taupe"
          animationUrl="https://app.jitter.video/embed/[YOUR_MEAL_PLANNING_ANIMATION_ID]"
          action={{
            label: "Start Planning",
            href: "/meal-plan"
          }}
          imagePosition="left"
          className="mb-32"
        />

        {/* Smart Search Feature */}
        <FeaturePreview
          title="Smart Recipe Search"
          tagline="AI-Powered Search"
          description="Our intelligent search understands your preferences and dietary needs. Find recipes based on ingredients you have, cooking time, or specific nutritional goals."
          benefits={[
            "Natural language recipe search",
            "Search by available ingredients",
            "Filter by cooking time and difficulty",
            "Personalized recipe recommendations"
          ]}
          icon={Search}
          color="burgundy"
          animationUrl="https://app.jitter.video/embed/[YOUR_SMART_SEARCH_ANIMATION_ID]"
          action={{
            label: "Start Searching",
            href: "/recipe-search"
          }}
          className="mb-32"
        />

        {/* Healthy Alternatives Feature */}
        <FeaturePreview
          title="Discover Healthy Alternatives"
          tagline="Healthy Swaps"
          description="Want to make your favorite recipes healthier? Our AI suggests smart ingredient substitutions and cooking methods to match your health goals while maintaining great taste."
          benefits={[
            "Smart ingredient substitutions",
            "Nutritional comparison insights",
            "Dietary restriction alternatives",
            "Healthier cooking methods"
          ]}
          icon={Apple}
          color="taupe"
          animationUrl="https://app.jitter.video/embed/[YOUR_HEALTHY_SWAPS_ANIMATION_ID]"
          action={{
            label: "Find Healthy Swaps",
            href: "/healthy-alternative"
          }}
          imagePosition="left"
        />
      </div>
    </section>
  )
} 