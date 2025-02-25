import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Leaf, ChefHat, Apple, Sparkles, Menu, X, Utensils, Brain, User as UserIcon, CreditCard, LogOut, Heart, Calendar, Star, Newspaper } from "lucide-react";
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
    try {
      // Clear all Supabase storage
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear all local storage except theme
      const themePreference = localStorage.getItem('theme-preference');
      localStorage.clear();
      if (themePreference) {
        localStorage.setItem('theme-preference', themePreference);
      }
      
      // Clear all session storage
      sessionStorage.clear();
      
      // Clear any cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Force reload the page to clear all states
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = {
    features: [
      { path: "/meal-plan", label: "Meal Plan", icon: <Calendar className="w-4 h-4" />, description: "Plan your meals for the week" },
      { path: "/meal-suggestions", label: "Quick Meal Ideas", icon: <Star className="w-4 h-4" />, description: "Instant meal suggestions when you're stuck" },
      { path: "/recipe-finder", label: "Find Recipes", icon: <Utensils className="w-4 h-4" />, description: "Search our recipe collection" },
      { path: "/healthy-alternative", label: "Healthy Swaps", icon: <Apple className="w-4 h-4" />, description: "Find healthier alternatives" },
    ],
    more: [
      { path: "/blog", label: "Blog", icon: <Newspaper className="w-4 h-4" />, description: "Tips & Guides" },
      { path: "/pricing", label: "Support Us", icon: <Heart className="w-4 h-4" />, badge: "❤️" }
    ]
  };

  return (
    <nav className="sticky top-0 bg-white border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MySideChef
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Features Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 group hover:bg-primary/5"
                >
                  <ChefHat className="w-4 h-4 group-hover:text-primary transition-colors" />
                  <span className="group-hover:text-primary transition-colors">Services</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[400px] p-4">
                <div className="grid grid-cols-2 gap-4">
                  {menuItems.features.map((item) => (
                    <Link 
                      key={item.path}
                      to={item.path}
                      className={`
                        flex flex-col gap-2 p-3 rounded-lg transition-all duration-200
                        ${isActive(item.path) ? "bg-primary/5 text-primary" : "hover:bg-primary/5 hover:text-primary"}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-md bg-primary/10">
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.description}</span>
                    </Link>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {menuItems.more.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                asChild
                className={`group hover:bg-primary/5 ${isActive(item.path) ? "bg-primary/5 text-primary" : ""}`}
              >
                <Link to={item.path} className="flex items-center gap-2">
                  <span className="group-hover:text-primary transition-colors">{item.icon}</span>
                  <span className="group-hover:text-primary transition-colors">{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </Button>
            ))}
            
            <div className="pl-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:ring-2 hover:ring-primary/20">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
                        <AvatarFallback>{user.user_metadata.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
                        <AvatarFallback>{user.user_metadata.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium leading-none">{user.user_metadata.full_name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 w-full cursor-pointer">
                        <div className="p-1 rounded bg-primary/10">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-700 focus:text-red-700 hover:bg-red-50 focus:bg-red-50 cursor-pointer transition-colors"
                    >
                      <div className="p-1 rounded bg-red-100">
                        <LogOut className="w-4 h-4" />
                      </div>
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

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-primary/5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden py-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="space-y-2">
              <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">Features</div>
              {menuItems.features.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col gap-2 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path) 
                      ? "bg-primary/5" 
                      : "hover:bg-primary/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-md bg-primary/10">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.description}</span>
                </Link>
              ))}
            </div>

            <div className="space-y-2">
              <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">More</div>
              {/* Blog and Support Us Links */}
              {menuItems.more.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path) 
                      ? "bg-primary/5" 
                      : "hover:bg-primary/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="p-2 rounded-md bg-primary/10">
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}

              <div className="my-2 border-t border-border" />

              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="p-2 rounded-md bg-primary/10">
                      <UserIcon className="w-4 h-4 text-primary" />
                    </div>
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={async () => {
                      await handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left text-red-600"
                  >
                    <div className="p-2 rounded-md bg-red-100">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span>Log out</span>
                  </button>
                </>
              ) : (
                <div className="px-3">
                  <GoogleSignInButton />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
