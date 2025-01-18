import { Download, Share } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MealPlanDownloadView } from "@/components/MealPlanDownloadView";
import { useState, useRef } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { MealPlan } from "@/types/mealPlan";

interface MealPlanActionsProps {
  mealPlan: MealPlan;
  planName: string;
  mealPlanId: string;
}

export function MealPlanActions({ mealPlan, planName, mealPlanId }: MealPlanActionsProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `meal-plan-${mealPlanId}.png`;
      link.href = dataUrl;
      link.click();
      
      setPreviewOpen(false);
      toast.success('Meal plan downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download meal plan');
      console.error('Download error:', error);
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: 'Meal Plan',
        text: `Check out my meal plan on SousChef AI!`,
        url: `https://sous-chef.in/shared/meal-plan/${mealPlanId}`
      };

      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Meal plan shared successfully!');
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share meal plan');
      console.error('Share error:', error);
    }
  };

  return (
    <div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <Button
          variant="outline"
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-secondary/10 to-secondary/5 hover:from-secondary/20 hover:to-secondary/10 text-secondary border-secondary/20 hover:border-secondary/30"
          onClick={() => setPreviewOpen(true)}
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
        <Button
          variant="outline"
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-secondary/10 to-secondary/5 hover:from-secondary/20 hover:to-secondary/10 text-secondary border-secondary/20 hover:border-secondary/30"
          onClick={handleShare}
        >
          <Share className="w-4 h-4" />
          Share
        </Button>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[900px] p-6 bg-gradient-to-br from-secondary/[0.02] to-transparent">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-secondary">Preview Download</DialogTitle>
            <DialogDescription className="text-secondary/70">
              Review how your meal plan will look when downloaded
            </DialogDescription>
          </DialogHeader>
          
          <div ref={previewRef} className="my-4">
            <MealPlanDownloadView mealPlan={mealPlan} planName={planName} />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewOpen(false)}
              className="flex items-center gap-2 border-secondary/20 hover:border-secondary/30 text-secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              <Download className="w-4 h-4" />
              Download Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MealPlanActions; 