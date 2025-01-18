import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpgradeDialog = ({ open, onOpenChange }: UpgradeDialogProps) => {
  const navigate = useNavigate();
  
  const handleViewPricing = () => {
    onOpenChange(false);
    navigate('/pricing');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] gap-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Upgrade Your Plan
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Upgrade your plan to unlock all features and get unlimited access.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Button 
            onClick={handleViewPricing}
            className="h-11 bg-gradient-to-r from-secondary to-secondary/80 hover:opacity-90 transition-all duration-200"
          >
            View Pricing
          </Button>
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