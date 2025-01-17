import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        <Button
          onClick={() => navigate('/meal-plan')}
          className="w-full bg-gradient-to-r from-primary to-primary/80 text-sm sm:text-base"
        >
          Create New Meal Plan
        </Button>
        <Button
          onClick={() => navigate('/healthy-swap')}
          variant="secondary"
          className="w-full bg-gradient-to-r from-secondary to-secondary/80 text-sm sm:text-base"
        >
          Find Healthy Alternatives
        </Button>
        <Button
          onClick={() => navigate('/pricing')}
          variant="outline"
          className="w-full border-primary text-primary hover:bg-primary/10 text-sm sm:text-base sm:col-span-2 lg:col-span-1"
        >
          View Premium Features
        </Button>
      </CardContent>
    </Card>
  );
};