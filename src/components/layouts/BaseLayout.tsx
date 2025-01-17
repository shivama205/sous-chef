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
      "min-h-screen",
      withGradient && "bg-gradient-to-b from-accent/30 to-accent/10",
      className
    )}>
      <NavigationBar />
      {children}
      <Footer />
    </div>
  )
} 