import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
  onClick?: () => void
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
  onClick
}: FeatureCardProps) {
  return (
    <div 
      className={cn(
        "p-4 rounded-lg bg-white/80 border-0 shadow-sm hover:bg-primary/5 transition-colors duration-200",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-foreground">{title}</span>
      </h3>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  )
} 