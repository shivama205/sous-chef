import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const loadingMessages = [
  "Cooking up your perfect meal plan... 🍳",
  "Mixing healthy ingredients... 🥗",
  "Balancing your macros... 💪",
  "Sprinkling some nutrition magic... ✨",
  "Taste-testing your menu... 😋",
  "Adding a pinch of variety... 🌮",
  "Making sure everything is delicious... 🍽️",
  "Almost ready to serve... 🍽️"
];

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  useRotatingMessages?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message,
  useRotatingMessages = true
}) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [loadingInterval, setLoadingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoading && useRotatingMessages) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
      setLoadingInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
    return () => {
      if (loadingInterval) clearInterval(loadingInterval);
    };
  }, [isLoading, useRotatingMessages]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/10 backdrop-blur flex flex-col items-center justify-center z-40"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <motion.p 
            key={messageIndex}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="text-lg font-medium text-primary text-center max-w-md mx-4"
          >
            {useRotatingMessages ? loadingMessages[messageIndex] : message}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay; 