import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <Button
          onClick={() => navigate('/meal-plan')}
          className="bg-gradient-to-r from-primary to-primary/80"
        >
          Create New Meal Plan
        </Button>
        <Button
          onClick={() => navigate('/healthy-swap')}
          variant="secondary"
          className="bg-gradient-to-r from-secondary to-secondary/80"
        >
          Find Healthy Alternatives
        </Button>
        <Button
          onClick={() => navigate('/pricing')}
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
        >
          View Premium Features
        </Button>
      </CardContent>
    </Card>
  );
};