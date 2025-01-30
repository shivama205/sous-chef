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
import { Leaf, ChefHat, Apple, Sparkles, Menu, X, Utensils, Heart, Users, Trophy, BookOpen, Rocket, Settings, LogOut, UserCircle } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useStore } from "@/store";
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
  const { user, isLoading, signInWithGoogle, signOut } = useStore();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
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

  const userNavigation = [
    {
      title: "Profile",
      href: `/profile/${user?.id}`,
      icon: UserCircle,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
    {
      title: "Sign out",
      href: "#",
      icon: LogOut,
      onClick: handleSignOut,
    },
  ];

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <Leaf className="h-6 w-6" />
              <span className="font-bold">SousChef</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Leaf className="h-6 w-6" />
            <span className="font-bold">SousChef</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
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
          </div>
        </div>

        {/* User Menu - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || 'User'} />
                    <AvatarFallback>{user.full_name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {userNavigation.map((item) => (
                  <DropdownMenuItem
                    key={item.title}
                    onClick={item.onClick || (() => navigate(item.href))}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <GoogleSignInButton onLoginSuccess={handleSignIn} redirectPath="/dashboard" />
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            className="h-9 w-9 p-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden"
        >
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Community</h3>
                {communityLinks.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
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
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
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
              <div className="border-t pt-4">
                {user ? (
                  <div className="space-y-2">
                    {userNavigation.map((item) => (
                      <Link
                        key={item.title}
                        to={item.href}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          item.onClick?.();
                        }}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <GoogleSignInButton onLoginSuccess={handleSignIn} redirectPath="/dashboard" />
                )}
              </div>
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default NavigationBar;
