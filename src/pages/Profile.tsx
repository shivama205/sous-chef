import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ChefHat, Calendar, Target, Brain, Sparkles, Dumbbell, Loader2, ChevronLeft, ChevronRight, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface UserMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const MacroInput = ({ label, value, onChange, icon: Icon }: { 
  label: string; 
  value: number; 
  onChange: (value: number) => void;
  icon: any;
}) => (
  <div className="space-y-2">
    <Label className="flex items-center gap-2 text-sm font-medium">
      <Icon className="w-4 h-4 text-primary" />
      {label}
    </Label>
    <div className="relative">
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="h-12 bg-white pl-4 pr-12 border-input hover:bg-gray-50/50"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        {label.includes("Calories") ? "kcal" : "g"}
      </div>
    </div>
  </div>
);

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isSavingMacros, setIsSavingMacros] = useState(false);
  const [showGoalsDialog, setShowGoalsDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [macros, setMacros] = useState<UserMacros>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65
  });

  // Load user macros
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setIsLoadingStats(true);
        const { data, error } = await supabase
          .from("user_macros")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setMacros({
            calories: data.calories || 2000,
            protein: data.protein || 150,
            carbs: data.carbs || 200,
            fat: data.fat || 65
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error loading profile",
          description: "Failed to load profile data. Please try refreshing the page.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleSaveMacros = async () => {
    if (!user) return;

    setIsSavingMacros(true);
    try {
      // First check if a record exists
      const { data: existingData } = await supabase
        .from("user_macros")
        .select("id")
        .eq("user_id", user.id)
        .single();

      let error;
      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("user_macros")
          .update({
            calories: macros.calories,
            protein: macros.protein,
            carbs: macros.carbs,
            fat: macros.fat,
            updated_at: new Date().toISOString()
          })
          .eq("user_id", user.id);
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from("user_macros")
          .insert({
            user_id: user.id,
            calories: macros.calories,
            protein: macros.protein,
            carbs: macros.carbs,
            fat: macros.fat
          });
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your nutritional goals have been updated.",
      });
      setShowGoalsDialog(false);
    } catch (error) {
      console.error("Error saving macros:", error);
      toast({
        title: "Error",
        description: "Failed to save nutritional goals. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSavingMacros(false);
    }
  };

  const steps = [
    {
      title: "Daily Calories",
      description: "Set your target daily calorie intake",
      icon: Target,
      content: (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <Target className="w-8 h-8 mx-auto text-primary" />
            <h3 className="text-lg font-semibold">Set Your Daily Calorie Goal</h3>
            <p className="text-sm text-muted-foreground">
              This helps us tailor recipes and meal plans to your energy needs
            </p>
          </div>
          <MacroInput
            label="Daily Calories"
            value={macros.calories}
            onChange={(value) => setMacros(prev => ({ ...prev, calories: value }))}
            icon={Target}
          />
        </div>
      )
    },
    {
      title: "Protein Goal",
      description: "Set your daily protein target",
      icon: Dumbbell,
      content: (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <Dumbbell className="w-8 h-8 mx-auto text-primary" />
            <h3 className="text-lg font-semibold">Protein Target</h3>
            <p className="text-sm text-muted-foreground">
              Protein is essential for muscle maintenance and recovery
            </p>
          </div>
          <MacroInput
            label="Daily Protein (g)"
            value={macros.protein}
            onChange={(value) => setMacros(prev => ({ ...prev, protein: value }))}
            icon={Dumbbell}
          />
        </div>
      )
    },
    {
      title: "Carbs & Fat",
      description: "Set your carbs and fat targets",
      icon: Brain,
      content: (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <Brain className="w-8 h-8 mx-auto text-primary" />
            <h3 className="text-lg font-semibold">Carbs & Fat Balance</h3>
            <p className="text-sm text-muted-foreground">
              Balance your energy sources for optimal performance
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MacroInput
              label="Daily Carbs (g)"
              value={macros.carbs}
              onChange={(value) => setMacros(prev => ({ ...prev, carbs: value }))}
              icon={Brain}
            />
            <MacroInput
              label="Daily Fat (g)"
              value={macros.fat}
              onChange={(value) => setMacros(prev => ({ ...prev, fat: value }))}
              icon={Scale}
            />
          </div>
        </div>
      )
    }
  ];

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <BaseLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        {isLoadingStats ? (
          <div className="bg-gradient-to-b from-primary/5 to-background border-b">
            <div className="container mx-auto px-4 py-6 sm:py-12">
              <LoadingSpinner />
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-primary/5 to-background border-b">
            <div className="container mx-auto px-4 py-6 sm:py-12">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-8">
                <Avatar className="w-20 h-20 sm:w-32 sm:h-32 border-4 border-white shadow-lg bg-primary/10">
                  {user.user_metadata?.avatar_url ? (
                    <AvatarImage 
                      src={user.user_metadata.avatar_url} 
                      alt={user.user_metadata?.full_name || user.email}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="text-2xl font-semibold text-primary bg-primary/10">
                      {(user.user_metadata?.full_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-center sm:text-left flex-1 space-y-1 sm:space-y-2 pb-2">
                  <h1 className="text-xl sm:text-3xl font-bold">
                    {user.user_metadata?.full_name || user.email}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {format(new Date(user.created_at), 'MMM yyyy')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Nutritional Goals Card */}
            <Card className="p-6 bg-white border shadow-sm">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Nutritional Goals</h2>
                    <p className="text-sm text-muted-foreground">Your daily macro targets</p>
                  </div>
                  <Button
                    onClick={() => setShowGoalsDialog(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Update Goals
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-primary/5 p-4 rounded-lg text-center">
                    <div className="text-sm text-primary/60 font-medium">Calories</div>
                    <div className="text-2xl font-bold text-primary">{macros.calories}</div>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg text-center">
                    <div className="text-sm text-primary/60 font-medium">Protein</div>
                    <div className="text-2xl font-bold text-primary">{macros.protein}g</div>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg text-center">
                    <div className="text-sm text-primary/60 font-medium">Carbs</div>
                    <div className="text-2xl font-bold text-primary">{macros.carbs}g</div>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg text-center">
                    <div className="text-sm text-primary/60 font-medium">Fat</div>
                    <div className="text-2xl font-bold text-primary">{macros.fat}g</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Saved Items Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Saved Recipes Preview */}
              <Card className="p-6 bg-white border shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <ChefHat className="w-5 h-5 text-primary" />
                        Saved Recipes
                      </h2>
                      <p className="text-sm text-muted-foreground">Your recipe collection</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/")}
                      className="text-primary hover:text-primary hover:bg-primary/5"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Access all your saved recipes from the home page
                  </div>
                </div>
              </Card>

              {/* Saved Meal Plans Preview */}
              <Card className="p-6 bg-white border shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Meal Plans
                      </h2>
                      <p className="text-sm text-muted-foreground">Your saved meal plans</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/")}
                      className="text-primary hover:text-primary hover:bg-primary/5"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Access all your meal plans from the home page
                  </div>
                </div>
              </Card>
            </div>

            {/* Account Info Card */}
            <Card className="p-6 bg-white border shadow-sm">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold">Account Information</h2>
                  <p className="text-sm text-muted-foreground">Your account details</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <div className="text-muted-foreground">
                      {user.user_metadata?.full_name || "Not set"}
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="text-muted-foreground">{user.email}</div>
                  </div>
                  <div>
                    <Label>Member Since</Label>
                    <div className="text-muted-foreground">
                      {format(new Date(user.created_at), 'MMMM d, yyyy')}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>

        {/* Nutritional Goals Dialog */}
        <Dialog open={showGoalsDialog} onOpenChange={setShowGoalsDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Nutrition Goals
              </DialogTitle>
              <DialogDescription>
                Set your daily nutritional targets for personalized recommendations
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-6">
              {/* Daily Calories */}
              <div className="space-y-4">
                <MacroInput
                  label="Daily Calories"
                  value={macros.calories}
                  onChange={(value) => setMacros(prev => ({ ...prev, calories: value }))}
                  icon={Target}
                />
                <div className="text-xs text-muted-foreground">
                  Recommended: 1800-2500 calories for most adults
                </div>
              </div>

              {/* Macronutrients */}
              <div className="space-y-4">
                <h3 className="font-medium text-base">Macronutrients</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <MacroInput
                    label="Protein"
                    value={macros.protein}
                    onChange={(value) => setMacros(prev => ({ ...prev, protein: value }))}
                    icon={Dumbbell}
                  />
                  <MacroInput
                    label="Carbs"
                    value={macros.carbs}
                    onChange={(value) => setMacros(prev => ({ ...prev, carbs: value }))}
                    icon={Brain}
                  />
                  <MacroInput
                    label="Fat"
                    value={macros.fat}
                    onChange={(value) => setMacros(prev => ({ ...prev, fat: value }))}
                    icon={Scale}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Recommended ratios: 10-35% protein, 45-65% carbs, 20-35% fat
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  onClick={handleSaveMacros}
                  disabled={isSavingMacros}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isSavingMacros ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Save Goals
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </BaseLayout>
  );
}