import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavigationBar from "@/components/NavigationBar";

interface SavedMealPlan {
  id: string;
  name: string;
  plan: any;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [savedMealPlans, setSavedMealPlans] = useState<SavedMealPlan[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }
      setUser(user);
      
      // Fetch saved meal plans
      const { data: mealPlans, error } = await supabase
        .from('saved_meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (!error && mealPlans) {
        setSavedMealPlans(mealPlans);
      }
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
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
                <AvatarFallback>{user.user_metadata.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.user_metadata.full_name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saved Meal Plans</CardTitle>
              <CardDescription>Your personalized meal plans</CardDescription>
            </CardHeader>
            <CardContent>
              {savedMealPlans.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {savedMealPlans.map((plan) => (
                    <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <CardDescription>
                          Created on {new Date(plan.created_at).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-sm overflow-auto max-h-40">
                          {JSON.stringify(plan.plan, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No saved meal plans yet.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;