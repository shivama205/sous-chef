import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import axios from "axios";

interface GoogleSignInButtonProps {
  onLoginSuccess?: () => void;
  redirectPath?: string;
}

const GoogleSignInButton = ({ onLoginSuccess, redirectPath }: GoogleSignInButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const { data: authData, error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}${redirectPath || ''}`
        }
      });

      if (authError) throw authError;

      // If we have a success callback, call it
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      // Show success toast
      toast({
        title: "Welcome!",
        description: "Successfully signed in with Google.",
      });

      // Navigate to the redirect path if provided
      if (redirectPath) {
        navigate(redirectPath);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Error signing in",
        description: "There was an error signing in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full h-11 flex items-center justify-center gap-3 text-base font-medium transition-all duration-200 hover:scale-105 bg-white hover:bg-white/90 border border-gray-200 shadow-sm"
      onClick={handleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
      ) : (
        <>
          <FcGoogle className="w-5 h-5" />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Continue with Google
          </span>
        </>
      )}
    </Button>
  );
};

export default GoogleSignInButton; 