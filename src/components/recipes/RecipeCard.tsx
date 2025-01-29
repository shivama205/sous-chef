import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Recipe } from '@/types/recipe';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import {
  Heart,
  Share2,
  Clock,
  ChefHat,
  Bookmark,
  Star,
  Users,
  Timer,
  Utensils
} from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  showAuthor?: boolean;
  onSave?: () => void;
  onLike?: () => void;
}

export const RecipeCard = ({ recipe, showAuthor = true, onSave, onLike }: RecipeCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('recipe_likes')
        .upsert({ recipe_id: recipe.id, user_id: user?.id });

      if (error) throw error;

      setIsLiked(true);
      onLike?.();
      toast({
        title: "Recipe Liked!",
        description: "This recipe has been added to your likes.",
      });
    } catch (error) {
      console.error('Error liking recipe:', error);
      toast({
        title: "Error",
        description: "Failed to like recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('saved_recipes_by_users')
        .upsert({ recipe_id: recipe.id, user_id: user?.id });

      if (error) throw error;

      setIsSaved(true);
      onSave?.();
      toast({
        title: "Recipe Saved!",
        description: "This recipe has been added to your collection.",
      });
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.share({
        title: recipe.meal_name,
        text: recipe.description,
        url: window.location.origin + '/recipe/' + recipe.id,
      });
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <Card
        className="group relative cursor-pointer hover:shadow-lg transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/recipe/${recipe.id}`)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Recipe Image or Icon */}
            <div className="w-24 h-24 rounded-lg bg-primary/10 flex items-center justify-center relative overflow-hidden">
              {recipe.image_url ? (
                <img
                  src={recipe.image_url}
                  alt={recipe.meal_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Utensils className="w-12 h-12 text-primary" />
              )}
              <div className={`absolute top-0 right-0 w-3 h-3 rounded-full ${getDifficultyColor(recipe.difficulty)}`} />
            </div>

            {/* Recipe Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-base group-hover:text-primary truncate">
                  {recipe.meal_name}
                </h3>
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleLike}
                        >
                          <Heart
                            className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isLiked ? 'Unlike' : 'Like'} recipe</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleSave}
                        >
                          <Bookmark
                            className={`w-4 h-4 ${isSaved ? 'fill-primary text-primary' : ''}`}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isSaved ? 'Unsave' : 'Save'} recipe</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleShare}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share recipe</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {recipe.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                {recipe.cuisine_type?.map((cuisine, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {cuisine}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  {recipe.cooking_time} mins
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {recipe.servings} servings
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {recipe.likes || 0} likes
                </div>
              </div>

              {showAuthor && recipe.user && (
                <div className="flex items-center gap-2 mt-3">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={recipe.user.avatar_url} />
                    <AvatarFallback>
                      {recipe.user.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    by {recipe.user.full_name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Preview Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/90 flex items-center justify-center"
              >
                <Button variant="outline" onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickView(true);
                }}>
                  Quick Preview
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Quick View Dialog */}
      <Dialog open={showQuickView} onOpenChange={setShowQuickView}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{recipe.meal_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{recipe.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Ingredients</h4>
                <ul className="list-disc list-inside">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-sm">{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Instructions</h4>
                <ol className="list-decimal list-inside">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="text-sm mb-1">{instruction}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}; 
