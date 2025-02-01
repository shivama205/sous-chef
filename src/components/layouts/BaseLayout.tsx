import { cn } from "@/lib/utils"
import NavigationBar from "@/components/NavigationBar"
import Footer from "@/components/Footer"

interface BaseLayoutProps {
  children: React.ReactNode
  className?: string
  withGradient?: boolean
}

export function BaseLayout({
  children,
  className,
  withGradient = true,
}: BaseLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      withGradient && "bg-gradient-to-b from-accent/30 to-accent/10",
      className
    )}>
      <NavigationBar />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
    </div>
  )
} 