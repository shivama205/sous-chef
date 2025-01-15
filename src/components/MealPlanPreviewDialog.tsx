import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MealPlan } from "@/types/mealPlan";
import { Download } from "lucide-react";
import MealPlanDownloadView from "./MealPlanDownloadView";

interface MealPlanPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealPlan: MealPlan;
  planName: string;
  onDownload: () => void;
  previewRef: React.RefObject<HTMLDivElement>;
}

export function MealPlanPreviewDialog({
  open,
  onOpenChange,
  mealPlan,
  planName,
  onDownload,
  previewRef,
}: MealPlanPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Download Meal Plan</DialogTitle>
          <DialogDescription>
            Preview your meal plan before downloading. The downloaded image will look exactly like this.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 border rounded-lg overflow-hidden">
          <div ref={previewRef}>
            <MealPlanDownloadView mealPlan={mealPlan} planName={planName} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onDownload} className="gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 