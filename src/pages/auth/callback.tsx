import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { MealPlanLoadingOverlay } from "@/components/MealPlanLoadingOverlay";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        console.log("Auth state:", { user, loading });

        // If still loading, wait
        if (loading) {
          console.log("Auth state is still loading...");
          return;
        }

        // If finished loading but no user, check session directly
        if (!user) {
          console.log("No user after loading, checking session...");
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            console.log("No session found");
            setError("Authentication failed. Please try again.");
            return;
          }
          
          // If we have a session but no user, wait for next update
          if (session) {
            console.log("Session found, waiting for user state update...");
            return;
          }
        }

        console.log("User authenticated:", user?.id);

        // Get stored redirect info
        const redirectPath = sessionStorage.getItem('redirectPath');
        const redirectStateStr = sessionStorage.getItem('redirectState');
        
        console.log("Redirect info:", { redirectPath, redirectStateStr });

        // Clean up stored data
        sessionStorage.removeItem('redirectPath');
        sessionStorage.removeItem('redirectState');

        // Handle redirect
        if (redirectPath) {
          const state = redirectStateStr ? JSON.parse(redirectStateStr) : undefined;
          console.log("Navigating to stored path:", redirectPath, state);
          navigate(redirectPath, { state, replace: true });
        } else {
          // Default redirect
          console.log("No redirect path found, going to home");
          navigate('/', { replace: true });
        }
      } catch (err) {
        console.error("Error in auth callback:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    };

    handleRedirect();
  }, [user, loading, navigate]);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!user && !error) {
        setError("Authentication timed out. Please try signing in again.");
        navigate('/');
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [user, error, navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Return Home
        </button>
      </div>
    );
  }

  return <MealPlanLoadingOverlay isLoading={true} />;
} 