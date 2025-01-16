import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavigationBar from "@/components/NavigationBar";
import { MealPlan } from "@/types/mealPlan";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Calculator } from "lucide-react";
import type { UserMacros } from "@/types/macros";

interface SavedMealPlan {
  id: string;
  name: string;
  plan: MealPlan;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [savedMealPlans, setSavedMealPlans] = useState<SavedMealPlan[]>([]);
  const [savedMacros, setSavedMacros] = useState<UserMacros | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/');
        return;
      }
      setUser(session.user);
      setIsLoading(true);

      // Fetch meal plans
      const { data: mealPlans, error: mealPlansError } = await supabase
        .from('saved_meal_plans')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (!mealPlansError && mealPlans) {
        setSavedMealPlans(mealPlans);
      }

      // Fetch saved macros
      const { data: macros, error: macrosError } = await supabase
        .from('user_macros')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (!macrosError && macros) {
        setSavedMacros(macros);
      }

      setIsLoading(false);
    };

    getUser();
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
                <AvatarFallback>{user.user_metadata.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.user_metadata.full_name}</CardTitle>
                <CardDescription className="text-base">{user.email}</CardDescription>
              </div>
            </CardHeader>
          </Card>

          {savedMacros && (
            <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Your Macro Goals
                    </CardTitle>
                    <CardDescription>Last updated: {format(new Date(savedMacros.last_updated), 'PPP')}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Daily Calories</p>
                    <p className="text-2xl font-semibold text-primary">{savedMacros.calories}</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Protein</p>
                    <p className="text-2xl font-semibold text-primary">{savedMacros.protein}g</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Carbs</p>
                    <p className="text-2xl font-semibold text-primary">{savedMacros.carbs}g</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Fat</p>
                    <p className="text-2xl font-semibold text-primary">{savedMacros.fat}g</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Your Meal Plans
              </CardTitle>
              <CardDescription>Your personalized meal plans</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="relative overflow-hidden">
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-[200px] w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : savedMealPlans.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {savedMealPlans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card 
                        className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => navigate(`/meal-plan/${plan.id}`)}
                      >
                        <CardHeader>
                          <CardTitle>{plan.name}</CardTitle>
                          <CardDescription>
                            Created {format(new Date(plan.created_at), 'PPP')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-muted-foreground">
                            {plan.plan.days.length} days meal plan
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No saved meal plans yet. Create your first meal plan to see it here!
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;