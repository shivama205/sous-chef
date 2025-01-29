import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Folder, MoreVertical, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Recipe {
  id: string;
  title: string;
  image_url?: string;
}

interface Collection {
  id: string;
  title: string;
  description: string;
  recipes: Recipe[];
  created_at: string;
  updated_at: string;
}

interface RecipeCollectionProps {
  collection: Collection;
  onDelete: () => Promise<void>;
}

export const RecipeCollection = ({ collection, onDelete }: RecipeCollectionProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/collections/${collection.id}`);
  };

  return (
    <Card className="group relative hover:shadow-md transition-shadow">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{collection.title}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Collection
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2">
          {collection.description || 'No description provided'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recipe Preview Grid */}
        <div className="grid grid-cols-3 gap-2 h-24">
          {collection.recipes.slice(0, 3).map((recipe) => (
            <div
              key={recipe.id}
              className="relative rounded-md overflow-hidden bg-muted"
            >
              {recipe.image_url ? (
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <Folder className="w-6 h-6 text-primary/40" />
                </div>
              )}
            </div>
          ))}
          {collection.recipes.length === 0 && (
            <div className="col-span-3 flex items-center justify-center h-full bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">No recipes yet</p>
            </div>
          )}
        </div>

        {/* Collection Info */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary">
            {collection.recipes.length} {collection.recipes.length === 1 ? 'recipe' : 'recipes'}
          </Badge>
          <Button variant="ghost" size="sm" onClick={handleClick}>
            View Collection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
