import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { Leaf, ChefHat, Apple, Sparkles, Menu, X } from "lucide-react";
import GoogleSignInButton from "./GoogleSignInButton";

const NavigationBar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: "/meal-plan", label: "Create Plan", icon: <ChefHat className="w-4 h-4" /> },
    { path: "/healthy-swap", label: "Healthy Swap", icon: <Apple className="w-4 h-4" /> },
    { path: "/pricing", label: "Pricing", icon: <Sparkles className="w-4 h-4" /> },
    { path: "/faq", label: "FAQ", icon: <Leaf className="w-4 h-4" /> },
  ];

  return (
    <nav className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SousChef
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-50 ${
                  isActive(item.path) 
                    ? "text-primary bg-primary/5" 
                    : "text-gray-600"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            
            <div className="pl-2">
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
                      <Link to="/profile" className="w-full cursor-pointer">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/billing" className="w-full cursor-pointer">Billing</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="w-[120px]">
                  <GoogleSignInButton />
                </div>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 space-y-2"
          >
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(item.path) 
                    ? "text-primary bg-primary/5" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            {user ? (
              <div className="pt-4 mt-4 border-t border-gray-100">
                <div className="flex items-center space-x-3 px-2 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
                    <AvatarFallback>{user.user_metadata.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user.user_metadata.full_name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/billing"
                    className="flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Billing
                  </Link>
                  <Button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }} 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50 px-2"
                  >
                    Log out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-4 mt-4 border-t border-gray-100 px-2">
                <GoogleSignInButton />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;