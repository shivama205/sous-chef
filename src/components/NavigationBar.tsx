import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">SousChef</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/meal-plan"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/meal-plan") ? "text-primary" : "text-gray-600"
              }`}
            >
              Meal Plan
            </Link>
            <Link
              to="/healthy-swap"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/healthy-swap") ? "text-primary" : "text-gray-600"
              }`}
            >
              Healthy Swap
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive("/profile") ? "text-primary" : "text-gray-600"
                  }`}
                >
                  Profile
                </Link>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={handleLogin}>Login with Google</Button>
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center space-x-4">
            <Link
              to="/meal-plan"
              className={`text-sm font-medium ${
                isActive("/meal-plan") ? "text-primary" : "text-gray-600"
              }`}
            >
              Meal Plan
            </Link>
            <Link
              to="/healthy-swap"
              className={`text-sm font-medium ${
                isActive("/healthy-swap") ? "text-primary" : "text-gray-600"
              }`}
            >
              Healthy Swap
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`text-sm font-medium ${
                    isActive("/profile") ? "text-primary" : "text-gray-600"
                  }`}
                >
                  Profile
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={handleLogin}>Login</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;