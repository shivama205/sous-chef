import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { ProfileCompletionBanner } from '@/components/ProfileCompletionBanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ChefHat, 
  PlusCircle, 
  Clock, 
  Heart, 
  Bookmark, 
  TrendingUp,
  Users,
  Star,
  BookOpen
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

interface SavedRecipe {
  id: string;
  meal_name: string;
  description: string;
  cooking_time: number;
  likes: number;
  image_url?: string;
  created_at: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-recipes');
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalLikes: 0,
    followers: 0
  });

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch user's recipes
        const { data: recipesData, error: recipesError } = await supabase
          .from('saved_recipes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (recipesError) throw recipesError;
        setRecipes(recipesData || []);

        // Fetch user stats
        const { data: likesData } = await supabase
          .from('recipe_likes')
          .select('recipe_id', { count: 'exact' })
          .eq('user_id', user.id);

        const { data: followersData } = await supabase
          .from('follows')
          .select('follower_id', { count: 'exact' })
          .eq('following_id', user.id);

        setStats({
          totalRecipes: recipesData?.length || 0,
          totalLikes: likesData?.length || 0,
          followers: followersData?.length || 0
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileCompletionBanner />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Quick Stats */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Recipes</p>
                <h3 className="text-2xl font-bold">{stats.totalRecipes}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recipe Likes</p>
                <h3 className="text-2xl font-bold">{stats.totalLikes}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Followers</p>
                <h3 className="text-2xl font-bold">{stats.followers}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button
          size="lg"
          className="flex items-center gap-2"
          onClick={() => navigate('/create-recipe')}
        >
          <PlusCircle className="w-5 h-5" />
          Create New Recipe
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
          onClick={() => navigate('/community')}
        >
          <Users className="w-5 h-5" />
          Explore Community
        </Button>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-recipes" className="flex items-center gap-2">
            <ChefHat className="w-4 h-4" />
            My Recipes
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            Saved Recipes
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Trending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-recipes">
          {recipes.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ChefHat className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Recipes Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start sharing your culinary creations with the community
                </p>
                <Button
                  onClick={() => navigate('/create-recipe')}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  Create Your First Recipe
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                >
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    {recipe.image_url ? (
                      <img
                        src={recipe.image_url}
                        alt={recipe.meal_name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                        <ChefHat className="w-8 h-8 text-primary/40" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{recipe.meal_name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {recipe.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {recipe.cooking_time} mins
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        {recipe.likes}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved">
          <Card className="text-center py-12">
            <CardContent>
              <Bookmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Saved Recipes</h3>
              <p className="text-muted-foreground mb-6">
                Explore the community and save recipes you'd like to try later
              </p>
              <Button
                onClick={() => navigate('/community')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Explore Community
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending">
          <Card className="text-center py-12">
            <CardContent>
              <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground mb-6">
                We're working on bringing you trending recipes from the community
              </p>
              <Button
                onClick={() => navigate('/community')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Explore Community
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 