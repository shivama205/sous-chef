import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { User } from "@supabase/supabase-js";
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
import { Leaf, ChefHat, Apple, Sparkles, Menu, X, Utensils, Heart, Users, Trophy, BookOpen, Rocket, Settings, LogOut } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/hooks/useAuth";
import GoogleSignInButton from "./GoogleSignInButton";

const communityLinks = [
  {
    title: "Recipe Feed",
    description: "Discover and engage with recipes from our community",
    href: "/recipes",
    icon: BookOpen,
  },
  {
    title: "Chef Community",
    description: "Connect with other passionate home chefs",
    href: "/community",
    icon: Users,
  },
  {
    title: "Chef Rankings",
    description: "See top chefs and trending recipes",
    href: "/rankings",
    icon: Trophy,
    badge: "New",
  },
  {
    title: "Collections",
    description: "Curated recipe collections by our community",
    href: "/collections",
    icon: Heart,
    badge: "New",
  },
];

const toolsLinks = [
  {
    title: "AI Meal Planning",
    description: "Get personalized meal plans",
    href: "/meal-plan",
    icon: ChefHat,
  },
  {
    title: "Recipe Creator",
    description: "Create and share your recipes",
    href: "/create-recipe",
    icon: Rocket,
    badge: "New",
  },
  {
    title: "Chef Analytics",
    description: "Track your recipe performance",
    href: "/analytics",
    icon: Trophy,
    badge: "Pro",
  },
];

const NavigationBar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading, signIn, signOut } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl">SousChef</span>
          </Link>
          <div className="animate-pulse h-10 w-20 bg-muted rounded" />
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <ChefHat className="w-8 h-8 text-primary" />
          <span className="font-bold text-xl">SousChef</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Community</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {communityLinks.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <item.icon className="h-4 w-4" />
                              <span className="text-sm font-medium leading-none">{item.title}</span>
                              {item.badge && (
                                <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {toolsLinks.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <item.icon className="h-4 w-4" />
                              <span className="text-sm font-medium leading-none">{item.title}</span>
                              {item.badge && (
                                <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/pricing" className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-primary focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Pricing
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>{user.user_metadata?.full_name?.[0] || user.email?.[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <ChefHat className="mr-2 h-4 w-4" />
                  Chef Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center">
              <GoogleSignInButton />
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden border-t"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Community</h3>
              {communityLinks.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Tools</h3>
              {toolsLinks.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
            <div className="pt-4 border-t">
              {user ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Profile Settings
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ChefHat className="h-4 w-4" />
                    Chef Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="w-full">
                  <GoogleSignInButton />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default NavigationBar;
