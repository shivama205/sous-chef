import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Card } from "./card"
import { Check, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export interface FeaturePreviewProps extends Omit<HTMLMotionProps<"div">, keyof {
  title: string
  tagline: string
  description: string
  benefits: string[]
  icon: React.ElementType
  color: "burgundy" | "taupe" | "cream"
  screenshot?: {
    src: string
    alt: string
  }
  action: {
    label: string
    href: string
  }
  imagePosition?: "left" | "right"
}> {
  title: string
  tagline: string
  description: string
  benefits: string[]
  icon: React.ElementType
  color: "burgundy" | "taupe" | "cream"
  screenshot?: {
    src: string
    alt: string
  }
  action: {
    label: string
    href: string
  }
  imagePosition?: "left" | "right"
}

const colorVariants = {
  burgundy: {
    tag: "bg-primary/10 text-primary",
    icon: "bg-primary/10 text-primary",
    check: "bg-primary/10 text-primary",
    button: "bg-primary hover:bg-primary/90",
    gradient: "from-primary/20 to-secondary/20",
    border: "border-primary/10",
  },
  taupe: {
    tag: "bg-secondary/10 text-secondary",
    icon: "bg-secondary/10 text-secondary",
    check: "bg-secondary/10 text-secondary",
    button: "bg-secondary hover:bg-secondary/90",
    gradient: "from-secondary/20 to-accent/20",
    border: "border-secondary/10",
  },
  cream: {
    tag: "bg-accent/50 text-primary",
    icon: "bg-accent/50 text-primary",
    check: "bg-accent/50 text-primary",
    button: "bg-accent hover:bg-accent/90 text-primary",
    gradient: "from-accent/50 to-accent/30",
    border: "border-accent/50",
  },
}

export function FeaturePreview({
  className,
  title,
  tagline,
  description,
  benefits,
  icon: Icon,
  color = "burgundy",
  screenshot,
  action,
  imagePosition = "right",
  ...props
}: FeaturePreviewProps) {
  const colors = colorVariants[color]
  const Content = () => (
    <div className="space-y-6">
      <div className={cn("inline-block px-4 py-2 rounded-full text-sm", colors.tag)}>
        {tagline}
      </div>
      <h3 className="text-2xl lg:text-3xl font-bold">
        {title}
      </h3>
      <p className="text-lg text-muted-foreground">
        {description}
      </p>
      <ul className="space-y-4">
        {benefits.map((benefit, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", colors.check)}>
              <Check className="w-4 h-4" />
            </div>
            <span>{benefit}</span>
          </motion.li>
        ))}
      </ul>
      <Button asChild size="lg" className={cn("gap-2", colors.button)}>
        <Link to={action.href}>
          {action.label}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  )

  const Preview = () => (
    <div className="relative">
      <div className={cn("absolute inset-0 bg-gradient-to-r blur-3xl", colors.gradient)} />
      <Card
        variant="glass"
        className={cn("relative overflow-hidden", colors.border)}
      >
        <div className="aspect-[16/10] bg-gradient-to-br from-white/5 to-white/10">
          {screenshot ? (
            <div className="relative w-full h-full">
              <img
                src={screenshot.src}
                alt={screenshot.alt}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent rounded-lg" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Preview
            </div>
          )}
        </div>
      </Card>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={cn(
        "grid lg:grid-cols-2 gap-12 items-center",
        className
      )}
      {...props}
    >
      {imagePosition === "left" && <Preview />}
      <Content />
      {imagePosition === "right" && <Preview />}
    </motion.div>
  )
} 