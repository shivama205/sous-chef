import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MealPlan from "./pages/MealPlan";
import HealthySwap from "./pages/HealthySwap";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import Billing from "./pages/Billing";
import FAQ from "./pages/FAQ";
import Footer from "@/components/Footer";
import MealPlanDetails from "./pages/MealPlanDetails";
import SharedMealPlan from "./pages/SharedMealPlan";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/meal-plan" element={<MealPlan />} />
          <Route path="/meal-plan/:id" element={<MealPlanDetails />} />
          <Route path="/shared/meal-plan/:id" element={<SharedMealPlan />} />
          <Route path="/healthy-swap" element={<HealthySwap />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;