import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { useStore } from "@/store";

interface GoogleSignInButtonProps {
  onLoginSuccess?: () => void;
  redirectPath?: string;
}

const GoogleSignInButton = ({ onLoginSuccess, redirectPath }: GoogleSignInButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useStore();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();

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
      onClick={handleSignIn}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2"
    >
      <FcGoogle className="h-5 w-5" />
      {isLoading ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
};

export default GoogleSignInButton; 