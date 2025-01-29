import { Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SEO } from "@/components/SEO";
import { BaseLayout } from "@/components/layouts/BaseLayout";

// Pages
import Index from "@/pages/Index";
import Profile from "@/pages/Profile";
import CommunityPage from "@/pages/community/CommunityPage";
import RecipeCreator from "@/pages/recipes/RecipeCreator";
import RecipeDetails from "@/pages/recipes/RecipeDetails";
import { AIRecipeAssistant } from "@/components/AIRecipeAssistant";
import Blog from "@/pages/blogs/Blogs";
import BlogPost from "@/pages/blogs/BlogDetails";
import { Pricing } from "@/pages/Pricing";
import Privacy from "@/pages/compliance/Privacy";
import Terms from "@/pages/compliance/Terms";
import About from "@/pages/compliance/About";
import { PaymentStatus } from "@/pages/payment/status";

const App = () => (
  <TooltipProvider>
    <SEO />
    <BaseLayout>
      <main>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/create-recipe" element={<RecipeCreator />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/ai-recipe-assistant" element={<AIRecipeAssistant />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/payment/status" element={<PaymentStatus />} />
        </Routes>
      </main>
    </BaseLayout>
  </TooltipProvider>
);

export default App;