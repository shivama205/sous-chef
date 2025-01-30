import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { ChefHat } from 'lucide-react';
import { useStore } from '@/store';

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignInDialog({ open, onOpenChange }: SignInDialogProps) {
  const { signInWithGoogle } = useStore();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <ChefHat className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">HealthyChef</span>
          </div>
          <DialogTitle className="text-2xl">Welcome to HealthyChef</DialogTitle>
          <DialogDescription className="text-lg">
            Join our community of health-conscious chefs and start your culinary journey today.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button 
            onClick={handleSignIn}
            size="lg"
            className="w-full"
          >
            Sign in with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
