import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OutOfCreditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OutOfCreditDialog = ({ open, onOpenChange }: OutOfCreditDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Out of Credits
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            You've run out of credits. Purchase more credits or subscribe to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Button 
            onClick={() => window.location.href = '/pricing'} 
            className="w-full bg-gradient-to-r from-primary to-primary/80"
          >
            View Pricing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 