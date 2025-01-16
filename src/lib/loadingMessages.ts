import { LoadingMessage } from "@/components/LoadingOverlay";

export const mealPlanLoadingMessages: LoadingMessage[] = [
  { 
    message: "Cooking up your perfect meal plan... 🍳", 
    submessage: "This might take a minute..." 
  },
  { 
    message: "Mixing healthy ingredients... 🥗", 
    submessage: "Finding the perfect balance..." 
  },
  { 
    message: "Balancing your macros... 💪", 
    submessage: "Making sure everything fits your goals..." 
  },
  { 
    message: "Sprinkling some nutrition magic... ✨", 
    submessage: "Adding variety to your meals..." 
  },
  { 
    message: "Taste-testing your menu... 😋", 
    submessage: "Making sure everything is delicious..." 
  },
  { 
    message: "Adding a pinch of variety... 🌮", 
    submessage: "No boring meals here..." 
  },
  { 
    message: "Making sure everything is delicious... 🍽️", 
    submessage: "Almost ready..." 
  },
  { 
    message: "Almost ready to serve... 🍽️", 
    submessage: "Just a few more moments..." 
  }
];

export const useLoadingMessages = (messages: LoadingMessage[]) => {
  let currentIndex = 0;
  
  const getNextMessage = () => {
    currentIndex = (currentIndex + 1) % messages.length;
    return messages[currentIndex];
  };

  const getCurrentMessage = () => messages[currentIndex];
  
  const resetIndex = () => {
    currentIndex = 0;
  };

  return {
    getNextMessage,
    getCurrentMessage,
    resetIndex
  };
}; 