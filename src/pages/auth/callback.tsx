import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { MealPlanLoadingOverlay } from "@/components/MealPlanLoadingOverlay";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleRedirect = async () => {
      if (!user) return;

      // Get stored redirect info
      const redirectPath = sessionStorage.getItem('redirectPath');
      const redirectStateStr = sessionStorage.getItem('redirectState');
      
      // Clean up stored data
      sessionStorage.removeItem('redirectPath');
      sessionStorage.removeItem('redirectState');

      // Handle redirect
      if (redirectPath) {
        const state = redirectStateStr ? JSON.parse(redirectStateStr) : undefined;
        navigate(redirectPath, { state, replace: true });
      } else {
        // Default redirect
        navigate('/', { replace: true });
      }
    };

    handleRedirect();
  }, [user, navigate]);

  return <MealPlanLoadingOverlay isLoading={true} />;
} 