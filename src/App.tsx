import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import Index from "./pages/Index";
import { MealPlan } from "./pages/MealPlan";
import HealthyAlternative from "./pages/HealthyAlternative";
import Profile from "./pages/Profile";
import { Pricing } from "./pages/Pricing";
import Billing from "./pages/Billing";
import FAQ from "./pages/FAQ";
import MealPlanDetails from "./pages/MealPlanDetails";
import SharedMealPlan from "./pages/SharedMealPlan";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import RecipeFinder from "./pages/RecipeFinder";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import RecipeDetail from "@/pages/RecipeDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/meal-plan" element={<MealPlan />} />
            <Route path="/meal-plan/:id" element={<MealPlanDetails />} />
            <Route path="/shared/meal-plan/:id" element={<SharedMealPlan />} />
            <Route path="/recipe-finder" element={<RecipeFinder />} />
            <Route path="/healthy-alternative" element={<HealthyAlternative />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/about" element={<About />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;