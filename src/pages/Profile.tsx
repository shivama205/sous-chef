import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavigationBar from "@/components/NavigationBar";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SavedMealPlan {
  id: string;
  name: string;
  plan: any;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [savedMealPlans, setSavedMealPlans] = useState<SavedMealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }
      setUser(user);
      fetchSavedMealPlans(user.id);
    };

    getUser();
  }, [navigate]);

  const fetchSavedMealPlans = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('saved_meal_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedMealPlans(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch saved meal plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMealPlan = async (planId: string) => {
    try {
      const { error } = await supabase
        .from('saved_meal_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      setSavedMealPlans(prev => prev.filter(plan => plan.id !== planId));
      toast({
        title: "Success",
        description: "Meal plan deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete meal plan",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <p className="text-gray-600">{user?.email}</p>
              </div>
              <div>
                <Label>Name</Label>
                <p className="text-gray-600">{user?.user_metadata?.full_name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Meal Plans</CardTitle>
          </CardHeader>
          <CardContent>
            {savedMealPlans.length === 0 ? (
              <p className="text-gray-600">No saved meal plans yet.</p>
            ) : (
              <div className="space-y-4">
                {savedMealPlans.map((plan) => (
                  <Card key={plan.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{plan.name}</h3>
                        <p className="text-sm text-gray-500">
                          Saved on {new Date(plan.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => navigate('/meal-plan', { state: { plan: plan.plan } })}
                        >
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => deleteMealPlan(plan.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;