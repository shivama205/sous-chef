import React from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from "@/lib/utils"
import NavigationBar from "@/components/NavigationBar"
import Footer from "@/components/Footer"

export interface BaseLayoutProps {
  children?: React.ReactNode;
  className?: string;
  withGradient?: boolean;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  className,
  withGradient = true,
}) => {
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      withGradient && "bg-gradient-to-b from-accent/30 to-accent/10",
      className
    )}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4">
          <NavigationBar />
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        {children || <Outlet />}
      </main>

      <Footer />
    </div>
  );
};