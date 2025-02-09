import { cn } from "@/lib/utils"
import NavigationBar from "@/components/NavigationBar"
import Footer from "@/components/Footer"

interface BaseLayoutProps {
  children: React.ReactNode
  className?: string
}

export function BaseLayout({
  children,
  className,
}: BaseLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen flex flex-col bg-white text-foreground",
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