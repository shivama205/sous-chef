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
    <div className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/assets/download.jpeg"
          alt="Monstera leaf background"
          className="w-full h-full object-contain opacity-5 scale-75"
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="relative py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-4">
                AI-Powered Kitchen Assistant
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight sm:text-6xl mb-6"
            >
              Your Personal{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Chef Assistant
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Get instant, personalized meal ideas based on your energy level and cravings.
              Plan meals, find recipes, and discover healthy alternatives with your AI kitchen assistant.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/meal-suggestions" className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 