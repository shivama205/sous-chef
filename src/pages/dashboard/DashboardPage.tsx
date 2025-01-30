import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SavedRecipes } from '@/components/profile/SavedRecipes';
import { SavedMealPlans } from '@/components/profile/SavedMealPlans';

export default function DashboardPage() {
  const { user, isLoading } = useStore();
  const [activeTab, setActiveTab] = useState('my-recipes');
  const [stats, setStats] = useState({
    total_recipes: 0,
    total_likes: 0,
    total_views: 0,
    average_rating: 0,
  });

  useEffect(() => {
    // Fetch user stats and recipes here
  }, [user?.id]);

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
        <p className="text-gray-500">Please log in to view your dashboard</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user.full_name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Recipes</h3>
          <p className="text-2xl font-bold">{stats.total_recipes}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Likes</h3>
          <p className="text-2xl font-bold">{stats.total_likes}</p>
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
          <TabsTrigger value="my-recipes">My Recipes</TabsTrigger>
          <TabsTrigger value="meal-plans">Meal Plans</TabsTrigger>
        </TabsList>
        <TabsContent value="my-recipes">
          <SavedRecipes />
        </TabsContent>
        <TabsContent value="meal-plans">
          <SavedMealPlans />
        </TabsContent>
      </Tabs>
    </div>
  );
} 