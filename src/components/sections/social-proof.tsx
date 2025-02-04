import * as React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Star, Quote, Users, Trophy, Heart, ChefHat } from "lucide-react"

const testimonials = [
  {
    content: "MySideChef has completely transformed how I plan my meals. The AI suggestions are spot-on!",
    author: "Sarah M.",
    role: "Busy Parent",
    rating: 5
  },
  {
    content: "As a fitness enthusiast, I love how it helps me maintain my nutrition goals while discovering new recipes.",
    author: "Michael R.",
    role: "Fitness Coach",
    rating: 5
  },
  {
    content: "The recipe recommendations are amazing. It's like having a personal chef who knows my taste perfectly.",
    author: "Emily L.",
    role: "Food Enthusiast",
    rating: 5
  }
]

const stats = [
  {
    icon: Users,
    label: "Happy Users",
    value: "10k+",
    description: "Growing community"
  },
  {
    icon: Trophy,
    label: "Recipes Available",
    value: "50k+",
    description: "Curated collection"
  },
  {
    icon: Heart,
    label: "Saved Recipes",
    value: "100k+",
    description: "User favorites"
  },
  {
    icon: ChefHat,
    label: "AI-Powered Plans",
    value: "25k+",
    description: "Weekly generated"
  }
]

export function SocialProof() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent -z-10" />
      
      <div className="container mx-auto px-4">
        {/* Testimonials */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm border border-secondary/20">
              <Quote className="w-4 h-4" />
              What Our Users Say
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold">
              Loved by Home Chefs
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of satisfied users who have transformed their cooking experience
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card variant="glass" className="p-6 h-full">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-lg mb-6">
                  "{testimonial.content}"
                </blockquote>
                <div className="mt-auto">
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card variant="glass" className="p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 