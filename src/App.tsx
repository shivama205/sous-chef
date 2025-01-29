import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/providers/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { BaseLayout } from '@/components/layouts/BaseLayout';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { RecipeCreator } from '@/pages/recipes/RecipeCreator';
import { RecipeDetails } from '@/pages/recipes/RecipeDetails';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { AchievementsPage } from '@/pages/achievements/AchievementsPage';
import { CollectionsPage } from '@/pages/collections/CollectionsPage';
import { CollectionDetails } from '@/pages/collections/CollectionDetails';
import { CollectionCreator } from '@/pages/collections/CollectionCreator';
import { TooltipProvider } from "@/components/ui/tooltip";
import { SEO } from "@/components/SEO";
import { AIRecipeAssistant } from "@/components/AIRecipeAssistant";
import Blog from "@/pages/blogs/Blogs";
import BlogPost from "@/pages/blogs/BlogDetails";
import { Pricing } from "@/pages/Pricing";
import Privacy from "@/pages/compliance/Privacy";
import Terms from "@/pages/compliance/Terms";
import About from "@/pages/compliance/About";
import { PaymentStatus } from "@/pages/payment/status";

const App = () => (
  <Router>
    <AuthProvider>
      <TooltipProvider>
        <SEO />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute><BaseLayout /></ProtectedRoute>}>
            <Route path="/" element={<DashboardView />} />
            <Route path="/create-recipe" element={<RecipeCreator />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            
            {/* Achievement Routes */}
            <Route path="/achievements" element={<AchievementsPage />} />
            
            {/* Collection Routes */}
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/collections/new" element={<CollectionCreator />} />
            <Route path="/collections/:id" element={<CollectionDetails />} />
          </Route>
        </Routes>
        <Toaster />
      </TooltipProvider>
    </AuthProvider>
  </Router>
);

export default App;