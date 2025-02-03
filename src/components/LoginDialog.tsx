import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GoogleSignInButton from "./GoogleSignInButton";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectPath?: string;
  state?: any;
}

export const LoginDialog = ({ open, onOpenChange, redirectPath, state }: LoginDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] gap-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Sign In Required
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Please sign in to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <GoogleSignInButton 
            redirectPath={redirectPath}
            state={state}
          />
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="h-11"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 