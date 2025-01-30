import { Recipe } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Clock, Users } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  showAuthor?: boolean;
}

export const RecipeCard = ({ recipe, showAuthor = true }: RecipeCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      {recipe.image_url && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{recipe.title}</CardTitle>
        {showAuthor && recipe.user && (
          <CardDescription>
            By {recipe.user.full_name}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {recipe.difficulty && (
            <div className="flex items-center gap-1">
              <ChefHat className="w-4 h-4" />
              <span className="capitalize">{recipe.difficulty}</span>
            </div>
          )}
          {recipe.cooking_time && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cooking_time} mins</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} servings</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};