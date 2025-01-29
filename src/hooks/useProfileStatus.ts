import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

interface ProfileStatus {
  isComplete: boolean;
  profile: any | null;
}

export function useProfileStatus() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>({
    isComplete: false,
    profile: null
  });

  useEffect(() => {
    async function checkProfileStatus() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/users/profile/status', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setProfileStatus(response.data);
      } catch (error) {
        console.error('Error checking profile status:', error);
        toast({
          title: 'Error',
          description: 'Failed to check profile status',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }

    checkProfileStatus();
  }, [user]);

  return {
    isLoading,
    isComplete: profileStatus.isComplete,
    profile: profileStatus.profile
  };
} 