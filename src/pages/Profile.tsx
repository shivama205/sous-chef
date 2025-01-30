import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "@/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SavedRecipes } from "@/components/profile/SavedRecipes";
import { SavedMealPlans } from "@/components/profile/SavedMealPlans";
import type { ProfileStats } from "@/types";

export default function Profile() {
  const { id } = useParams();
  const { user, isLoading } = useStore();
  const [activeTab, setActiveTab] = useState("recipes");
  const [stats, setStats] = useState<ProfileStats>({
    total_recipes: 0,
    total_likes_received: 0,
    total_views: 0,
    average_rating: 0,
    followers_count: 0,
    following_count: 0,
  });

  useEffect(() => {
    // Fetch user stats here
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Please log in to view profiles</p>
      </div>
    );
  }

  const isOwnProfile = user.id === id;

  return (
    <div className="container py-8">
      <div className="flex items-start gap-8 mb-8">
        <div className="flex-shrink-0">
          <img
            src={user.avatar_url || "/default-avatar.png"}
            alt={user.full_name || "User"}
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{user.full_name}</h1>
          {user.bio && <p className="text-muted-foreground mb-4">{user.bio}</p>}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{stats.followers_count} followers</span>
            <span>{stats.following_count} following</span>
            <span>{stats.total_recipes} recipes</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Recipes</h3>
          <p className="text-2xl font-bold">{stats.total_recipes}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Likes</h3>
          <p className="text-2xl font-bold">{stats.total_likes_received}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Views</h3>
          <p className="text-2xl font-bold">{stats.total_views}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Average Rating</h3>
          <p className="text-2xl font-bold">{stats.average_rating.toFixed(1)}</p>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          {isOwnProfile && <TabsTrigger value="meal-plans">Meal Plans</TabsTrigger>}
        </TabsList>
        <TabsContent value="recipes">
          <SavedRecipes userId={id} />
        </TabsContent>
        {isOwnProfile && (
          <TabsContent value="meal-plans">
            <SavedMealPlans />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}