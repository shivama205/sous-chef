// User and Profile types
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  email_verified: boolean;
  email_notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
  stats?: UserStats;
  followers_count?: number;
  following_count?: number;
  recipes_count?: number;
}

export interface UserStats {
  user_id: string;
  total_xp: number;
  current_xp: number;
  level: string;
  longest_streak: number;
  current_streak: number;
  last_activity_date: string | null;
  updated_at: string;
}

export interface ProfileStats {
  total_recipes: number;
  total_likes_received: number;
  total_views: number;
  average_rating: number;
  followers_count: number;
  following_count: number;
}

// Recipe types
export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  cooking_time: number | null;
  servings: number | null;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user?: Profile;
  metadata?: RecipeMetadata;
  tags?: Tag[];
}

export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface RecipeInstruction {
  step_number: number;
  description: string;
  image_url?: string;
  time_minutes?: number;
}

export interface RecipeMetadata {
  recipe_id: string;
  likes_count: number;
  saves_count: number;
  views_count: number;
  rating_avg: number;
  ratings_count: number;
  updated_at: string;
}

// Collection types
export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user?: Profile;
  recipes?: {
    recipe: Recipe;
    added_at: string;
  }[];
  recipes_count?: number;
}

// Tag types
export interface Tag {
  id: string;
  name: string;
  type: string;
  description: string | null;
  created_at: string;
}

// Comment types
export interface Comment {
  id: string;
  recipe_id: string;
  user_id: string;
  content: string;
  rating: number | null;
  created_at: string;
  updated_at: string;
  user?: Profile;
}

// Pagination and filter types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface RecipeFilters extends PaginationParams {
  userId?: string;
  search?: string;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  isPublic?: boolean;
}

export interface CollectionFilters extends PaginationParams {
  userId?: string;
  search?: string;
  isPublic?: boolean;
}

// Analytics types
export interface UserRecipeStats {
  total_recipes: number;
  total_likes_received: number;
  total_saves_received: number;
  average_rating: number;
  total_views: number;
  recipes_by_difficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  top_recipes: {
    id: string;
    title: string;
    views: number;
    likes: number;
    rating: number;
  }[];
} 