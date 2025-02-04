import * as React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Apple, Users, Trophy, Heart, ArrowRight } from "lucide-react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

interface MoodOption {
  emoji: string
  title: string
  description: string
}

const moodOptions: MoodOption[] = [
  {
    emoji: "😴",
    title: "Tired after work",
    description: "Quick & easy dinner ideas"
  },
  {
    emoji: "💪",
    title: "Energetic & motivated",
    description: "Try something new today"
  },
  {
    emoji: "🤔",
    title: "Need inspiration",
    description: "Discover trending recipes"
  }
]

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/hero-bg.jpg"
          alt="Delicious Food Background"
          className="w-full h-full object-cover"
        />
        {/* Lighter overlay for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="text-white space-y-8"
          >
            <motion.span
              variants={item}
              className="inline-block px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-sm"
            >
              AI-Powered Kitchen Assistant
            </motion.span>
            
            <motion.h1
              variants={item}
              className="text-5xl lg:text-7xl font-bold leading-tight text-white"
            >
              Your Mood, <br />
              Your Perfect Meal
            </motion.h1>
            
            <motion.p
              variants={item}
              className="text-xl text-white/90"
            >
              Get instant meal ideas based on how you feel. From quick recipes to healthy swaps, 
              let AI be your personal sous chef.
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button asChild size="lg" variant="default">
                <Link to="/meal-suggestions" className="gap-2">
                  <Brain className="w-5 h-5" />
                  Get Meal Ideas
                </Link>
              </Button>
              <Button asChild size="lg" variant="glass">
                <Link to="/healthy-alternative" className="gap-2">
                  <Apple className="w-5 h-5" />
                  Discover Healthy Swaps
                </Link>
              </Button>
            </motion.div>

            <motion.div
              variants={item}
              className="flex items-center gap-8 text-sm text-white/90"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>10k+ Happy Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>50k+ Recipes</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>100% Free</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.5
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-accent/5 to-white/10 rounded-3xl blur-3xl" />
            <Link to="/meal-suggestions">
              <Card
                variant="glass"
                className="relative p-6 group backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white">
                    <h3 className="text-lg font-semibold group-hover:text-white transition-colors">How are you feeling?</h3>
                    <p className="text-sm text-white/80">Let's find your perfect meal</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/80 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>

                <div className="space-y-3">
                  {moodOptions.map((option, index) => (
                    <motion.div
                      key={option.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="bg-white/10 rounded-xl p-4 border border-white/10 hover:bg-white/20 hover:border-white/30 transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{option.emoji}</span>
                        <div className="text-white">
                          <p className="font-medium group-hover:text-white">{option.title}</p>
                          <p className="text-sm text-white/80">{option.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 