import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Medal, Award, Crown } from 'lucide-react';
import { Achievement } from '@/types/gamification';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { supabase } from '@/lib/supabase';

export const AchievementsPage = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('user_achievements')
          .select(`
            *,
            template:achievement_templates(*)
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        setAchievements(data || []);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const getAchievementsByCategory = (category: string) => {
    return achievements.filter(a => a.template.category === category);
  };

  const calculateProgress = (category: string) => {
    const categoryAchievements = getAchievementsByCategory(category);
    if (categoryAchievements.length === 0) return 0;

    const completed = categoryAchievements.filter(a => a.completed).length;
    return (completed / categoryAchievements.length) * 100;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <PageHeader
        icon={Trophy}
        title="Achievements"
        description="Track your culinary accomplishments and earn rewards"
      />

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Trophy className="w-8 h-8 mx-auto text-primary mb-2" />
              <h3 className="font-semibold">Total Achievements</h3>
              <p className="text-2xl font-bold">{achievements.filter(a => a.completed).length}/{achievements.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Star className="w-8 h-8 mx-auto text-primary mb-2" />
              <h3 className="font-semibold">Recipe Achievements</h3>
              <Progress value={calculateProgress('recipes')} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Medal className="w-8 h-8 mx-auto text-primary mb-2" />
              <h3 className="font-semibold">Social Achievements</h3>
              <Progress value={calculateProgress('social')} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Crown className="w-8 h-8 mx-auto text-primary mb-2" />
              <h3 className="font-semibold">Challenge Achievements</h3>
              <Progress value={calculateProgress('challenges')} className="mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Categories */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="streaks">Streaks</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isNew={new Date(achievement.completed_at || '').getTime() > Date.now() - 24 * 60 * 60 * 1000}
              />
            ))}
          </div>
        </TabsContent>

        {['recipes', 'social', 'streaks', 'collections', 'challenges'].map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getAchievementsByCategory(category).map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  isNew={new Date(achievement.completed_at || '').getTime() > Date.now() - 24 * 60 * 60 * 1000}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}; 