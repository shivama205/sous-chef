import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavigationBar from "@/components/NavigationBar";
import { format } from "date-fns";
import { Calculator, Settings, ChefHat, History, Star, Clock, Calendar, Utensils } from "lucide-react";
import { SavedRecipes } from "@/components/profile/SavedRecipes";
import { SavedMealPlans } from "@/components/profile/SavedMealPlans";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recipes");

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-6 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-8">
            <Avatar className="w-20 h-20 sm:w-32 sm:h-32 border-4 border-white shadow-xl">
              <AvatarImage src={user.user_metadata.avatar_url} />
              <AvatarFallback className="text-2xl">
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1 space-y-1 sm:space-y-2 pb-2">
              <h1 className="text-xl sm:text-3xl font-bold">
                {user.user_metadata.full_name || user.email}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {format(new Date(user.created_at), 'MMM yyyy')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>12 Recipes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>5 Plans</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Fixed Tab Bar on Mobile */}
          <div className="sticky top-[64px] z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container px-2 sm:px-4">
              <TabsList className="w-full h-12 sm:h-auto p-1 bg-transparent sm:bg-white/50 sm:backdrop-blur-sm sm:shadow-sm">
                <TabsTrigger 
                  value="recipes" 
                  className="flex-1 sm:flex-initial flex items-center gap-2 data-[state=active]:bg-primary/10 sm:data-[state=active]:bg-white"
                >
                  <ChefHat className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Recipes</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="meal-plans" 
                  className="flex-1 sm:flex-initial flex items-center gap-2 data-[state=active]:bg-primary/10 sm:data-[state=active]:bg-white"
                >
                  <Utensils className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Plans</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="overview" 
                  className="flex-1 sm:flex-initial flex items-center gap-2 data-[state=active]:bg-primary/10 sm:data-[state=active]:bg-white"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Settings</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="activity" 
                  className="flex-1 sm:flex-initial flex items-center gap-2 data-[state=active]:bg-primary/10 sm:data-[state=active]:bg-white"
                >
                  <History className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Activity</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Tab Content */}
          <div className="container px-2 sm:px-4">
            <TabsContent value="recipes" className="mt-0 focus-visible:outline-none">
              <SavedRecipes />
            </TabsContent>

            <TabsContent value="meal-plans" className="mt-0 focus-visible:outline-none">
              <SavedMealPlans />
            </TabsContent>

            <TabsContent value="overview" className="mt-0 space-y-4 sm:space-y-6 focus-visible:outline-none">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your profile and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Name</h3>
                      <p className="text-sm text-muted-foreground">
                        {user.user_metadata.full_name || "Not set"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Account Type</h3>
                      <p className="text-sm text-muted-foreground">Free Plan</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Language</h3>
                      <p className="text-sm text-muted-foreground">English (US)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your meal planning experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="font-medium">Dietary Restrictions</h3>
                      <p className="text-sm text-muted-foreground">None set</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Cuisine Preferences</h3>
                      <p className="text-sm text-muted-foreground">All cuisines</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Cooking Level</h3>
                      <p className="text-sm text-muted-foreground">Intermediate</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Serving Size</h3>
                      <p className="text-sm text-muted-foreground">2 servings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-0 space-y-4 sm:space-y-6 focus-visible:outline-none">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent interactions and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Star className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Saved a new recipe</p>
                          <p className="text-sm text-muted-foreground">
                            You saved "Grilled Chicken Salad" to your collection
                          </p>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}