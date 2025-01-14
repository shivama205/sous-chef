import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const NavigationBar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/profile`
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SousChef
            </span>
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
            <Link
              to="/pricing"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/pricing") ? "text-primary" : "text-gray-600"
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/faq"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/faq") ? "text-primary" : "text-gray-600"
              }`}
            >
              FAQ
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
                      <AvatarFallback>{user.user_metadata.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.user_metadata.full_name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/billing">Billing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleLogin} variant="secondary">
                Sign in
              </Button>
            )}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <span className="sr-only">Open menu</span>
              <div className="w-4 h-4 flex flex-col justify-between">
                <span className={`block w-full h-0.5 bg-current transform transition duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block w-full h-0.5 bg-current transition duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-full h-0.5 bg-current transform transition duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden flex flex-col space-y-4 py-4"
          >
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
            <Link
              to="/pricing"
              className={`text-sm font-medium ${
                isActive("/pricing") ? "text-primary" : "text-gray-600"
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/faq"
              className={`text-sm font-medium ${
                isActive("/faq") ? "text-primary" : "text-gray-600"
              }`}
            >
              FAQ
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-sm font-medium text-gray-600"
                >
                  Profile
                </Link>
                <Link
                  to="/billing"
                  className="text-sm font-medium text-gray-600"
                >
                  Billing
                </Link>
                <Button onClick={handleLogout} variant="ghost" className="justify-start">
                  Log out
                </Button>
              </>
            ) : (
              <Button onClick={handleLogin} variant="secondary">
                Sign in
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;