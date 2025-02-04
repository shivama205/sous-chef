import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";

interface GoogleSignInButtonProps {
  redirectPath?: string;
  state?: any;
}

const GoogleSignInButton = ({ redirectPath, state }: GoogleSignInButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async () => {
    try {
      // Store redirect info in sessionStorage before initiating sign in
      if (redirectPath) {
        sessionStorage.setItem('redirectPath', redirectPath);
      }
      if (state) {
        sessionStorage.setItem('redirectState', JSON.stringify(state));
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin, // Simplified: redirect to origin instead of callback
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Error signing in",
        description: "There was an error signing in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full h-11 flex items-center justify-center gap-3 text-base font-medium transition-all duration-200 hover:scale-105 bg-white hover:bg-white/90 border border-gray-200 shadow-sm"
      onClick={handleSignIn}
    >
      <FcGoogle className="w-5 h-5" />
      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Sign In
      </span>
    </Button>
  );
};

export default GoogleSignInButton; 