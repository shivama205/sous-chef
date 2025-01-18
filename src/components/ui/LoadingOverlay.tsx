import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export function LoadingOverlay({ isLoading, message = "Finding healthy alternatives..." }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-12 w-12 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-lg font-medium text-muted-foreground animate-pulse">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
} 