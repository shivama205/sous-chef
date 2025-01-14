import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

async function handleSignInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Error signing in with Google:', error.message);
  }
  

const GoogleSignInButton = () => {
  return (
    <Button onClick={handleSignInWithGoogle} variant="secondary">
      Sign in with Google
    </Button>
  );
};

export default GoogleSignInButton; 