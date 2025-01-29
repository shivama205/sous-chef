import { useAuth } from "@/hooks/useAuth";
import { useRecipe } from "@/features/recipe-sharing/hooks/useRecipe";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, Heart, BookOpen, Trophy, Users, Star, Rocket } from "lucide-react";
import { RecipeCard } from "@/features/recipe-sharing/components/RecipeCard";

export const ProfilePage = () => {
  const { user } = useAuth();
  const { recipes } = useRecipe();

  if (!user) return null;

  const stats = [
    {
      title: "Total Recipes",
      value: recipes?.length || 0,
      icon: <ChefHat className="w-4 h-4" />,
    },
    {
      title: "Total Likes",
      value: recipes?.reduce((acc, recipe) => acc + recipe.likes, 0) || 0,
      icon: <Heart className="w-4 h-4" />,
    },
    {
      title: "Total Views",
      value: recipes?.reduce((acc, recipe) => acc + recipe.views, 0) || 0,
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      title: "Chef Rank",
      value: "Rising Star",
      icon: <Trophy className="w-4 h-4" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Card className="w-full md:w-80">
          <CardHeader>
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>
                  <ChefHat className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{user.user_metadata?.full_name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm">Rising Star Chef</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm">Community Member</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm">Recipe Creator</span>
              </div>
              <Button className="w-full" onClick={() => window.location.href = "/create-recipe"}>
                <Rocket className="w-4 h-4 mr-2" />
                Create New Recipe
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="text-primary">{stat.icon}</div>
                    <CardDescription>{stat.title}</CardDescription>
                  </div>
                  <CardTitle className="text-2xl">{stat.value}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="recipes">
            <TabsList>
              <TabsTrigger value="recipes">My Recipes</TabsTrigger>
              <TabsTrigger value="saved">Saved Recipes</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
            </TabsList>
            <TabsContent value="recipes" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes?.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} showAuthor={false} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="saved">
              <div className="text-center py-12 text-muted-foreground">
                <ChefHat className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Saved Recipes Yet</h3>
                <p>Start exploring and save recipes you love!</p>
              </div>
            </TabsContent>
            <TabsContent value="collections">
              <div className="text-center py-12 text-muted-foreground">
                <ChefHat className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Collections Yet</h3>
                <p>Create collections to organize your favorite recipes!</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}; 