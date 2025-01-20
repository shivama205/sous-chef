import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Recipe } from "@/types/recipeFinder";
import { 
  ChefHat, 
  Timer, 
  UtensilsCrossed, 
  ListChecks, 
  Dumbbell, 
  ArrowLeft,
  RefreshCw,
  Share2,
  Download,
  Trash2,
  X
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { MealPlanLoadingOverlay } from "@/components/MealPlanLoadingOverlay";
import html2canvas from "html2canvas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginDialog } from "@/components/LoginDialog";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id || !user) {
        navigate("/recipe-finder");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("saved_recipes")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!data) {
          toast({
            title: "Recipe not found",
            description: "The recipe you're looking for doesn't exist.",
            variant: "destructive",
          });
          navigate("/recipe-finder");
          return;
        }

        setRecipe({
          id: data.id,
          meal_name: data.meal_name,
          cooking_time: data.cooking_time,
          ingredients: data.ingredients,
          instructions: data.instructions,
          nutritional_value: data.nutritional_value,
          created_at: data.created_at,
        });
      } catch (error) {
        console.error("Error fetching recipe:", error);
        toast({
          title: "Error",
          description: "Failed to load recipe details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user, navigate, toast]);

  const handleShare = async () => {
    if (!recipe) return;

    try {
      // Generate a unique share ID
      const shareId = crypto.randomUUID();
      
      // Save the recipe reference to shared_recipes table
      const { error } = await supabase
        .from("shared_recipes")
        .insert({
          share_id: shareId,
          recipe_id: recipe.id,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      const shareUrl = `${window.location.origin}/shared/recipe/${shareId}`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: recipe.meal_name,
            text: "Check out this delicious recipe I found on SousChef!",
            url: shareUrl,
          });
        } catch (error) {
          // Fallback to copying to clipboard
          await copyToClipboard(shareUrl);
        }
      } else {
        // Fallback for browsers that don't support Web Share API
        await copyToClipboard(shareUrl);
      }
    } catch (error) {
      console.error('Error sharing recipe:', error);
      toast({
        title: "Error",
        description: "Failed to create share link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Link copied!",
        description: "Share the link with your friends and family.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy link",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const generatePreview = async () => {
    if (!downloadRef.current) return;
    setIsGeneratingPreview(true);

    try {
      const canvas = await html2canvas(downloadRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      const image = canvas.toDataURL('image/png');
      setPreviewImage(image);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating preview:', error);
      toast({
        title: "Error",
        description: "Failed to generate preview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleDownload = async () => {
    if (window.innerWidth >= 768) { // Non-mobile view
      if (!previewImage) {
        await generatePreview();
      } else {
        const link = document.createElement('a');
        link.href = previewImage;
        link.download = `${recipe?.meal_name || 'recipe'}.png`;
        link.click();
        setShowPreview(false);
      }
    } else { // Mobile view - direct download
      if (!downloadRef.current) return;
      try {
        const canvas = await html2canvas(downloadRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
        });
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `${recipe?.meal_name || 'recipe'}.png`;
        link.click();
      } catch (error) {
        console.error('Error downloading recipe:', error);
        toast({
          title: "Error",
          description: "Failed to download recipe. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from("saved_recipes")
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Recipe deleted",
        description: "Your recipe has been deleted successfully.",
      });
      navigate('/profile');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast({
        title: "Error",
        description: "Failed to delete recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return <MealPlanLoadingOverlay isLoading={true} />;
  }

  if (!recipe) {
    return null;
  }

  return (
    <BaseLayout>
      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-red-600 hover:text-red-600"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Recipe Content */}
        <div ref={downloadRef} className="space-y-6 bg-white p-6 rounded-lg">
          {/* Recipe Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold">{recipe.meal_name}</h1>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Timer className="w-4 h-4" />
              <span>Cooking Time: {recipe.cooking_time} minutes</span>
            </div>
            {recipe.created_at && (
              <p className="text-sm text-muted-foreground">
                Saved on {new Date(recipe.created_at).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>

          {/* Recipe Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ingredients Card */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Ingredients</h2>
              </div>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0 mt-2" />
                    <span className="text-gray-600">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Instructions Card */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <ListChecks className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Instructions</h2>
              </div>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-medium text-primary/60 flex-shrink-0">
                      {i + 1}.
                    </span>
                    <span className="text-gray-600">{instruction}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>

          {/* Nutritional Info Card */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Nutritional Value</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-primary/5 rounded-lg p-3">
                <p className="text-sm text-gray-600">Calories</p>
                <p className="text-lg font-semibold text-primary">
                  {recipe.nutritional_value.calories}
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-3">
                <p className="text-sm text-gray-600">Protein</p>
                <p className="text-lg font-semibold text-primary">
                  {recipe.nutritional_value.protein}g
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-3">
                <p className="text-sm text-gray-600">Carbs</p>
                <p className="text-lg font-semibold text-primary">
                  {recipe.nutritional_value.carbs}g
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-3">
                <p className="text-sm text-gray-600">Fat</p>
                <p className="text-lg font-semibold text-primary">
                  {recipe.nutritional_value.fat}g
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Download Preview</DialogTitle>
              <DialogDescription>
                Preview your recipe before downloading
              </DialogDescription>
            </DialogHeader>
            <div className="relative">
              {previewImage && (
                <img 
                  src={previewImage} 
                  alt="Recipe preview" 
                  className="w-full h-auto rounded-lg"
                />
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDownload}
              >
                Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Recipe</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this recipe? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Login Dialog */}
        <LoginDialog
          open={loginDialogOpen}
          onOpenChange={setLoginDialogOpen}
        />
      </div>
    </BaseLayout>
  );
} 