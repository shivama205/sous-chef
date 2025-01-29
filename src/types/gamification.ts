export type ChefLevel = 
  | 'Novice' 
  | 'Amateur' 
  | 'Line Cook' 
  | 'Sous Chef' 
  | 'Head Chef' 
  | 'Executive Chef' 
  | 'Master Chef';

export type AchievementCategory = 
  | 'recipes' 
  | 'social' 
  | 'streaks' 
  | 'challenges' 
  | 'collections';

export interface AchievementTemplate {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  xp_reward: number;
  total_required: number;
}

export interface Achievement {
  id: string;
  user_id: string;
  template_id: string;
  progress: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  template: AchievementTemplate;
}

export interface ChefProgress {
  level: ChefLevel;
  current_xp: number;
  xp_to_next_level: number;
  total_xp: number;
  achievements: Achievement[];
  weekly_challenge_progress: number;
  weekly_challenge_total: number;
  streak_days: number;
  longest_streak: number;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  start_date: string;
  end_date: string;
  participants_count: number;
  completed_count: number;
  user_completed: boolean;
}

export const XP_ACTIONS = {
  CREATE_RECIPE: 100,
  RECEIVE_LIKE: 10,
  COMPLETE_CHALLENGE: 200,
  MAINTAIN_STREAK: 50,
  SHARE_RECIPE: 20,
  SAVE_RECIPE: 5,
  CREATE_COLLECTION: 30,
  FOLLOW_CHEF: 15,
  RECEIVE_FOLLOW: 25,
  COMMENT: 5,
  RECEIVE_COMMENT: 10,
  COMPLETE_PROFILE: 50,
  FIRST_RECIPE: 150,
} as const; 