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
import { Leaf, ChefHat, Apple, Sparkles, Menu, X, Utensils, Brain, User as UserIcon, CreditCard, LogOut, Heart } from "lucide-react";
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

  const menuItems = {
    features: [
      { path: "/meal-plan", label: "Meal Plan", icon: <ChefHat className="w-4 h-4" />, description: "Plan your meals for the week" },
      { path: "/meal-suggestions", label: "Quick Meal Ideas", icon: <Brain className="w-4 h-4" />, description: "Instant meal suggestions when you're stuck" },
      { path: "/recipe-finder", label: "Find Recipes", icon: <Utensils className="w-4 h-4" />, description: "Search our recipe collection" },
      { path: "/healthy-alternative", label: "Healthy Swaps", icon: <Apple className="w-4 h-4" />, description: "Find healthier alternatives" },
    ],
    more: [
      { path: "/blog", label: "Blog", icon: <Leaf className="w-4 h-4" /> },
      { path: "/pricing", label: "Support Us", icon: <Heart className="w-4 h-4" />, badge: "❤️" }
    ]
  };

  return (
    <nav className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 z-50">
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
                        ${isActive(item.path) ? "bg-primary/5" : "hover:bg-primary/5"}
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
                className={`group hover:bg-primary/5 ${isActive(item.path) ? "bg-primary/5" : ""}`}
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
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full ring-2 ring-primary/10 hover:ring-primary/20">
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
                    <DropdownMenuItem asChild>
                      <Link to="/billing" className="flex items-center gap-2 w-full cursor-pointer">
                        <div className="p-1 rounded bg-primary/10">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        Billing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
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
              <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">Services</div>
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
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
