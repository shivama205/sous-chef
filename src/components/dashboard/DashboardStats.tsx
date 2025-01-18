import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ChartBar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardStatsProps {
  savedPlansCount: number;
  totalFeatureUsage: number;
}

export const DashboardStats = ({ savedPlansCount, totalFeatureUsage }: DashboardStatsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid gap-4 sm:gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Saved Meal Plans
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-bold">{savedPlansCount}</div>
            <Button 
              variant="link" 
              onClick={() => navigate('/profile')}
              className="p-0 h-auto font-normal text-xs sm:text-sm text-muted-foreground"
            >
              View all plans →
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <ChartBar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Features Used
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-bold">{totalFeatureUsage}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Total features used this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all sm:col-span-2 lg:col-span-1">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-bold">Free</div>
            <Button 
              onClick={() => navigate('/pricing')}
              className="mt-4 w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80"
            >
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};