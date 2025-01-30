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
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NavigationBar />
        </nav>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex-grow">
        {children || <Outlet />}
      </main>

      <Footer />
    </div>
  );
};