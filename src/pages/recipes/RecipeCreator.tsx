import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Image as ImageIcon, Plus, Sparkles, AlertCircle, X, Loader2 } from "lucide-react";
import type { Recipe, CuisineType } from "@/types/recipe";
import { PageHeader } from "@/components/ui/PageHeader";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check } from "lucide-react"

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  notes?: string;
}

// Update cuisine options to use CuisineType
const CUISINE_OPTIONS: Array<{ value: CuisineType; label: string }> = [
  { value: 'italian', label: 'Italian' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'indian', label: 'Indian' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'thai', label: 'Thai' },
  { value: 'french', label: 'French' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'american', label: 'American' },
  { value: 'korean', label: 'Korean' },
  { value: 'vietnamese', label: 'Vietnamese' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'greek', label: 'Greek' },
  { value: 'middle_eastern', label: 'Middle Eastern' },
  { value: 'caribbean', label: 'Caribbean' },
  { value: 'brazilian', label: 'Brazilian' },
  { value: 'fusion', label: 'Fusion' }
];

export default function RecipeCreator() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    meal_name: "",
    description: "",
    ingredients: [],
    instructions: [],
    cooking_time: 0,
    servings: 0,
    difficulty: "medium",
    cuisine_type: [],
    is_public: true,
  });
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", quantity: "", unit: "", notes: "" }]);

  // Add validation state
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation helper functions
  const validateField = (field: string, value: any) => {
    switch (field) {
      case 'meal_name':
        return !value || value.length < 3 ? 'Recipe name must be at least 3 characters' : '';
      case 'description':
        return !value || value.length < 10 ? 'Description must be at least 10 characters' : '';
      case 'cooking_time':
        return !value || value < 1 ? 'Cooking time must be at least 1 minute' : '';
      case 'servings':
        return !value || value < 1 ? 'Number of servings must be at least 1' : '';
      case 'ingredients':
        return (!value || value.length === 0) ? 'At least one ingredient is required' : '';
      case 'instructions':
        return (!value || value.length === 0) ? 'At least one instruction step is required' : '';
      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, recipe[field as keyof Recipe]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "", notes: "" }]);
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
    
    const formattedIngredients = newIngredients.map(ing => 
      `${ing.quantity} ${ing.unit} ${ing.name}${ing.notes ? ` (${ing.notes})` : ''}`
    ).filter(ing => ing.trim() !== '');
    
    setRecipe(prev => ({ ...prev, ingredients: formattedIngredients }));
    
    // Validate ingredients
    const error = validateField('ingredients', formattedIngredients);
    setErrors(prev => ({ ...prev, ingredients: error }));
  };

  const handleGenerateWithAI = async (field: 'description' | 'instructions' | 'ingredients') => {
    try {
      // Validation checks before making API call
      if (field === 'description' && !recipe.meal_name) {
        toast({
          title: "Missing Information",
          description: "Recipe name is required to generate a description.",
          variant: "destructive",
        });
        return;
      }

      if (field === 'ingredients' && (!recipe.meal_name || !recipe.servings)) {
        toast({
          title: "Missing Information",
          description: "Recipe name and number of servings are required to generate ingredients.",
          variant: "destructive",
        });
        return;
      }

      if (field === 'instructions' && (!recipe.ingredients || recipe.ingredients.length === 0)) {
        toast({
          title: "Missing Information",
          description: "Ingredients list is required to generate instructions.",
          variant: "destructive",
        });
        return;
      }

      setIsGenerating(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recipes/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          field,
          currentRecipe: recipe
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details?.[0]?.message || 'Failed to generate content');
      }

      const { success, data } = await response.json();
      
      if (!success) {
        throw new Error('Generation failed');
      }

      // Update the form based on the field
      switch (field) {
        case 'description':
          setRecipe(prev => ({ ...prev, description: data || '' }));
          break;
        
        case 'ingredients':
          // Ensure each ingredient has all required fields with default values
          const formattedIngredients = (data || []).map((ing: Partial<Ingredient>) => ({
            name: ing.name || '',
            quantity: ing.quantity || '',
            unit: ing.unit || '',
            notes: ing.notes || ''
          }));
          
          // If no ingredients were generated, keep at least one empty ingredient
          setIngredients(formattedIngredients.length > 0 ? formattedIngredients : [{ 
            name: '', 
            quantity: '', 
            unit: '', 
            notes: '' 
          }]);

          // Update recipe's ingredients array
          const ingredientStrings = formattedIngredients.map(ing => 
            `${ing.quantity} ${ing.unit} ${ing.name}${ing.notes ? ` (${ing.notes})` : ''}`
          ).filter(str => str.trim() !== '  '); // Remove empty strings
          
          setRecipe(prev => ({ ...prev, ingredients: ingredientStrings }));
          break;
        
        case 'instructions':
          // The API returns an array of instructions, so we can use it directly
          setRecipe(prev => ({ 
            ...prev, 
            instructions: Array.isArray(data) ? data : []
          }));
          break;
      }

      toast({
        title: "Generated Successfully",
        description: `Recipe ${field} has been generated.`,
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Disable AI generation buttons based on validation
  const canGenerateDescription = Boolean(recipe.meal_name && recipe.meal_name.length >= 3);
  const canGenerateIngredients = Boolean(recipe.meal_name && recipe.meal_name.length >= 3 && recipe.servings && recipe.servings >= 1);
  const canGenerateInstructions = Boolean(recipe.ingredients && recipe.ingredients.length > 0);

  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedImage(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  // Handle image upload
  const uploadImage = async (recipeId: string): Promise<string | null> => {
    if (!selectedImage) return null;
    
    const fileExt = selectedImage.name.split('.').pop();
    const filePath = `${recipeId}/${Math.random()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(filePath, selectedImage);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    // Validate all fields
    const allFields = ['meal_name', 'description', 'cooking_time', 'servings', 'ingredients', 'instructions'];
    const newErrors: Record<string, string> = {};
    allFields.forEach(field => {
      const error = validateField(field, recipe[field as keyof Recipe]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("recipes")
        .insert([{ ...recipe, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      // Upload image if selected
      if (selectedImage && data) {
        const imageUrl = await uploadImage(data.id);
        if (imageUrl) {
          await supabase
            .from("recipes")
            .update({ image_url: imageUrl })
            .eq("id", data.id);
        }
      }

      toast({
        title: "Success",
        description: "Recipe created successfully!",
      });

      navigate(`/recipe/${data.id}`);
    } catch (error) {
      console.error("Error creating recipe:", error);
      toast({
        title: "Error",
        description: "Failed to create recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper component for validation feedback
  const ValidationMessage = ({ field }: { field: string }) => {
    if (!touched[field] || !errors[field]) return null;
    return (
      <div className="flex items-center gap-1 text-destructive text-sm mt-1">
        <AlertCircle className="w-4 h-4" />
        <span>{errors[field]}</span>
      </div>
    );
  };

  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          icon={ChefHat}
          title="Create Recipe"
          description="Share your culinary creations with the community"
        />

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-8 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Start with the basic details of your recipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recipe-name" className="flex items-center justify-between">
                  Recipe Name
                  {touched.meal_name && (
                    <span className={cn(
                      "text-xs",
                      errors.meal_name ? "text-destructive" : "text-green-500"
                    )}>
                      {errors.meal_name ? errors.meal_name : "✓ Valid"}
                    </span>
                  )}
                </Label>
                <Input
                  id="recipe-name"
                  placeholder="e.g., Classic Margherita Pizza"
                  value={recipe.meal_name}
                  onChange={(e) => {
                    setRecipe((prev) => ({ ...prev, meal_name: e.target.value }));
                    const error = validateField('meal_name', e.target.value);
                    setErrors(prev => ({ ...prev, meal_name: error }));
                  }}
                  onBlur={() => handleBlur('meal_name')}
                  className={cn(
                    touched.meal_name && (errors.meal_name ? "border-destructive" : "border-green-500")
                  )}
                  required
                />
                <ValidationMessage field="meal_name" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Description</Label>
                  <div className="flex items-center gap-2">
                    {touched.description && (
                      <span className={cn(
                        "text-xs",
                        errors.description ? "text-destructive" : "text-green-500"
                      )}>
                        {errors.description ? errors.description : "✓ Valid"}
                      </span>
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-primary"
                            onClick={() => handleGenerateWithAI('description')}
                            disabled={isGenerating || !canGenerateDescription}
                          >
                            {isGenerating ? (
                              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                            ) : (
                              <Sparkles className="w-4 h-4 mr-2" />
                            )}
                            Generate with AI
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {!canGenerateDescription 
                            ? "Recipe name is required to generate description" 
                            : "Generate a description using AI"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe your recipe in a few sentences..."
                  value={recipe.description}
                  onChange={(e) => {
                    setRecipe((prev) => ({ ...prev, description: e.target.value }));
                    const error = validateField('description', e.target.value);
                    setErrors(prev => ({ ...prev, description: error }));
                  }}
                  onBlur={() => handleBlur('description')}
                  className={cn(
                    touched.description && (errors.description ? "border-destructive" : "border-green-500")
                  )}
                  required
                />
                <ValidationMessage field="description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cooking-time">Cooking Time (minutes)</Label>
                  <Input
                    id="cooking-time"
                    type="number"
                    placeholder="45"
                    value={recipe.cooking_time || ""}
                    onChange={(e) =>
                      setRecipe((prev) => ({
                        ...prev,
                        cooking_time: parseInt(e.target.value),
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servings">Servings</Label>
                  <Input
                    id="servings"
                    type="number"
                    placeholder="4"
                    value={recipe.servings || ""}
                    onChange={(e) =>
                      setRecipe((prev) => ({
                        ...prev,
                        servings: parseInt(e.target.value),
                      }))
                    }
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
              <CardDescription>
                List all ingredients needed for your recipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="flex items-center gap-2">
                  Ingredients List
                  {touched.ingredients && (
                    <span className={cn(
                      "text-xs",
                      errors.ingredients ? "text-destructive" : "text-green-500"
                    )}>
                      {errors.ingredients ? errors.ingredients : "✓ Valid"}
                    </span>
                  )}
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-primary"
                        onClick={() => handleGenerateWithAI('ingredients')}
                        disabled={isGenerating || !canGenerateIngredients}
                      >
                        {isGenerating ? (
                          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        Generate with AI
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {!canGenerateIngredients 
                        ? "Recipe name and servings are required to generate ingredients" 
                        : "Generate ingredients using AI"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 relative group">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      const newIngredients = ingredients.filter((_, i) => i !== index);
                      setIngredients(newIngredients);
                      // Update recipe ingredients and validate
                      const formattedIngredients = newIngredients.map(ing => 
                        `${ing.quantity} ${ing.unit} ${ing.name}${ing.notes ? ` (${ing.notes})` : ''}`
                      ).filter(ing => ing.trim() !== '');
                      setRecipe(prev => ({ ...prev, ingredients: formattedIngredients }));
                      const error = validateField('ingredients', formattedIngredients);
                      setErrors(prev => ({ ...prev, ingredients: error }));
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="Ingredient"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      placeholder="Amount"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Input
                      placeholder="g, ml, cups"
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes (Optional)</Label>
                    <Input
                      placeholder="e.g., finely chopped"
                      value={ingredient.notes}
                      onChange={(e) => handleIngredientChange(index, 'notes', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddIngredient}
                className="w-full mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Ingredient
              </Button>
              <ValidationMessage field="ingredients" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
              <CardDescription>
                Write step-by-step instructions for your recipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="flex items-center gap-2">
                  Step-by-Step Instructions
                  {touched.instructions && (
                    <span className={cn(
                      "text-xs",
                      errors.instructions ? "text-destructive" : "text-green-500"
                    )}>
                      {errors.instructions ? errors.instructions : "✓ Valid"}
                    </span>
                  )}
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-primary"
                        onClick={() => handleGenerateWithAI('instructions')}
                        disabled={isGenerating || !canGenerateInstructions}
                      >
                        {isGenerating ? (
                          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        Generate with AI
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {!canGenerateInstructions 
                        ? "Ingredients list is required to generate instructions" 
                        : "Generate instructions using AI"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="space-y-4">
                {recipe.instructions?.map((instruction, index) => (
                  <div key={index} className="flex gap-4 items-start group relative">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <Textarea
                        value={instruction}
                        onChange={(e) => {
                          const newInstructions = [...(recipe.instructions || [])];
                          newInstructions[index] = e.target.value;
                          setRecipe(prev => ({
                            ...prev,
                            instructions: newInstructions.filter(Boolean)
                          }));
                          const error = validateField('instructions', newInstructions);
                          setErrors(prev => ({ ...prev, instructions: error }));
                        }}
                        className="min-h-[80px]"
                        placeholder={`Step ${index + 1}...`}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-10"
                      onClick={() => {
                        const newInstructions = recipe.instructions?.filter((_, i) => i !== index) || [];
                        setRecipe(prev => ({
                          ...prev,
                          instructions: newInstructions
                        }));
                        const error = validateField('instructions', newInstructions);
                        setErrors(prev => ({ ...prev, instructions: error }));
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newInstructions = [...(recipe.instructions || []), ''];
                    setRecipe(prev => ({
                      ...prev,
                      instructions: newInstructions
                    }));
                  }}
                  className="w-full mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              </div>
              <ValidationMessage field="instructions" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recipe Image</CardTitle>
              <CardDescription>
                Add a beautiful image of your recipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="recipe-image"
                    className={cn(
                      "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer",
                      "hover:bg-accent/5 transition-colors",
                      imagePreview ? "border-primary" : "border-border"
                    )}
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview}
                          alt="Recipe preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedImage(null);
                            setImagePreview(null);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG or WEBP (MAX. 5MB)
                        </p>
                      </div>
                    )}
                    <input
                      id="recipe-image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>
                Add more details to help others discover your recipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Cuisine Types</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {recipe.cuisine_type && recipe.cuisine_type.length > 0 ? (
                        <span>
                          {recipe.cuisine_type
                            .map(cuisine => 
                              CUISINE_OPTIONS.find(opt => opt.value === cuisine)?.label
                            )
                            .join(', ')}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Select cuisines...</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search cuisines..." />
                      <CommandEmpty>No cuisine found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {CUISINE_OPTIONS.map((cuisine) => (
                          <CommandItem
                            key={cuisine.value}
                            onSelect={() => {
                              setRecipe(prev => {
                                const cuisines = prev.cuisine_type || [];
                                const newCuisines = cuisines.includes(cuisine.value)
                                  ? cuisines.filter(c => c !== cuisine.value)
                                  : [...cuisines, cuisine.value];
                                return { ...prev, cuisine_type: newCuisines };
                              });
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                recipe.cuisine_type?.includes(cuisine.value)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {cuisine.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <select
                  id="difficulty"
                  value={recipe.difficulty}
                  onChange={(e) =>
                    setRecipe((prev) => ({
                      ...prev,
                      difficulty: e.target.value as Recipe["difficulty"],
                    }))
                  }
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Recipe...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Recipe
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </BaseLayout>
  );
} 