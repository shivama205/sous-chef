import { useEffect } from "react";
import { useStore } from "@/store";
import { SEO } from "@/components/SEO";
import { HeroSection } from "@/components/home/HeroSection";
import { Features } from "@/components/home/Features";
import { Testimonials } from "@/components/home/Testimonials";
import { CTASection } from "@/components/home/CTASection";
import DashboardView from "@/components/dashboard/DashboardView";

export default function Index() {
  const { user, isLoading } = useStore();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      <SEO 
        title="SousChef - Share & Discover Recipes with a Global Community"
        description="Join a vibrant community of home chefs. Share your recipes, get inspired by others, and enhance your cooking with AI-powered features."
        keywords={[
          "recipe sharing",
          "food community",
          "home chefs",
          "cooking platform",
          "social recipes",
          "AI cooking assistant"
        ]}
      />
      
      {user ? (
        <DashboardView />
      ) : (
        <>
          <HeroSection />
          <Features />
          <Testimonials />
          <CTASection />
        </>
      )}
    </>
  );
}