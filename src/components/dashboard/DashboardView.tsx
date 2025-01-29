import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Activity } from "@/types/activity";
import { Recipe } from "@/types/recipe";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChefHat,
  Sparkles,
  Plus,
  Users,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  BookOpen,
  Heart,
  Award,
  Utensils,
  Flame,
  ArrowRight,
  Search,
  Trophy,
  Folder
} from "lucide-react";
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { ChefProgress, WeeklyChallenge, Achievement } from '@/types/gamification';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { RecipeCollection } from '@/components/recipes/RecipeCollection';
import { toast } from "@/components/ui/use-toast";

interface DashboardViewProps {
  user: User;
}

interface DashboardStats {
  savedRecipesCount: number;
  savedPlansCount: number;
  totalActivities: number;
  weeklyStreak: number;
  recipesCreated: number;
  totalLikes: number;
  favoriteCuisine: string;
  communityRank: string;
  chefProgress: ChefProgress;
  weeklyChallenge: WeeklyChallenge;
  recentAchievements: any[];
  collections: any[];
}

export const DashboardView = ({ user }: DashboardViewProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    savedRecipesCount: 0,
    savedPlansCount: 0,
    totalActivities: 0,
    weeklyStreak: 0,
    recipesCreated: 0,
    totalLikes: 0,
    favoriteCuisine: '',
    communityRank: 'Novice Chef',
    chefProgress: {
      level: 'Novice',
      current_xp: 0,
      xp_to_next_level: 100,
      total_xp: 0,
      achievements: [],
      weekly_challenge_progress: 0,
      weekly_challenge_total: 100,
      streak_days: 0,
      longest_streak: 0
    },
    weeklyChallenge: {
      id: 'weekly-1',
      title: 'First Challenge',
      description: 'This is the first challenge of the week',
      xp_reward: 100,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      participants_count: 0,
      completed_count: 0,
      user_completed: false
    },
    recentAchievements: [],
    collections: []
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch basic stats
        const { data: basicStats, error: statsError } = await supabase
          .rpc('get_user_dashboard_stats', { user_id: user.id });

        if (statsError) throw statsError;

        // Fetch trending recipes
        const { data: trending, error: trendingError } = await supabase
          .from('saved_recipes')
          .select('*, user:profiles(*)')
          .eq('is_public', true)
          .order('likes', { ascending: false })
          .limit(5);

        if (trendingError) throw trendingError;

        // Fetch personalized recommendations
        const { data: recommended, error: recommendedError } = await supabase
          .rpc('get_personalized_recommendations', { user_id: user.id })
          .limit(5);

        if (recommendedError) throw recommendedError;

        // Fetch recent activities
        const { data: recentActivities, error: activitiesError } = await supabase
          .from('user_activity')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (activitiesError) throw activitiesError;

        // Fetch achievements
        const { data: achievements, error: achievementsError } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (achievementsError) throw achievementsError;

        // Fetch collections
        const { data: collections, error: collectionsError } = await supabase
          .from('recipe_collections')
          .select('*, recipes:collection_recipes(*)')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(3);

        if (collectionsError) throw collectionsError;

        setStats({
          ...basicStats,
          recentAchievements: achievements || [],
          collections: collections || []
        });
        setTrendingRecipes(trending || []);
        setRecommendedRecipes(recommended || []);
        setActivities(recentActivities || []);
        setWeeklyProgress(Math.min((basicStats.weeklyStreak / 7) * 100, 100));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <PageHeader
            icon={Sparkles}
            title={`Welcome back, ${user?.user_metadata?.full_name?.split(' ')[0] || 'Chef'}!`}
            description="Your culinary journey continues"
          />
          <div className="mt-2 flex items-center gap-2">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Badge variant="outline" className="text-sm cursor-help">
                  <Award className="w-3 h-3 mr-1" />
                  {stats.chefProgress.level}
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold">Your Chef Progress</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>XP Progress</span>
                      <span>{stats.chefProgress.current_xp} / {stats.chefProgress.xp_to_next_level} XP</span>
                    </div>
                    <Progress value={(stats.chefProgress.current_xp / stats.chefProgress.xp_to_next_level) * 100} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Earn XP by creating recipes, getting likes, and completing challenges!
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Badge variant="outline" className="text-sm cursor-help">
                  <Flame className="w-3 h-3 mr-1" />
                  {stats.weeklyStreak} day streak
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold">Cooking Streak</h4>
                  <p className="text-sm">Keep your streak going by cooking or creating recipes daily!</p>
                  <div className="text-xs text-muted-foreground">
                    Longest streak: {stats.chefProgress.longest_streak} days
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
        <Button onClick={() => navigate('/create-recipe')} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Create Recipe
        </Button>
      </motion.div>

      {/* Weekly Challenge Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Weekly Challenge
            </CardTitle>
            <CardDescription>{stats.weeklyChallenge.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">{stats.weeklyChallenge.description}</p>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Progress</div>
                  <Progress 
                    value={(stats.chefProgress.weekly_challenge_progress / stats.chefProgress.weekly_challenge_total) * 100} 
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {stats.chefProgress.weekly_challenge_progress} / {stats.chefProgress.weekly_challenge_total}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {stats.weeklyChallenge.participants_count} chefs participating
                </span>
                <span className="text-primary font-medium">
                  +{stats.weeklyChallenge.xp_reward} XP Reward
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recipes Created</p>
                <h3 className="text-2xl font-bold">{stats.recipesCreated}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Likes</p>
                <h3 className="text-2xl font-bold">{stats.totalLikes}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Meal Plans</p>
                <h3 className="text-2xl font-bold">{stats.savedPlansCount}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Utensils className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Favorite Cuisine</p>
                <h3 className="text-lg font-semibold capitalize">{stats.favoriteCuisine || 'None'}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Progress section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Weekly Progress
            </CardTitle>
            <CardDescription>Track your cooking journey this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={weeklyProgress} />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{stats.weeklyStreak}/7 days</span>
                <span>{weeklyProgress}% complete</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>Your latest culinary accomplishments</CardDescription>
              </div>
              <Button variant="outline" onClick={() => navigate('/achievements')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.recentAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  isNew={new Date(achievement.completed_at || '').getTime() > Date.now() - 24 * 60 * 60 * 1000}
                />
              ))}
              {stats.recentAchievements.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-3 text-center py-4">
                  No achievements yet. Start cooking to earn badges!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Collections Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="w-5 h-5 text-primary" />
                  Your Collections
                </CardTitle>
                <CardDescription>Organize your favorite recipes</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/collections')}>
                  View All
                </Button>
                <Button onClick={() => navigate('/collections/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Collection
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.collections.map((collection) => (
                <RecipeCollection
                  key={collection.id}
                  collection={collection}
                  onDelete={async () => {
                    try {
                      await supabase
                        .from('recipe_collections')
                        .delete()
                        .eq('id', collection.id);
                      
                      setStats(prev => ({
                        ...prev,
                        collections: prev.collections.filter(c => c.id !== collection.id)
                      }));

                      toast({
                        title: "Collection Deleted",
                        description: "Your collection has been deleted successfully.",
                      });
                    } catch (error) {
                      console.error('Error deleting collection:', error);
                      toast({
                        title: "Error",
                        description: "Failed to delete collection. Please try again.",
                        variant: "destructive",
                      });
                    }
                  }}
                />
              ))}
              {stats.collections.length === 0 && (
                <div className="col-span-3 text-center py-8">
                  <div className="space-y-3">
                    <Folder className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div className="space-y-1">
                      <h3 className="font-medium">No Collections Yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Create collections to organize your favorite recipes
                      </p>
                    </div>
                    <Button onClick={() => navigate('/collections/new')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Collection
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs defaultValue="discover" className="space-y-4">
          <TabsList>
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended for You</CardTitle>
                  <CardDescription>Based on your preferences and history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendedRecipes.map(recipe => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      showAuthor={true}
                      onLike={() => {
                        setStats(prev => ({
                          ...prev,
                          totalLikes: prev.totalLikes + 1,
                          chefProgress: {
                            ...prev.chefProgress,
                            current_xp: prev.chefProgress.current_xp + 10
                          }
                        }));
                      }}
                    />
                  ))}
                  <Button variant="ghost" className="w-full" onClick={() => navigate('/discover')}>
                    View More Recommendations
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Get started with these actions</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Button variant="outline" className="justify-start h-auto py-4" onClick={() => navigate('/meal-plan')}>
                    <div className="flex items-center gap-4">
                      <Calendar className="w-5 h-5" />
                      <div className="text-left">
                        <h4 className="font-semibold">Create Meal Plan</h4>
                        <p className="text-sm text-muted-foreground">Plan your weekly meals</p>
                      </div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-4" onClick={() => navigate('/search')}>
                    <div className="flex items-center gap-4">
                      <Search className="w-5 h-5" />
                      <div className="text-left">
                        <h4 className="font-semibold">Search Recipes</h4>
                        <p className="text-sm text-muted-foreground">Find recipes by ingredients</p>
                      </div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-4" onClick={() => navigate('/community')}>
                    <div className="flex items-center gap-4">
                      <Users className="w-5 h-5" />
                      <div className="text-left">
                        <h4 className="font-semibold">Join Community</h4>
                        <p className="text-sm text-muted-foreground">Connect with other chefs</p>
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <Card>
              <CardHeader>
                <CardTitle>Trending Recipes</CardTitle>
                <CardDescription>Popular recipes from the community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {trendingRecipes.map(recipe => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      showAuthor={true}
                      onLike={() => {
                        setStats(prev => ({
                          ...prev,
                          totalLikes: prev.totalLikes + 1,
                          chefProgress: {
                            ...prev.chefProgress,
                            current_xp: prev.chefProgress.current_xp + 10
                          }
                        }));
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div key={activity.id} className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};