import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { SEO } from "@/components/SEO";
import { HeroSection } from "@/components/home/HeroSection";
import { Features } from "@/components/home/Features";
import { Testimonials } from "@/components/home/Testimonials";
import { CTASection } from "@/components/home/CTASection";
import { DashboardView } from "@/components/dashboard/DashboardView";

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle user authentication
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
        <DashboardView user={user} />
      ) : (
        <main className="flex flex-col min-h-screen">
          <HeroSection />
          <Features />
          <Testimonials />
          <CTASection />
        </main>
      )}
    </>
  );
}