import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  comingSoon?: boolean;
}

export const PlaceholderPage = ({
  title,
  description,
  icon = <ChefHat className="w-12 h-12" />,
  comingSoon = true
}: PlaceholderPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="text-primary">{icon}</div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          <p className="text-xl text-muted-foreground">{description}</p>
        </div>
        {comingSoon && (
          <div className="bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium inline-block">
            Coming Soon
          </div>
        )}
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
      </div>
    </div>
  );
}; 