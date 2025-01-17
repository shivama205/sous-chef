import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  subtext?: string
  className?: string
  onClick?: () => void
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  subtext,
  className,
  onClick
}: StatsCardProps) {
  return (
    <Card 
      className={cn(
        "bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:bg-primary/5 transition-colors duration-200",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm text-muted-foreground">{label}</h3>
            <p className="text-xl font-semibold text-primary">{value}</p>
            {subtext && <span className="text-xs text-muted-foreground">{subtext}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 