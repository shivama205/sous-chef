import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';
import { useProfileStatus } from '@/hooks/useProfileStatus';

export function ProfileCompletionBanner() {
  const navigate = useNavigate();
  const { isLoading, isComplete } = useProfileStatus();

  if (isLoading || isComplete) {
    return null;
  }

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UserCircle className="w-6 h-6 text-primary" />
          <div>
            <h3 className="font-medium">Complete Your Profile</h3>
            <p className="text-sm text-muted-foreground">
              Help us personalize your experience and connect you with like-minded chefs
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate('/onboarding')}
          >
            Complete Profile
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  );
} 