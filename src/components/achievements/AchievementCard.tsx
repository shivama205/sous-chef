import { Achievement } from '@/types/gamification';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Trophy, Star, Medal, Award } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement & {
    template: {
      title: string;
      description: string;
      category: string;
      icon: string;
      xp_reward: number;
      total_required: number;
    };
  };
  isNew?: boolean;
}

const CATEGORY_ICONS = {
  recipes: Trophy,
  social: Star,
  streaks: Medal,
  challenges: Award,
  collections: Star,
} as const;

export const AchievementCard = ({ achievement, isNew }: AchievementCardProps) => {
  const Icon = CATEGORY_ICONS[achievement.template.category as keyof typeof CATEGORY_ICONS] || Trophy;
  const progress = (achievement.progress / achievement.template.total_required) * 100;

  return (
    <Card className={`relative ${achievement.completed ? 'bg-primary/5' : ''}`}>
      {isNew && (
        <Badge 
          variant="secondary" 
          className="absolute -top-2 -right-2 bg-primary text-primary-foreground"
        >
          New!
        </Badge>
      )}
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            achievement.completed ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{achievement.template.title}</h3>
            <p className="text-xs text-muted-foreground">{achievement.template.description}</p>
          </div>
        </div>
        
        {!achievement.completed && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{achievement.progress} / {achievement.template.total_required}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        <div className="flex justify-between items-center text-xs">
          <Badge variant="outline">
            {achievement.template.category}
          </Badge>
          <span className="text-primary font-medium">
            +{achievement.template.xp_reward} XP
          </span>
        </div>

        {achievement.completed && achievement.completed_at && (
          <p className="text-xs text-muted-foreground">
            Completed on {new Date(achievement.completed_at).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}; 