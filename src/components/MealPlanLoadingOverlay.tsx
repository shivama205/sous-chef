import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { mealPlanLoadingMessages } from "@/lib/loadingMessages";
import { useState, useEffect } from "react";
import { LoadingMessage } from "./LoadingOverlay";

interface MealPlanLoadingOverlayProps {
  isLoading: boolean;
}

export function MealPlanLoadingOverlay({ isLoading }: MealPlanLoadingOverlayProps) {
  const [currentMessage, setCurrentMessage] = useState<LoadingMessage>(mealPlanLoadingMessages[0]);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentMessage(prev => {
        const currentIndex = mealPlanLoadingMessages.findIndex(msg => msg.message === prev.message);
        return mealPlanLoadingMessages[(currentIndex + 1) % mealPlanLoadingMessages.length];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              className="relative"
            >
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </motion.div>
            <motion.div
              key={currentMessage.message}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              <h3 className="text-lg font-semibold text-primary">{currentMessage.message}</h3>
              <p className="text-sm text-muted-foreground">{currentMessage.submessage}</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 