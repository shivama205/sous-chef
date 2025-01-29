import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { ChefHat } from "lucide-react";
import GoogleSignInButton from "./GoogleSignInButton";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess?: () => void;
  redirectPath?: string;
}

export const LoginDialog = ({ 
  open, 
  onOpenChange,
  onLoginSuccess,
  redirectPath 
}: LoginDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] gap-6">
        <DialogHeader className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to SousChef
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Join our community of passionate home chefs. Share recipes, get inspired, and connect with food enthusiasts.
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Continue with
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <GoogleSignInButton 
            onLoginSuccess={onLoginSuccess}
            redirectPath={redirectPath}
          />
          <div className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </div>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="h-11"
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 