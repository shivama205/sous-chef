import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, Heart, Users, Search, TrendingUp, Star, Filter } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Recipe } from "@/types/recipe";

interface Chef {
  id: string;
  full_name: string;
  avatar_url: string;
  recipes_count: number;
  followers_count: number;
  bio?: string;
}

export default function CommunityPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [featuredChefs, setFeaturedChefs] = useState<Chef[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        let recipesQuery;
        
        switch (activeTab) {
          case "trending":
            recipesQuery = supabase
              .from("saved_recipes")
              .select("*, profiles(full_name, avatar_url)")
              .eq("is_public", true)
              .order("views", { ascending: false })
              .limit(10);
            break;
          
          case "latest":
            recipesQuery = supabase
              .from("saved_recipes")
              .select("*, profiles(full_name, avatar_url)")
              .eq("is_public", true)
              .order("created_at", { ascending: false })
              .limit(10);
            break;
          
          case "following":
            if (!user) break;
            
            // First get the list of chefs the user follows
            const { data: following } = await supabase
              .from("follows")
              .select("following_id")
              .eq("follower_id", user.id);
            
            if (!following?.length) break;
            
            recipesQuery = supabase
              .from("saved_recipes")
              .select("*, profiles(full_name, avatar_url)")
              .eq("is_public", true)
              .in("user_id", following.map(f => f.following_id))
              .order("created_at", { ascending: false })
              .limit(10);
            break;
        }

        if (recipesQuery) {
          const { data: recipesData, error: recipesError } = await recipesQuery;
          if (recipesError) throw recipesError;
          setRecipes(recipesData || []);
        }

        // Fetch featured chefs
        const { data: chefsData, error: chefsError } = await supabase
          .from("profiles")
          .select("*")
          .order("recipes_count", { ascending: false })
          .limit(5);

        if (chefsError) throw chefsError;
        setFeaturedChefs(chefsData || []);
      } catch (error) {
        console.error("Error fetching community data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunityData();
  }, [activeTab, user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        icon={Users}
        title="Recipe Community"
        description="Discover amazing recipes and connect with passionate chefs"
      />

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search recipes or chefs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Recipe Feed */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="trending" className="flex-1">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="latest" className="flex-1">
                <ChefHat className="w-4 h-4 mr-2" />
                Latest
              </TabsTrigger>
              <TabsTrigger value="following" className="flex-1">
                <Users className="w-4 h-4 mr-2" />
                Following
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending" className="space-y-6 mt-6">
              {recipes.map((recipe) => (
                <Card key={recipe.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/recipe/${recipe.id}`)}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={recipe.profiles?.avatar_url} />
                        <AvatarFallback>
                          {recipe.profiles?.full_name?.[0] || "C"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{recipe.meal_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              By {recipe.profiles?.full_name}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span className="text-sm">{recipe.likes || 0}</span>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-muted-foreground line-clamp-2">
                          {recipe.description || "A delicious recipe shared by the community."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="latest" className="space-y-6 mt-6">
              {recipes.map((recipe) => (
                <Card key={recipe.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/recipe/${recipe.id}`)}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={recipe.profiles?.avatar_url} />
                        <AvatarFallback>
                          {recipe.profiles?.full_name?.[0] || "C"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{recipe.meal_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              By {recipe.profiles?.full_name}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span className="text-sm">{recipe.likes || 0}</span>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-muted-foreground line-clamp-2">
                          {recipe.description || "A delicious recipe shared by the community."}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {new Date(recipe.created_at || "").toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="following" className="space-y-6 mt-6">
              {!user ? (
                <Card className="p-6 text-center">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Sign in to see recipes from chefs you follow</h3>
                  <p className="text-muted-foreground mb-4">
                    Follow your favorite chefs to see their latest recipes here.
                  </p>
                  <Button onClick={() => navigate("/login")}>Sign In</Button>
                </Card>
              ) : recipes.length === 0 ? (
                <Card className="p-6 text-center">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No recipes yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Follow some chefs to see their recipes here.
                  </p>
                  <Button onClick={() => setActiveTab("trending")}>Discover Chefs</Button>
                </Card>
              ) : (
                recipes.map((recipe) => (
                  <Card key={recipe.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/recipe/${recipe.id}`)}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={recipe.profiles?.avatar_url} />
                          <AvatarFallback>
                            {recipe.profiles?.full_name?.[0] || "C"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{recipe.meal_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                By {recipe.profiles?.full_name}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                <span className="text-sm">{recipe.likes || 0}</span>
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-muted-foreground line-clamp-2">
                            {recipe.description || "A delicious recipe shared by the community."}
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {new Date(recipe.created_at || "").toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Chefs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Featured Chefs
              </CardTitle>
              <CardDescription>Top contributors in our community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredChefs.map((chef) => (
                <div
                  key={chef.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-accent rounded-lg p-2 -mx-2 transition-colors"
                  onClick={() => navigate(`/profile/${chef.id}`)}
                >
                  <Avatar>
                    <AvatarImage src={chef.avatar_url} />
                    <AvatarFallback>{chef.full_name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{chef.full_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {chef.recipes_count} recipes · {chef.followers_count} followers
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Follow
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 