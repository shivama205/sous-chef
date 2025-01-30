import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { BaseLayout } from './components/layouts/BaseLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/ui/loading-spinner';
import { SEO } from "./components/SEO";
import { TooltipProvider } from "./components/ui/tooltip";

// Lazy load components for better performance
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const DashboardView = React.lazy(() => import('./components/dashboard/DashboardView'));
const RecipeCreator = React.lazy(() => import('./pages/recipes/RecipeCreator'));
const RecipeDetails = React.lazy(() => import('./pages/recipes/RecipeDetails'));
const AchievementsPage = React.lazy(() => import('./pages/achievements/AchievementsPage'));
const CollectionsPage = React.lazy(() => import('./pages/collections/CollectionsPage'));
const CollectionDetails = React.lazy(() => import('./pages/collections/CollectionDetails'));
const CollectionCreator = React.lazy(() => import('./pages/collections/CollectionCreator'));
const Blog = React.lazy(() => import('./pages/blogs/Blogs'));
const BlogPost = React.lazy(() => import('./pages/blogs/BlogDetails'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const Privacy = React.lazy(() => import('./pages/compliance/Privacy'));
const Terms = React.lazy(() => import('./pages/compliance/Terms'));
const About = React.lazy(() => import('./pages/compliance/About'));
const PaymentStatus = React.lazy(() => import('./pages/payment/status'));
const Profile = React.lazy(() => import('./pages/profile/Profile'));
const Settings = React.lazy(() => import('./pages/settings/Settings'));
const AIRecipeAssistant = React.lazy(() => import('./components/AIRecipeAssistant'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <SEO />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/about" element={<About />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute><BaseLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardView />} />
              <Route path="/create-recipe" element={<RecipeCreator />} />
              <Route path="/recipe/:id" element={<RecipeDetails />} />
              <Route path="/recipe/:id/edit" element={<RecipeCreator />} />
              
              {/* Profile & Settings Routes */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Achievement Routes */}
              <Route path="/achievements" element={<AchievementsPage />} />
              
              {/* Collection Routes */}
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/collections/new" element={<CollectionCreator />} />
              <Route path="/collections/:id" element={<CollectionDetails />} />
              <Route path="/collections/:id/edit" element={<CollectionCreator />} />
              
              {/* Payment Routes */}
              <Route path="/payment/status" element={<PaymentStatus />} />
              
              {/* AI Assistant Route */}
              <Route path="/ai-assistant" element={<AIRecipeAssistant />} />
            </Route>
          </Routes>
          <Toaster />
        </Suspense>
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;