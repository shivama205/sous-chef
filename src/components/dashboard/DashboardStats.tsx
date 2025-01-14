import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Package, ChartBar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardStatsProps {
  savedPlansCount: number;
  creditsUsed: number;
  maxCredits: number;
}

export const DashboardStats = ({ savedPlansCount, creditsUsed, maxCredits }: DashboardStatsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Saved Meal Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{savedPlansCount}</div>
          <Button 
            variant="link" 
            onClick={() => navigate('/profile')}
            className="p-0 h-auto font-normal text-sm text-muted-foreground"
          >
            View all plans →
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBar className="w-5 h-5 text-primary" />
            Credits Used
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{creditsUsed}</div>
          <Progress value={(creditsUsed / maxCredits) * 100} className="mt-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {maxCredits - creditsUsed} credits remaining
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">Free</div>
          <Button 
            onClick={() => navigate('/pricing')}
            className="mt-4 bg-gradient-to-r from-primary to-primary/80"
          >
            Upgrade Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};